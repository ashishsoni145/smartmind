#!/usr/bin/env node
/**
 * SharpMind Android security audit.
 *
 * Three jobs, one rule: a secret is protected only when it never reaches the client.
 *
 *   security-audit.mjs source            Scan everything that can end up in the bundle.
 *   security-audit.mjs artifact [paths]  Scan a built APK/AAB: embedded React Native bundle,
 *                                        DEX, resources, manifest, native libs, signature.
 *   security-audit.mjs selftest          Prove the scanner catches real secrets and does not
 *                                        flag the values that are intentionally public.
 *
 * Findings are reported with the file, the byte offset and a MASKED excerpt. A secret value is
 * never printed in full, so this script is safe to run in CI with public logs.
 *
 * The audit deliberately does not accept obfuscation, base64, encryption-with-an-embedded-key or
 * "it moved into native code" as a fix. If something is found, the answer is to remove it from the
 * mobile build and keep it on the backend.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  SECRET_ASSIGNMENT_PATTERNS,
  SECRET_PATTERNS,
  buildAllowlist,
  classifyJwt,
  isNonPublicHost,
  mask,
} from './lib/secret-policy.mjs';
import { readEntry, readZip, writeZip } from './lib/zip.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const mobileRoot = path.resolve(here, '..');
const repoRoot = path.resolve(mobileRoot, '../..');

// --------------------------------------------------------------------------------------------
// Reporting
// --------------------------------------------------------------------------------------------

/** @type {{id:string,label:string,severity:string,where:string,detail:string}[]} */
const findings = [];
/** @type {string[]} */
const notes = [];

function resetFindings() {
  findings.length = 0;
  notes.length = 0;
}

function record(finding) {
  findings.push(finding);
}

function note(message) {
  notes.push(message);
}

function maskedExcerpt(haystack, index, length, radius = 12) {
  const start = Math.max(0, index - radius);
  const end = Math.min(haystack.length, index + length + radius);
  const before = haystack.slice(start, index).replace(/[^\x20-\x7e]/g, '.');
  const after = haystack.slice(index + length, end).replace(/[^\x20-\x7e]/g, '.');
  return `${before}[${mask(haystack.slice(index, index + length))}]${after}`;
}

// --------------------------------------------------------------------------------------------
// Public client configuration (the allowlist)
// --------------------------------------------------------------------------------------------

function loadPublicConfig() {
  const candidates = [
    path.join(mobileRoot, 'config/production.json'),
    path.join(mobileRoot, 'src/config/public-env.generated.ts'),
  ];
  const config = { apiUrl: '', supabaseUrl: '', supabaseAnonKey: '' };
  const configFile = candidates[0];
  if (fs.existsSync(configFile)) {
    try {
      const raw = JSON.parse(fs.readFileSync(configFile, 'utf8'));
      config.apiUrl = String(raw.apiUrl || '').trim();
      config.supabaseUrl = String(raw.supabaseUrl || '').trim();
      config.supabaseAnonKey = String(raw.supabaseAnonKey || '').trim();
    } catch {
      note(`Could not parse ${path.relative(repoRoot, configFile)}; allowlist built from the generated file only.`);
    }
  }
  const generatedFile = candidates[1];
  if (fs.existsSync(generatedFile)) {
    const text = fs.readFileSync(generatedFile, 'utf8');
    // The generated file is a JSON object literal; read the values without importing TS.
    for (const field of ['apiUrl', 'supabaseUrl', 'supabaseAnonKey']) {
      const match = text.match(new RegExp(`"${field}":\\s*"([^"]*)"`));
      if (match && match[1] && !config[field]) config[field] = match[1];
    }
  }
  for (const [envKey, field] of [
    ['SHARPMIND_API_URL', 'apiUrl'],
    ['NEXT_PUBLIC_API_URL', 'apiUrl'],
    ['SHARPMIND_SUPABASE_URL', 'supabaseUrl'],
    ['NEXT_PUBLIC_SUPABASE_URL', 'supabaseUrl'],
    ['SHARPMIND_SUPABASE_ANON_KEY', 'supabaseAnonKey'],
    ['NEXT_PUBLIC_SUPABASE_ANON_KEY', 'supabaseAnonKey'],
  ]) {
    const value = String(process.env[envKey] || '').trim();
    if (value && !config[field]) config[field] = value;
  }
  return config;
}

// --------------------------------------------------------------------------------------------
// Text scanning
// --------------------------------------------------------------------------------------------

/** Extract printable ASCII runs (what `strings` would print) so binary files do not create noise. */
export function asciiRuns(buffer, minLength = 8) {
  const runs = [];
  let start = -1;
  for (let index = 0; index < buffer.length; index += 1) {
    const byte = buffer[index];
    const printable = byte >= 0x20 && byte <= 0x7e;
    if (printable) {
      if (start < 0) start = index;
    } else if (start >= 0) {
      if (index - start >= minLength) runs.push({ offset: start, text: buffer.toString('ascii', start, index) });
      start = -1;
    }
  }
  if (start >= 0 && buffer.length - start >= minLength) {
    runs.push({ offset: start, text: buffer.toString('ascii', start, buffer.length) });
  }
  return runs;
}

/** Extract UTF-16LE runs - binary AndroidManifest.xml and resources.arsc store strings this way. */
export function utf16Runs(buffer, minLength = 8) {
  const runs = [];
  let chars = [];
  let start = -1;
  for (let index = 0; index + 1 < buffer.length; index += 2) {
    const low = buffer[index];
    const high = buffer[index + 1];
    const printable = high === 0 && low >= 0x20 && low <= 0x7e;
    if (printable) {
      if (start < 0) start = index;
      chars.push(String.fromCharCode(low));
    } else {
      if (start >= 0 && chars.length >= minLength) runs.push({ offset: start, text: chars.join('') });
      chars = [];
      start = -1;
    }
  }
  if (start >= 0 && chars.length >= minLength) runs.push({ offset: start, text: chars.join('') });
  return runs;
}

/**
 * Scan one blob of text (or extracted runs) for secret shapes.
 * @param {{text:string, offset:number}[]} runs
 */
