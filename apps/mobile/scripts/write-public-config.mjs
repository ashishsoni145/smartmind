/**
 * Writes the public client config consumed by the React Native bundle.
 *
 * WHAT THIS FILE DECIDES
 * ----------------------
 * Exactly three values are ever inlined into the JavaScript bundle: the backend API URL, the
 * Supabase project URL and the Supabase publishable/anon key. All three are public by design -
 * a server URL is not a secret, and the anon key is the key Supabase intends browsers and mobile
 * clients to hold (Row Level Security is the control, not the key).
 *
 * Everything privileged stays on the server. This script:
 *   1. reads committed public defaults from ../config/production.json,
 *   2. lets environment variables override them (how CI targets a different deployment),
 *   3. refuses to emit any value that looks like a privileged credential,
 *   4. refuses to emit a developer host (localhost / 10.0.2.2 / LAN IP) for a distributed build,
 *   5. FAILS the build when a distributed (qa/release) build is missing required public config.
 *
 * There is no silent fallback. A production build with no API URL does not quietly point at
 * localhost and does not quietly disable networking - it stops with an actionable message naming
 * the missing NON-SECRET variable. Secret values are never printed.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  classifyJwt,
  isForbiddenEnvName,
  isNonPublicHost,
  mask,
  validateApiUrl,
} from './lib/secret-policy.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const mobileRoot = path.resolve(here, '..');
const outFile = path.join(mobileRoot, 'src/config/public-env.generated.ts');
const defaultsFile = path.join(mobileRoot, 'config/production.json');

/**
 * Emulator loopback. Written ONLY for a debug build, and only when the developer asks for it
 * explicitly (SHARPMIND_USE_EMULATOR_API=1) or leaves the API URL empty. It is not hard-coded
 * anywhere in src/, so a distributed bundle cannot contain a developer-machine address at all.
 */
const EMULATOR_API_URL = 'http://10.0.2.2:4000/api/v1';
const wantEmulatorApi = ['1', 'true', 'yes'].includes(
  String(process.env.SHARPMIND_USE_EMULATOR_API || '')
    .trim()
    .toLowerCase(),
);

const APP_ENVS = ['debug', 'qa', 'release'];

/**
 * `--app-env` exists so npm scripts can select the rule set on Windows too, where
 * `SHARPMIND_APP_ENV=release node ...` does not work. Gradle passes it through the environment.
 */
const envFlagIndex = process.argv.indexOf('--app-env');
const requestedEnv = String(
  (envFlagIndex >= 0 ? process.argv[envFlagIndex + 1] : '') || process.env.SHARPMIND_APP_ENV || 'debug',
)
  .trim()
  .toLowerCase();
const appEnv = APP_ENVS.includes(requestedEnv) ? requestedEnv : 'debug';
if (requestedEnv !== appEnv) {
  console.warn(`[mobile] Unknown app environment "${requestedEnv}"; treating it as "debug".`);
}
/** Anything that is distributed to a device must carry production configuration. */
const distributed = appEnv !== 'debug';
/** Report problems and exit non-zero without touching the generated file. */
const reportOnly = process.argv.includes('--report');

function readDefaults() {
  try {
    const raw = JSON.parse(fs.readFileSync(defaultsFile, 'utf8'));
    return {
      apiUrl: String(raw.apiUrl || '').trim(),
      supabaseUrl: String(raw.supabaseUrl || '').trim(),
      supabaseAnonKey: String(raw.supabaseAnonKey || '').trim(),
    };
  } catch (error) {
    return {
      apiUrl: '',
      supabaseUrl: '',
      supabaseAnonKey: '',
      readError: error instanceof Error ? error.message : String(error),
    };
  }
}

function readEnv(...keys) {
  for (const key of keys) {
    const value = process.env[key];
    if (value && value.trim()) return value.trim();
  }
  return '';
}

const defaults = readDefaults();

/**
 * Resolution order: environment first (CI/deployment specific), committed public defaults second.
 * Both sources are public; neither may contain a privileged credential.
 */
const resolved = {
  apiUrl: readEnv('SHARPMIND_API_URL', 'NEXT_PUBLIC_API_URL') || defaults.apiUrl,
  supabaseUrl: readEnv('SHARPMIND_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_URL') || defaults.supabaseUrl,
  supabaseAnonKey:
    readEnv('SHARPMIND_SUPABASE_ANON_KEY', 'NEXT_PUBLIC_SUPABASE_ANON_KEY') || defaults.supabaseAnonKey,
};

const errors = [];
const warnings = [];
const issues = [];