function scanRuns(runs, where, allowlist) {
  const patterns = [...SECRET_PATTERNS, ...SECRET_ASSIGNMENT_PATTERNS];
  for (const run of runs) {
    for (const pattern of patterns) {
      pattern.re.lastIndex = 0;
      let match;
      while ((match = pattern.re.exec(run.text)) !== null) {
        const value = match[0];
        if (allowlist.has(value) || allowlist.has(value.trim())) continue;
        // A URL query parameter form of a provider key (Gemini `?key=AIza...`) is still a leak.
        record({
          id: pattern.id,
          label: pattern.label,
          severity: pattern.severity,
          where,
          detail: `offset ~${run.offset + match.index}: ${maskedExcerpt(run.text, match.index, value.length)}`,
        });
        if (match.index === pattern.re.lastIndex) pattern.re.lastIndex += 1;
      }
    }
    // JWTs: the Supabase anon key is intentionally public, a service-role key never is.
    const jwtRe = /eyJ[A-Za-z0-9_-]{6,}\.[A-Za-z0-9_-]{6,}\.[A-Za-z0-9_-]{4,}/g;
    let jwt;
    while ((jwt = jwtRe.exec(run.text)) !== null) {
      const token = jwt[0];
      if (allowlist.has(token)) continue;
      const kind = classifyJwt(token);
      if (kind === 'public-anon-jwt') continue;
      record({
        id: kind === 'service-role-jwt' ? 'supabase-service-role-jwt' : 'unclassified-jwt',
        label: kind === 'service-role-jwt' ? 'Supabase service-role JWT (bypasses RLS)' : 'JWT with a non-anon role claim',
        severity: 'error',
        where,
        detail: `offset ~${run.offset + jwt.index}: ${maskedExcerpt(run.text, jwt.index, token.length)}`,
      });
    }
  }
}

function scanBuffer(buffer, where, allowlist, { textMode = false } = {}) {
  if (textMode) {
    scanRuns([{ text: buffer.toString('utf8'), offset: 0 }], where, allowlist);
    return;
  }
  scanRuns(asciiRuns(buffer), where, allowlist);
  scanRuns(utf16Runs(buffer), where, allowlist);
}

// --------------------------------------------------------------------------------------------
// Developer-host detection in distributed artifacts
// --------------------------------------------------------------------------------------------

const DEV_HOST_PATTERNS = [
  { id: 'emulator-loopback', label: 'Android emulator loopback 10.0.2.2', re: /\b10\.0\.2\.2\b/g },
  { id: 'loopback-address', label: 'loopback address 127.0.0.1', re: /\b127\.0\.0\.1\b/g },
  { id: 'localhost-host', label: 'localhost host', re: /\blocalhost\b/gi },
  { id: 'metro-port', label: 'Metro dev-server port 8081', re: /\blocalhost:8081\b|\b10\.0\.2\.2:8081\b/g },
  { id: 'lan-address', label: 'private/LAN IPv4 address', re: /\b(?:192\.168\.\d{1,3}\.\d{1,3}|172\.(?:1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3})\b/g },
];

/**
 * React Native ships dev-support code that mentions localhost/8081 in every build; it is dead in a
 * release because `__DEV__` is false and the bundle is loaded from its own assets. Those
 * occurrences are informational. Two cases are hard errors:
 *
 *   1. the developer host is the value of the app's OWN `apiUrl` config field, and
 *   2. the developer host is baked into the Android resource table (`react_native_dev_server_ip`,
 *      a build-machine LAN address the React Native Gradle plugin writes unless it is pinned).
 */
function scanDevHosts(buffer, where, { distributed, isAppBundle = false, isResourceTable = false }) {
  if (!distributed) return;
  const text = buffer.toString('utf8');
  const patterns = isResourceTable
    ? [...DEV_HOST_PATTERNS, { id: 'private-ipv4', label: 'private IPv4 address', re: /\b(?:10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(?:1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3})\b/g }]
    : DEV_HOST_PATTERNS;

  for (const pattern of patterns) {
    pattern.re.lastIndex = 0;
    let match;
    let count = 0;
    let ownConfig = false;
    while ((match = pattern.re.exec(text)) !== null) {
      count += 1;
      // Only the text BEFORE the match can prove this is the value of a config field.
      const before = text.slice(Math.max(0, match.index - 80), match.index);
      if (/["']?api_?url["']?\s*[:=]\s*["']?(?:https?:\/\/)?$/i.test(before)) ownConfig = true;
      if (match.index === pattern.re.lastIndex) pattern.re.lastIndex += 1;
    }
    if (count === 0) continue;

    if (isResourceTable) {
      record({
        id: `dev-host-in-resources:${pattern.id}`,
        label: `${pattern.label} baked into the Android resource table`,
        severity: 'error',
        where,
        detail:
          'A distributed artifact must not carry a developer-machine address. The React Native Gradle plugin writes the build ' +
          "machine's LAN IPv4 into res/values as react_native_dev_server_ip; android/app/build.gradle pins it to 0.0.0.0 for " +
          'qaStandalone/release. If this fired, that pinning stopped working.',
      });
      continue;
    }
    if (ownConfig) {
      record({
        id: `dev-host-in-config:${pattern.id}`,
        label: `${pattern.label} used as the backend URL`,
        severity: 'error',
        where,
        detail: 'The client config points at a developer machine. A distributed build must use the public HTTPS backend URL.',
      });
    } else if (isAppBundle) {
      note(`${where}: ${count} occurrence(s) of ${pattern.label} inside React Native dev-support code (unreachable in a distributed bundle, where __DEV__ is false).`);
    }
  }
}

// --------------------------------------------------------------------------------------------
// React Native bundle verification
// --------------------------------------------------------------------------------------------

const HERMES_MAGIC = Buffer.from([0xc6, 0x1f, 0xbc, 0x03, 0xc1, 0x03, 0x19, 0x1f]);

function isHermesBytecode(buffer) {
  return buffer.length >= 8 && buffer.subarray(0, 8).equals(HERMES_MAGIC);
}

function findBundleEntries(entries) {
  return entries.filter((entry) => /(^|\/)assets\/index\.android\.bundle$/.test(entry.name) || /(^|\/)assets\/.*\.bundle$/.test(entry.name));
}

// --------------------------------------------------------------------------------------------
// Signature inspection
// --------------------------------------------------------------------------------------------

const APK_SIG_BLOCK_MAGIC = Buffer.from('APK Sig Block 42', 'ascii');
const DEBUG_CERT_MARKERS = [Buffer.from('Android Debug', 'utf8'), Buffer.from('Android Debug', 'utf16le'), Buffer.from('androiddebugkey', 'utf8')];

function containsDebugCertificate(buffer) {
  for (const marker of DEBUG_CERT_MARKERS) {
    if (buffer.includes(marker)) return true;
  }
  return false;
}

function findApkSigningBlock(buffer) {
  // EOCD -> central directory offset -> signing block sits immediately before it.
  let eocd = -1;
  const floor = Math.max(0, buffer.length - 22 - 0xffff);
  for (let offset = buffer.length - 22; offset >= floor; offset -= 1) {
    if (buffer.readUInt32LE(offset) === 0x06054b50) {
      eocd = offset;
      break;
    }
  }
  if (eocd < 0) return null;
  let centralOffset = buffer.readUInt32LE(eocd + 16);
  if (centralOffset === 0xffffffff) {
    const locator = eocd - 20;
    if (locator < 0 || buffer.readUInt32LE(locator) !== 0x07064b50) return null;
    const eocd64 = Number(buffer.readBigUInt64LE(locator + 8));
    if (eocd64 + 56 > buffer.length) return null;
    centralOffset = Number(buffer.readBigUInt64LE(eocd64 + 48));
  }
  if (centralOffset < 24 || centralOffset > buffer.length) return null;
  const magicStart = centralOffset - 16;
  if (!buffer.subarray(magicStart, centralOffset).equals(APK_SIG_BLOCK_MAGIC)) return null;
  const blockSize = Number(buffer.readBigUInt64LE(centralOffset - 24));
  const blockStart = centralOffset - blockSize - 8;
  if (blockStart < 0) return null;
  return buffer.subarray(blockStart, centralOffset);
}

/**
 * A release artifact must never be signed with the Android debug certificate. The check looks for
 * the debug certificate's Distinguished Name inside the signature material only - never inside the
 * app payload, where a false positive would be meaningless.
 */
function inspectSignature(zip, filePath, { distributed }) {
  const signatureEntries = zip.entries.filter((entry) => /^META-INF\/.*\.(RSA|DSA|EC)$/i.test(entry.name));
  let checked = 0;
  let debugSigned = false;
  for (const entry of signatureEntries) {
    const bytes = readEntry(zip, entry);
    if (!bytes) continue;
    checked += 1;
    if (containsDebugCertificate(bytes)) debugSigned = true;
  }

  const raw = fs.readFileSync(filePath);
  const signingBlock = findApkSigningBlock(raw);
  if (signingBlock) {
    checked += 1;
    if (containsDebugCertificate(signingBlock)) debugSigned = true;
  }

  if (checked === 0) {
    note(`${path.basename(filePath)}: no v1 (META-INF) or v2/v3 (APK Signing Block) signature material found; signature identity could not be verified by this script. CI additionally runs apksigner/keytool when the Android SDK is present.`);
    return { method: 'none', debugSigned: false };
  }

  if (debugSigned && distributed) {
    record({
      id: 'debug-signed-release',
      label: 'distributed artifact signed with the Android debug certificate',
      severity: 'error',
      where: path.basename(filePath),
      detail: 'A release/QA-Play artifact must be signed with the upload keystore held only in CI secrets. Never upload a debug-signed artifact to Google Play.',
    });
  } else if (debugSigned) {
    note(`${path.basename(filePath)}: signed with the Android debug certificate (expected for a debug/QA engineering build).`);
  } else {
    note(`${path.basename(filePath)}: signature material present and is NOT the Android debug certificate.`);
  }
  return { method: signatureEntries.length > 0 && signingBlock ? 'v1+v2/v3' : signatureEntries.length > 0 ? 'v1' : 'v2/v3', debugSigned };
}

// --------------------------------------------------------------------------------------------
// Artifact audit
// --------------------------------------------------------------------------------------------