// ---------------------------------------------------------------------------
// 1. Never embed a privileged credential, whatever the environment contains.
// ---------------------------------------------------------------------------
const forbiddenPresent = Object.keys(process.env).filter(isForbiddenEnvName);
for (const name of forbiddenPresent) {
  const value = String(process.env[name] || '');
  if (!value) continue;
  for (const [field, candidate] of Object.entries(resolved)) {
    if (candidate && candidate === value) {
      errors.push(
        `${field} was set to the value of the server-only variable ${name}. Private provider, service-role, database and signing credentials must stay on the backend. Unset it or point ${field} at the public value instead.`,
      );
    }
  }
}

// ---------------------------------------------------------------------------
// 2. Classify each value on its own shape, not on its name.
// ---------------------------------------------------------------------------
const anonKind = classifyJwt(resolved.supabaseAnonKey);
if (anonKind === 'service-role-jwt') {
  errors.push(
    'supabaseAnonKey is a Supabase SERVICE-ROLE key (its JWT role claim is "service_role"). It bypasses Row Level Security and must never leave the backend. Replace it with the publishable/anon key.',
  );
} else if (anonKind === 'unknown-jwt') {
  errors.push(
    'supabaseAnonKey is a JWT whose role claim is not "anon". Only the Supabase publishable/anon key may be shipped to a device. Value was rejected without being printed.',
  );
} else if (resolved.supabaseAnonKey && !anonKind && !/^sb_publishable_[A-Za-z0-9_-]{10,}$/.test(resolved.supabaseAnonKey)) {
  warnings.push(
    'supabaseAnonKey is not a recognisable Supabase anon/publishable key. It was embedded because it is not a JWT with a privileged role claim - confirm it is the public key.',
  );
}

for (const [field, value] of Object.entries(resolved)) {
  if (!value) continue;
  const kind = classifyJwt(value);
  if (kind === 'service-role-jwt') {
    errors.push(`${field} contains a service-role JWT. Refusing to embed it.`);
  }
  if (/^(sk-or-v1-|sk-ant-|sk-|AIza|gsk_|sb_secret_|ghp_|github_pat_|xox[baprs]-)/.test(value)) {
    errors.push(`${field} looks like a provider API key or token. Refusing to embed it in the client bundle.`);
  }
  if (/-----BEGIN [A-Z ]*PRIVATE KEY/.test(value)) {
    errors.push(`${field} contains a private key block. Refusing to embed it in the client bundle.`);
  }
}

// ---------------------------------------------------------------------------
// 3. API URL: explicit, HTTPS and never a developer host for a distributed build.
// ---------------------------------------------------------------------------
let apiUrl = resolved.apiUrl.replace(/\/+$/, '');
let apiUrlSource = 'configured';

if (!distributed && wantEmulatorApi) {
  // Explicit developer choice: run this debug build against a backend on the host machine.
  apiUrl = EMULATOR_API_URL;
  apiUrlSource = 'emulator-debug';
  warnings.push(
    `SHARPMIND_USE_EMULATOR_API is set; the debug build points at the emulator loopback ${EMULATOR_API_URL} and any configured API URL is ignored.`,
  );
}

if (!apiUrl) {
  if (distributed) {
    errors.push(
      `SHARPMIND_API_URL is required for a ${appEnv} build and no committed default exists in apps/mobile/config/production.json. ` +
        'Set SHARPMIND_API_URL (or NEXT_PUBLIC_API_URL) to the public HTTPS backend base, e.g. https://api.example.com/api/v1. ' +
        'This build refuses to fall back to localhost, 10.0.2.2 or a LAN address.',
    );
    apiUrlSource = 'missing';
  } else {
    apiUrl = EMULATOR_API_URL;
    apiUrlSource = 'emulator-debug';
    warnings.push(`SHARPMIND_API_URL is not set; debug build points at the emulator loopback ${EMULATOR_API_URL}.`);
  }
} else if (apiUrlSource !== 'emulator-debug') {
  const check = validateApiUrl(apiUrl, appEnv);
  // Every problem is reported at once, so one bad URL cannot hide a second one behind it.
  for (const reason of check.reasons) {
    if (check.ok) warnings.push(reason);
    else errors.push(reason);
  }
  if (!check.ok) apiUrlSource = 'invalid';
  else if (!distributed && isNonPublicHost(new URL(apiUrl).hostname)) apiUrlSource = 'emulator-debug';
  if (!apiUrl.includes('/api/v1')) {
    warnings.push(
      `SHARPMIND_API_URL does not end with the backend prefix /api/v1 (got "${apiUrl}"). The backend mounts every route under API_PREFIX=/api/v1; a base without it will 404.`,
    );
  }
}

// ---------------------------------------------------------------------------
// 4. Supabase public config.
// ---------------------------------------------------------------------------
if (resolved.supabaseUrl) {
  let parsed = null;
  try {
    parsed = new URL(resolved.supabaseUrl);
  } catch {
    errors.push('SHARPMIND_SUPABASE_URL is not an absolute URL.');
  }
  if (parsed) {
    if (parsed.protocol !== 'https:') {
      errors.push(`SHARPMIND_SUPABASE_URL must use https:// (got ${parsed.protocol}//).`);
    }
    if (isNonPublicHost(parsed.hostname)) {
      errors.push(`SHARPMIND_SUPABASE_URL points at a developer host (${parsed.hostname}).`);
    }
  }
} else if (distributed) {
  errors.push(
    `SHARPMIND_SUPABASE_URL is required for a ${appEnv} build. Sign-in uses Supabase auth directly, exactly like the web app. ` +
      'Set SHARPMIND_SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) to the public project URL, e.g. https://<project-ref>.supabase.co.',
  );
} else {
  warnings.push('SHARPMIND_SUPABASE_URL is not set; sign-in is disabled in this debug build.');
}

if (!resolved.supabaseAnonKey && distributed) {
  errors.push(
    `SHARPMIND_SUPABASE_ANON_KEY is required for a ${appEnv} build. This is the PUBLIC Supabase publishable/anon key (the same one the web app ships to browsers), not the service-role key. ` +
      'Set SHARPMIND_SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY), or commit it in apps/mobile/config/production.json. ' +
      'Without it the app cannot sign in, and this build refuses to ship a client that silently pretends to work.',
  );
}

// ---------------------------------------------------------------------------
// 5. Report. Values are masked; secrets are never printed.
// ---------------------------------------------------------------------------
const report = [
  `[mobile] public config for appEnv=${appEnv}${distributed ? ' (distributed build - production rules enforced)' : ' (developer build)'}`,
  `[mobile]   apiUrl          = ${apiUrlSource === 'configured' ? apiUrl : `${apiUrlSource}${apiUrl ? ` (${apiUrl})` : ''}`}`,
  `[mobile]   supabaseUrl     = ${resolved.supabaseUrl || '(missing)'}`,
  `[mobile]   supabaseAnonKey = ${mask(resolved.supabaseAnonKey)}${anonKind ? ` [${anonKind}]` : ''}`,
  `[mobile]   server-only variables present in this environment and NOT embedded: ${forbiddenPresent.length ? forbiddenPresent.join(', ') : '(none)'}`,
];
for (const line of report) console.log(line);
for (const warning of warnings) console.warn(`[mobile] WARNING: ${warning}`);

if (errors.length > 0) {
  console.error('');
  console.error(`[mobile] Refusing to write the ${appEnv} client config. ${errors.length} problem(s):`);
  errors.forEach((message, index) => console.error(`[mobile]   ${index + 1}. ${message}`));
  console.error('');
  console.error('[mobile] These are public, non-secret values. Private provider keys belong on the backend only');
  console.error('[mobile] (backend/.env.example documents the server-side set). See apps/mobile/README.md.');
  if (!reportOnly) process.exit(1);
}

if (reportOnly) {
  process.exit(errors.length > 0 ? 1 : 0);
}

const config = {
  supabaseUrl: resolved.supabaseUrl,
  supabaseAnonKey: resolved.supabaseAnonKey,
  apiUrl,
  apiUrlSource,
  appEnv,
  configIssues: [...errors, ...warnings].slice(0, 12),
};

const body = `/*
 * GENERATED FILE - do not edit and do not commit.
 *
 * Written by apps/mobile/scripts/write-public-config.mjs from apps/mobile/config/production.json
 * plus the SHARPMIND_* / NEXT_PUBLIC_* environment at build time.
 *
 * It contains ONLY public, non-secret client configuration: the backend HTTPS base URL, the
 * Supabase project URL and the Supabase publishable/anon key. Privileged values (service-role key,
 * AI provider keys, database credentials, signing material) are rejected by the generator and are
 * re-checked in the built artifact by apps/mobile/scripts/security-audit.mjs.
 */
export type GeneratedAppEnv = 'debug' | 'qa' | 'release';
export type GeneratedApiUrlSource = 'configured' | 'emulator-debug' | 'missing' | 'invalid';

export const generatedPublicEnv: {
  supabaseUrl: string;
  supabaseAnonKey: string;
  apiUrl: string;
  apiUrlSource: GeneratedApiUrlSource;
  appEnv: GeneratedAppEnv;
  configIssues: string[];
} = ${JSON.stringify(config, null, 2)};
`;

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, body);
console.log(`[mobile] Wrote ${path.relative(process.cwd(), outFile)}`);