function inferAppEnv(artifactPath) {
  const normalized = artifactPath.replace(/\\/g, '/');
  if (/(^|\/)(release|bundle\/release)\//.test(normalized) || /\.aab$/i.test(normalized)) return 'release';
  if (/qastandalone|(^|\/)qa\//i.test(normalized)) return 'qa';
  if (/(^|\/)debug\//.test(normalized)) return 'debug';
  return 'release';
}

export function auditArtifact(artifactPath, { appEnv, config }) {
  const resolvedEnv = appEnv || inferAppEnv(artifactPath);
  const distributed = resolvedEnv !== 'debug';
  const isAab = /\.aab$/i.test(artifactPath);
  const relative = path.relative(repoRoot, artifactPath) || artifactPath;
  const stats = fs.statSync(artifactPath);
  const allowlist = buildAllowlist(config);

  note(`Auditing ${relative} (${(stats.size / (1024 * 1024)).toFixed(1)} MB, appEnv=${resolvedEnv}, ${isAab ? 'AAB' : 'APK'})`);

  const zip = readZip(artifactPath);
  const entryNames = zip.entries.map((entry) => entry.name);

  // -- 1. React Native JavaScript bundle must be inside the artifact --------------------------
  const bundleEntries = findBundleEntries(zip.entries);
  if (bundleEntries.length === 0) {
    record({
      id: 'missing-js-bundle',
      label: 'React Native JavaScript bundle is missing from the artifact',
      severity: distributed ? 'error' : 'warning',
      where: relative,
      detail: distributed
        ? `Expected ${isAab ? 'base/assets/index.android.bundle' : 'assets/index.android.bundle'}. Without it the app needs Metro and will not start on a phone. The React Native Gradle plugin bundles JS for every variant except ${'`debug`/`debugOptimized`'}; check android/app/build.gradle and the createBundle*JsAndAssets task output.`
        : 'Debug builds load JS from Metro, so no bundle is expected.',
    });
  } else {
    for (const entry of bundleEntries) {
      const bytes = readEntry(zip, entry);
      if (!bytes) {
        record({ id: 'unreadable-js-bundle', label: 'JavaScript bundle could not be decoded', severity: 'error', where: `${relative}!${entry.name}`, detail: 'Entry is compressed with an unsupported method or is encrypted.' });
        continue;
      }
      const hermes = isHermesBytecode(bytes);
      note(`JS bundle present: ${entry.name} (${(bytes.length / 1024).toFixed(0)} KB, ${hermes ? 'Hermes bytecode' : 'plain JavaScript'})`);
      if (bytes.length < 50 * 1024) {
        record({
          id: 'suspiciously-small-bundle',
          label: 'JavaScript bundle is implausibly small',
          severity: 'warning',
          where: `${relative}!${entry.name}`,
          detail: `${bytes.length} bytes. A real SharpMind bundle is hundreds of kilobytes; this suggests the bundle step produced a stub.`,
        });
      }
      if (distributed && !hermes) {
        note(`${entry.name} is plain JavaScript, not Hermes bytecode. hermesEnabled is true in gradle.properties, so a distributed build is normally compiled by hermesc.`);
      }
      // The bundle is the highest-value target: scan it as text.
      scanBuffer(bytes, `${relative}!${entry.name}`, allowlist, { textMode: !hermes });
      if (hermes) {
        // Bytecode: scan the embedded string table via printable runs instead of raw bytes.
        scanRuns(asciiRuns(bytes, 10), `${relative}!${entry.name}`, allowlist);
      }
      scanDevHosts(bytes, `${relative}!${entry.name}`, { distributed, isAppBundle: true });

      // Confirm the production backend URL actually made it into the bundle.
      if (distributed && config.apiUrl) {
        const needle = config.apiUrl.replace(/\/+$/, '');
        if (bytes.includes(Buffer.from(needle, 'utf8'))) {
          note(`Bundle contains the configured production API base URL (${needle}).`);
        } else {
          record({
            id: 'api-url-not-in-bundle',
            label: 'configured production API URL was not found in the JavaScript bundle',
            severity: 'error',
            where: `${relative}!${entry.name}`,
            detail: `The build was configured with ${needle} but the bundle does not contain it. The artifact was probably built from a stale generated config. Rebuild.`,
          });
        }
      }
    }
  }

  // -- 2. Every other entry -------------------------------------------------------------------
  const skipScan = /^(res\/drawable.*\.png|res\/mipmap.*\.png|.*\.webp|.*\.png|.*\.jpg|.*\.9\.png)$/i;
  for (const entry of zip.entries) {
    if (bundleEntries.some((bundle) => bundle.name === entry.name)) continue;
    if (entry.uncompressedSize === 0) continue;
    if (skipScan.test(entry.name)) continue;
    // Cap per-entry work; a 200 MB entry would otherwise dominate the audit.
    if (entry.uncompressedSize > 64 * 1024 * 1024) {
      note(`${relative}!${entry.name} is larger than 64 MB; scanned as printable runs only.`);
    }
    const bytes = readEntry(zip, entry);
    if (!bytes) continue;
    const where = `${relative}!${entry.name}`;
    const textual = /\.(json|js|bundle|ts|xml|properties|txt|pro|cfg|html|css|map)$/i.test(entry.name);
    scanBuffer(bytes, where, allowlist, { textMode: textual });
    if (/resources\.(arsc|pb)$/i.test(entry.name)) {
      scanDevHosts(bytes, where, { distributed, isResourceTable: true });
    } else if (/\.(dex|so)$/i.test(entry.name) || entry.name.endsWith('AndroidManifest.xml')) {
      scanDevHosts(bytes, where, { distributed });
    }
  }

  // -- 3. Signature ---------------------------------------------------------------------------
  inspectSignature(zip, artifactPath, { distributed });

  // -- 4. Cleartext traffic in a distributed artifact ----------------------------------------
  if (distributed) {
    const manifest = zip.entries.find((entry) => /(^|\/)AndroidManifest\.xml$/.test(entry.name));
    if (manifest) {
      const bytes = readEntry(zip, manifest);
      if (bytes) {
        const runs = [...asciiRuns(bytes, 6).map((run) => run.text), ...utf16Runs(bytes, 6).map((run) => run.text)];
        const cleartext = runs.find((text) => /usesCleartextTraffic/.test(text));
        note(`${relative}: AndroidManifest.xml ${cleartext ? 'declares usesCleartextTraffic (verify it resolves to false for this variant)' : 'does not declare usesCleartextTraffic in a readable string run (it is a boolean attribute; verify with aapt2/apkanalyzer in CI)'}.`);
      }
    }
    if (entryNames.some((name) => /^assets\/\.expo|^assets\/expo/.test(name))) {
      note(`${relative}: Expo assets detected - unexpected for a bare React Native build.`);
    }
  }

  // -- 5. Public configuration sanity ---------------------------------------------------------
  if (distributed && config.apiUrl) {
    let host = '';
    try {
      host = new URL(config.apiUrl).hostname;
    } catch {
      host = '';
    }
    if (!host || isNonPublicHost(host)) {
      record({
        id: 'config-points-at-developer-host',
        label: 'the build configuration itself points at a developer host',
        severity: 'error',
        where: 'apps/mobile/config/production.json',
        detail: `API host "${host || '(unparseable)'}" is not a public host. Fix the configuration, then rebuild.`,
      });
    }
  }

  return { appEnv: resolvedEnv, entries: zip.entries.length, entryNames };
}

// --------------------------------------------------------------------------------------------
// Source audit
// --------------------------------------------------------------------------------------------

const SOURCE_TARGETS = [
  'apps/mobile/src',
  'apps/mobile/index.js',
  'apps/mobile/app.json',
  'apps/mobile/config',
  'apps/mobile/android/app/src/main',
  'apps/mobile/android/app/build.gradle',
  'apps/mobile/android/build.gradle',
  'apps/mobile/android/gradle.properties',
  'apps/mobile/android/settings.gradle',
  'apps/mobile/scripts',
  'packages/api-client/src',
  'packages/types/src',
];

const SOURCE_SKIP = /(node_modules|\/build\/|\.gradle\/|__tests__|security-audit\.mjs|secret-policy\.mjs|\.map$|\.png$|\.jar$|debug\.keystore)/;

function walk(target, out) {
  const absolute = path.isAbsolute(target) ? target : path.join(repoRoot, target);
  if (!fs.existsSync(absolute)) return out;
  const stat = fs.statSync(absolute);
  if (stat.isFile()) {
    out.push(absolute);
    return out;
  }
  for (const entry of fs.readdirSync(absolute, { withFileTypes: true })) {
    const child = path.join(absolute, entry.name);
    if (SOURCE_SKIP.test(child.replace(/\\/g, '/'))) continue;
    if (entry.isDirectory()) walk(child, out);
    else if (entry.isFile()) out.push(child);
  }
  return out;
}

export function auditSources({ config }) {
  const allowlist = buildAllowlist(config);
  const files = [];
  for (const target of SOURCE_TARGETS) walk(target, files);
  note(`Scanning ${files.length} source file(s) that can reach the mobile bundle or the Android build.`);
  let scanned = 0;
  for (const file of files) {
    const relative = path.relative(repoRoot, file);
    const stats = fs.statSync(file);
    if (stats.size > 8 * 1024 * 1024) continue;
    const bytes = fs.readFileSync(file);
    const textual = /\.(ts|tsx|js|jsx|mjs|cjs|json|md|gradle|kts|properties|xml|pro|kt|java|yml|yaml|txt)$/i.test(file);
    scanBuffer(bytes, relative, allowlist, { textMode: textual });
    scanned += 1;
  }
  note(`Scanned ${scanned} file(s).`);

  // A committed generated config would defeat the whole scheme.
  const generated = path.join(mobileRoot, 'src/config/public-env.generated.ts');
  if (fs.existsSync(generated)) {
    const ignored = spawnSync('git', ['-C', repoRoot, 'check-ignore', '-q', generated], { stdio: 'ignore' });
    if (ignored.status !== 0) {
      record({
        id: 'generated-config-not-ignored',
        label: 'src/config/public-env.generated.ts is not git-ignored',
        severity: 'error',
        where: '.gitignore',
        detail: 'The generated client config must never be committed. Add it to .gitignore.',
      });
    }
  }

  // No committed keystore other than the public React Native debug keystore. Scanned without the
  // SOURCE_SKIP filter, which would otherwise hide exactly the file this check is about.
  const keystores = [];
  const keystoreRoot = path.join(mobileRoot, 'android');
  if (fs.existsSync(keystoreRoot)) {
    const stack = [keystoreRoot];
    while (stack.length > 0) {
      const current = stack.pop();
      if (/(^|\/)(build|\.gradle|node_modules)(\/|$)/.test(current.replace(/\\/g, '/'))) continue;
      for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
        const child = path.join(current, entry.name);
        if (entry.isDirectory()) stack.push(child);
        else if (/\.(jks|keystore|p12|pfx)$/i.test(entry.name)) keystores.push(child);
      }
    }
  }
  for (const keystore of keystores) {
    const relative = path.relative(repoRoot, keystore);
    if (relative.replace(/\\/g, '/') === 'apps/mobile/android/app/debug.keystore') {
      note(`${relative}: the standard React Native debug keystore. Public by design (password "android"), used only for debug and local QA engineering builds. It must never sign a Play artifact.`);
      continue;
    }
    record({
      id: 'committed-keystore',
      label: 'a signing keystore is committed to the repository',
      severity: 'error',
      where: relative,
      detail: 'Upload keystores live only in CI secrets (SHARPMIND_KEYSTORE_BASE64) and are decoded to a temp file that is deleted after the build.',
    });
  }
  return { files: scanned };
}

// --------------------------------------------------------------------------------------------
// Self test - proves the scanner works before it is trusted with a real artifact
// --------------------------------------------------------------------------------------------

const SELFTEST_FIXTURES = [
  { name: 'OpenRouter key', text: 'const k = "sk-or-v1-abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789";', expect: 'openrouter-key' },
  { name: 'OpenAI key', text: 'OPENAI_API_KEY=sk-proj-ABCDEFGHIJ0123456789abcdefghij', expect: 'openai-style-key' },
  { name: 'Gemini key', text: 'url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyA1234567890abcdefghijklmnopqrstuv"', expect: 'google-api-key' },
  { name: 'Groq key', text: 'key: gsk_AbCdEf0123456789AbCdEf01', expect: 'groq-key' },
  { name: 'Anthropic key', text: 'x-api-key: sk-ant-api03-ABCDEFGHIJ0123456789', expect: 'anthropic-key' },
  { name: 'Supabase legacy secret', text: 'sb_secret_AbCdEfGhIjKlMnOpQrStUv', expect: 'supabase-legacy-secret-key' },
  { name: 'service-role assignment', text: 'SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIn0.abcdef', expect: 'service-role-assignment' },
  { name: 'database URL', text: 'DATABASE_URL=postgres://sharpmind:Sup3rS3cretPassword@db.internal.example.com:5432/sharpmind', expect: 'database-connection-string' },
  { name: 'private key block', text: '-----BEGIN RSA PRIVATE KEY-----\nMIIEow...', expect: 'private-key-block' },
  { name: 'GitHub token', text: 'token = ghp_AbCdEfGhIjKlMnOpQrStUvWx', expect: 'github-token' },
  { name: 'Razorpay secret', text: 'RAZORPAY_KEY_SECRET=AbCdEfGhIjKlMnOpQrSt', expect: 'razorpay-secret-key' },
  { name: 'Twilio auth token', text: 'TWILIO_AUTH_TOKEN=abcdef0123456789abcdef0123456789', expect: 'auth-token-assignment' },
];

const SELFTEST_CLEAN = [
  { name: 'public backend URL', text: 'const apiUrl = "https://sharpmindbackend-zeta.vercel.app/api/v1";' },
  { name: 'public Supabase project URL', text: 'const url = "https://vscprtuinxopistikpcs.supabase.co";' },
  { name: 'the word API_KEY in prose', text: '// Provider API_KEY values stay on the server.' },
  { name: 'environment variable name without a value', text: 'process.env.OPENROUTER_API_KEY' },
  { name: 'backend route names', text: 'POST /api/v1/tutor/sessions/:id/messages' },
];

/**
 * End-to-end check of the artifact auditor itself.
 *
 * Builds throwaway APK/AAB fixtures (real ZIP structures, real Hermes magic, real DER-ish
 * signature blobs) in a temp directory and asserts that a clean artifact passes and a leaked-secret
 * artifact is caught. Without this, "the audit passed" would only mean "the audit never ran".
 */
function runArtifactSelfTest(config) {
  let failures = 0;
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sharpmind-audit-'));
  const anonPayload = Buffer.from(
    JSON.stringify({ role: 'anon', iss: 'https://vscprtuinxopistikpcs.supabase.co/auth/v1', ref: 'vscprtuinxopistikpcs' }),
  ).toString('base64url');
  const anonJwt = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${anonPayload}.c2VsZnRlc3RzaWduYXR1cmU`;
  const servicePayload = Buffer.from(
    JSON.stringify({ role: 'service_role', iss: 'https://vscprtuinxopistikpcs.supabase.co/auth/v1', ref: 'vscprtuinxopistikpcs' }),
  ).toString('base64url');
  const serviceJwt = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${servicePayload}.c2VsZnRlc3RzaWduYXR1cmU`;
  const apiUrl = config.apiUrl || 'https://sharpmindbackend-zeta.vercel.app/api/v1';

  const expect = (condition, message) => {
    if (!condition) {
      failures += 1;
      console.error(`[selftest] FAIL: ${message}`);
    }
  };
  const ids = (list) => list.map((finding) => finding.id);

  // --- clean release AAB -----------------------------------------------------------------
  const cleanBundle = Buffer.concat([
    HERMES_MAGIC,
    Buffer.from([0x00, 0x11, 0x22, 0x33]),
    Buffer.from(`${apiUrl}\u0000https://vscprtuinxopistikpcs.supabase.co\u0000${anonJwt}\u0000SharpMind\u0000`, 'utf8'),
    Buffer.alloc(60 * 1024, 0x5a),
  ]);
  const cleanAab = path.join(dir, 'app-release.aab');
  writeZip(cleanAab, [
    { name: 'BundleConfig', data: Buffer.from(JSON.stringify({ files: [] })) },
    { name: 'base/assets/index.android.bundle', data: cleanBundle },
    { name: 'base/dex/classes.dex', data: Buffer.concat([Buffer.from('dex\n035\0', 'utf8'), Buffer.alloc(2048, 0x07), Buffer.from('Lcom/sharpmind/app/MainActivity;\0', 'utf8')]) },
    { name: 'base/resources.pb', data: Buffer.alloc(4096, 0x02) },
    { name: 'base/manifest/AndroidManifest.xml', data: Buffer.from('\u0003\u0000\u0008\u0000com.sharpmind.app\u0000android.permission.INTERNET\u0000', 'utf16le') },
    { name: 'base/lib/arm64-v8a/libhermes.so', data: Buffer.alloc(8192, 0x7f) },
    { name: 'META-INF/MANIFEST.MF', data: Buffer.from('Manifest-Version: 1.0\r\n') },
    { name: 'META-INF/PLAY.RSA', data: Buffer.concat([Buffer.from('0\x82\u0004', 'latin1'), Buffer.from('CN=SharpMind Upload, OU=Mobile, O=SharpMind', 'utf8'), Buffer.alloc(512, 0x31)]) },
  ]);

  resetFindings();
  auditArtifact(cleanAab, { appEnv: 'release', config });
  const cleanErrors = findings.filter((finding) => finding.severity === 'error');
  expect(cleanErrors.length === 0, `clean release AAB produced ${cleanErrors.length} error(s): ${ids(cleanErrors).join(', ')}`);
  expect(notes.some((line) => line.includes('JS bundle present')), 'clean release AAB did not report the embedded JS bundle');
  expect(notes.some((line) => line.includes('Hermes bytecode')), 'clean release AAB bundle was not recognised as Hermes bytecode');
  expect(notes.some((line) => line.includes('production API base URL')), 'clean release AAB did not confirm the production API URL is embedded');
  expect(notes.some((line) => line.includes('NOT the Android debug certificate')), 'clean release AAB signature was not verified as non-debug');
  const cleanNotes = notes.slice();

  // --- release APK with leaked secrets ----------------------------------------------------
  const dirtyJs = [
    '// generated',
    `export const generatedPublicEnv = { "supabaseUrl": "https://vscprtuinxopistikpcs.supabase.co", "supabaseAnonKey": "${serviceJwt}", "apiUrl": "http://10.0.2.2:4000/api/v1", "appEnv": "release" };`,
    'const openrouter = "sk-or-v1-abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789";',
    'const gemini = "AIzaSyA1234567890abcdefghijklmnopqrstuv";',
    'const db = "postgres://sharpmind:Sup3rS3cret@db.internal.example.com:5432/sharpmind";',
    'const pem = "-----BEGIN RSA PRIVATE KEY-----";',
  ].join('\n');
  const dirtyApk = path.join(dir, 'app-release.apk');
  writeZip(dirtyApk, [
    { name: 'assets/index.android.bundle', data: Buffer.from(dirtyJs, 'utf8') },
    { name: 'classes.dex', data: Buffer.concat([Buffer.alloc(1024, 0x01), Buffer.from('TWILIO_AUTH_TOKEN=abcdef0123456789abcdef0123456789\0', 'utf8'), Buffer.alloc(1024, 0x01)]) },
    { name: 'resources.arsc', data: Buffer.alloc(2048, 0x03) },
    { name: 'AndroidManifest.xml', data: Buffer.from('\u0003\u0000com.sharpmind.app\u0000', 'utf16le') },
    { name: 'META-INF/CERT.RSA', data: Buffer.concat([Buffer.from('0\x82\u0003', 'latin1'), Buffer.from('CN=Android Debug, OU=Android, O=Android', 'utf8'), Buffer.alloc(256, 0x30)]) },
  ]);

  resetFindings();
  auditArtifact(dirtyApk, { appEnv: 'release', config });
  const dirtyIds = ids(findings.filter((finding) => finding.severity === 'error'));
  for (const required of [
    'openrouter-key',
    'google-api-key',
    'database-connection-string',
    'private-key-block',
    'supabase-service-role-jwt',
    'dev-host-in-config:emulator-loopback',
    'debug-signed-release',
    'api-url-not-in-bundle',
    'auth-token-assignment',
  ]) {
    expect(dirtyIds.includes(required), `leaked-secret release APK was not flagged for "${required}" (got: ${dirtyIds.join(', ')})`);
  }
  expect(!dirtyIds.includes('missing-js-bundle'), 'a bundle that exists was reported missing');
  // The public anon JWT and the public API URL must never be reported.
  expect(!dirtyIds.some((id) => id.includes('anon')), 'a public anon JWT was reported as a leak');

  // --- debug APK with no bundle ------------------------------------------------------------
  const debugApk = path.join(dir, 'app-debug.apk');
  writeZip(debugApk, [
    { name: 'classes.dex', data: Buffer.alloc(4096, 0x01) },
    { name: 'META-INF/CERT.RSA', data: Buffer.concat([Buffer.from('CN=Android Debug', 'utf8'), Buffer.alloc(128, 0x30)]) },
  ]);
  resetFindings();
  auditArtifact(debugApk, { appEnv: 'debug', config });
  const debugErrors = findings.filter((finding) => finding.severity === 'error');
  expect(debugErrors.length === 0, `debug APK with no bundle produced ${debugErrors.length} error(s): ${ids(debugErrors).join(', ')}`);
  expect(findings.some((finding) => finding.id === 'missing-js-bundle'), 'debug APK did not note the absent bundle');

  resetFindings();
  notes.push(...cleanNotes.slice(0, 0));
  fs.rmSync(dir, { recursive: true, force: true });
  return failures;
}

export function runSelfTest() {
  const allowlist = new Set();
  let failures = runArtifactSelfTest(loadPublicConfig());

  for (const fixture of SELFTEST_FIXTURES) {
    const before = findings.length;
    scanRuns([{ text: fixture.text, offset: 0 }], `selftest:${fixture.name}`, allowlist);
    const detected = findings.slice(before).some((finding) => finding.id === fixture.expect);
    if (!detected) {
      failures += 1;
      console.error(`[selftest] FAIL: ${fixture.name} was not detected as "${fixture.expect}".`);
    }
  }

  for (const fixture of SELFTEST_CLEAN) {
    const before = findings.length;
    scanRuns([{ text: fixture.text, offset: 0 }], `selftest:${fixture.name}`, allowlist);
    const produced = findings.slice(before);
    if (produced.length > 0) {
      failures += 1;
      console.error(`[selftest] FAIL: "${fixture.name}" produced ${produced.length} false positive(s): ${produced.map((f) => f.id).join(', ')}`);
    }
  }

  // A service-role JWT must be caught even when the variable name is innocuous.
  const payload = Buffer.from(JSON.stringify({ role: 'service_role', iss: 'https://vscprtuinxopistikpcs.supabase.co/auth/v1', ref: 'vscprtuinxopistikpcs' })).toString('base64url');
  const serviceRoleJwt = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${payload}.ZmFrZXNpZ25hdHVyZQ`;
  const before = findings.length;
  scanRuns([{ text: `value: "${serviceRoleJwt}"`, offset: 0 }], 'selftest:service-role-jwt', allowlist);
  if (!findings.slice(before).some((finding) => finding.id === 'supabase-service-role-jwt')) {
    failures += 1;
    console.error('[selftest] FAIL: a service-role JWT was not detected.');
  }

  // An anon JWT must be allowed through.
  const anonPayload = Buffer.from(JSON.stringify({ role: 'anon', iss: 'https://vscprtuinxopistikpcs.supabase.co/auth/v1', ref: 'vscprtuinxopistikpcs' })).toString('base64url');
  const anonJwt = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${anonPayload}.ZmFrZXNpZ25hdHVyZQ`;
  const beforeAnon = findings.length;
  scanRuns([{ text: `value: "${anonJwt}"`, offset: 0 }], 'selftest:anon-jwt', allowlist);
  if (findings.slice(beforeAnon).length > 0) {
    failures += 1;
    console.error('[selftest] FAIL: the public Supabase anon JWT was flagged.');
  }

  // Hermes magic detection.
  const fake = Buffer.concat([HERMES_MAGIC, Buffer.alloc(16)]);
  if (!isHermesBytecode(fake)) {
    failures += 1;
    console.error('[selftest] FAIL: Hermes bytecode magic was not recognised.');
  }

  // ASCII run extraction must not split a secret.
  const binary = Buffer.concat([Buffer.from([0, 1, 2, 3]), Buffer.from('sk-or-v1-abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789'), Buffer.from([0, 0])]);
  const runs = asciiRuns(binary, 8);
  if (!runs.some((run) => run.text.startsWith('sk-or-v1-'))) {
    failures += 1;
    console.error('[selftest] FAIL: printable-run extraction lost a secret embedded in binary data.');
  }

  resetFindings();
  if (failures > 0) {
    console.error(`[selftest] ${failures} check(s) failed.`);
    return false;
  }
  console.log(`[selftest] OK - ${SELFTEST_FIXTURES.length + 4} pattern checks, ${SELFTEST_CLEAN.length} public-value checks (no false positives), and 3 synthetic APK/AAB fixtures audited end to end.`);
  return true;
}

// --------------------------------------------------------------------------------------------
// Artifact discovery
// --------------------------------------------------------------------------------------------

/**
 * Resolve an artifact path given to the CLI.
 *
 * npm runs a script with the working directory set to the *package* directory, so
 * `npm --prefix apps/mobile run audit:artifact -- <path>` executes with cwd = apps/mobile even when
 * the caller passed a path relative to the repository root. Accepting both is not convenience: the
 * `source` command already resolves its targets against the repository root, and an auditor that
 * silently reported "artifact not found" for a file that is sitting right there would be worse than
 * no auditor, because a green-looking run would have scanned nothing.
 */
function resolveArtifactPath(candidate) {
  if (path.isAbsolute(candidate)) {
    return { resolved: fs.existsSync(candidate) ? candidate : null, tried: [candidate] };
  }
  const tried = [];
  for (const base of [process.cwd(), repoRoot, mobileRoot]) {
    const absolute = path.resolve(base, candidate);
    if (tried.includes(absolute)) continue;
    tried.push(absolute);
    if (fs.existsSync(absolute)) return { resolved: absolute, tried };
  }
  return { resolved: null, tried };
}

function discoverArtifacts() {
  const roots = [
    path.join(mobileRoot, 'android/app/build/outputs/apk'),
    path.join(mobileRoot, 'android/app/build/outputs/bundle'),
  ];
  const found = [];
  for (const root of roots) {
    if (!fs.existsSync(root)) continue;
    const stack = [root];
    while (stack.length > 0) {
      const current = stack.pop();
      for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
        const child = path.join(current, entry.name);
        if (entry.isDirectory()) stack.push(child);
        else if (/\.(apk|aab)$/i.test(entry.name)) found.push(child);
      }
    }
  }
  return found.sort();
}

// --------------------------------------------------------------------------------------------
// CLI
// --------------------------------------------------------------------------------------------

function printReport({ format }) {
  const errors = findings.filter((finding) => finding.severity === 'error');
  const warnings = findings.filter((finding) => finding.severity !== 'error');

  console.log('');
  console.log('--- SharpMind client security audit ---');
  for (const line of notes) console.log(`  · ${line}`);
  console.log('');

  if (warnings.length > 0) {
    console.log(`Warnings (${warnings.length}):`);
    for (const finding of warnings) console.log(`  [${finding.severity}] ${finding.label} — ${finding.where}\n         ${finding.detail}`);
    console.log('');
  }

  if (errors.length > 0) {
    console.log(`FAILURES (${errors.length}):`);
    for (const finding of errors) {
      console.log(`  [error] ${finding.label} — ${finding.where}`);
      console.log(`          ${finding.detail}`);
      if (format === 'github') console.log(`::error title=${finding.label.replace(/,/g, '%2C')}::${finding.where}: ${finding.detail.replace(/\n/g, ' ')}`);
    }
    console.log('');
    console.log('A finding here means a privileged value crossed into the client. The fix is to remove it from');
    console.log('the mobile build and keep it on the backend - not to obfuscate, encode, encrypt or hide it.');
  } else {
    console.log('PASS: no private provider key, service-role credential, database password or signing secret found.');
    console.log('      Public values (backend HTTPS URL, Supabase project URL, Supabase anon key) are intentional and were not flagged.');
  }
  return errors.length;
}

function usage() {
  console.log(`Usage:
  node scripts/security-audit.mjs source                Scan the sources that reach the bundle.
  node scripts/security-audit.mjs artifact [paths...]   Scan built APK/AAB files (auto-discovers
                                                        android/app/build/outputs when none given).
  node scripts/security-audit.mjs selftest              Verify the detectors themselves.

Options:
  --app-env <debug|qa|release>   Override the environment inferred from the artifact path.
  --format github                Emit ::error:: annotations for GitHub Actions.
  --report-json <path>           Also write a machine-readable report.`);
}

function main(argv) {
  const args = argv.slice(2);
  const command = args.find((argument) => !argument.startsWith('--'));
  const formatIndex = args.indexOf('--format');
  const format = formatIndex >= 0 ? args[formatIndex + 1] : 'text';
  const envIndex = args.indexOf('--app-env');
  const appEnv = envIndex >= 0 ? args[envIndex + 1] : '';
  const jsonIndex = args.indexOf('--report-json');
  const reportJson = jsonIndex >= 0 ? args[jsonIndex + 1] : '';

  if (!command || !['source', 'artifact', 'selftest'].includes(command)) {
    usage();
    return 2;
  }

  const config = loadPublicConfig();

  if (command === 'selftest') {
    return runSelfTest() ? 0 : 1;
  }

  if (command === 'source') {
    auditSources({ config });
  } else {
    const explicit = args.filter((argument, index) => index > 0 && !argument.startsWith('--') && args[index - 1] !== '--app-env' && args[index - 1] !== '--format' && args[index - 1] !== '--report-json');
    const artifacts = explicit.length > 0 ? explicit : discoverArtifacts();
    if (artifacts.length === 0) {
      console.error('No APK/AAB found. Build one first (npm run build:qa / build:release / bundle) or pass a path.');
      return 2;
    }
    for (const artifact of artifacts) {
      const { resolved, tried } = resolveArtifactPath(artifact);
      if (!resolved) {
        record({
          id: 'artifact-missing',
          label: 'artifact not found',
          severity: 'error',
          where: artifact,
          detail: `The path does not exist. Looked for it at:\n    ${tried.join('\n    ')}\n    (cwd is ${process.cwd()}; npm scripts run from the package directory, not the repository root.)`,
        });
        continue;
      }
      try {
        auditArtifact(resolved, { appEnv, config });
      } catch (error) {
        record({
          id: 'audit-failed',
          label: 'artifact could not be audited',
          severity: 'error',
          where: artifact,
          detail: error instanceof Error ? error.message : String(error),
        });
      }
    }
  }

  const errorCount = printReport({ format });

  if (reportJson) {
    fs.mkdirSync(path.dirname(path.resolve(reportJson)), { recursive: true });
    fs.writeFileSync(
      reportJson,
      JSON.stringify({ generatedAt: new Date().toISOString(), config: { apiUrl: config.apiUrl, supabaseUrl: config.supabaseUrl, supabaseAnonKey: mask(config.supabaseAnonKey) }, findings, notes, errorCount }, null, 2),
    );
    console.log(`Report written to ${reportJson}`);
  }

  return errorCount > 0 ? 1 : 0;
}

const invokedDirectly = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invokedDirectly) {
  process.exit(main(process.argv));
}

export { main, loadPublicConfig, findings, notes, resetFindings };
