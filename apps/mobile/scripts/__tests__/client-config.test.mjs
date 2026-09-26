/**
 * Build-time security and configuration tests.
 *
 * Run with Node's own test runner (`node --test scripts/__tests__/`) rather than Jest: these tests
 * exercise the ESM build scripts and spawn real subprocesses, which is exactly what Gradle and CI do.
 *
 * What they prove:
 *   - a distributed build FAILS when public configuration is missing, and says which variable;
 *   - a distributed build FAILS rather than falling back to localhost / 10.0.2.2 / a LAN address;
 *   - a privileged credential in the environment is never embedded, and is never printed;
 *   - a debug build keeps working, so the Metro development workflow is untouched;
 *   - the artifact auditor's detectors actually detect.
 */
import test, { after, describe } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  classifyJwt,
  isForbiddenEnvName,
  isNonPublicHost,
  mask,
  validateApiUrl,
} from '../lib/secret-policy.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const mobileRoot = path.resolve(here, '../..');
const repoRoot = path.resolve(mobileRoot, '../..');
const writeConfig = path.join(mobileRoot, 'scripts/write-public-config.mjs');
const audit = path.join(mobileRoot, 'scripts/security-audit.mjs');
const generatedFile = path.join(mobileRoot, 'src/config/public-env.generated.ts');

const ANON_JWT = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${Buffer.from(
  JSON.stringify({ role: 'anon', iss: 'https://vscprtuinxopistikpcs.supabase.co/auth/v1', ref: 'vscprtuinxopistikpcs' }),
).toString('base64url')}.dGVzdHNpZ25hdHVyZQ`;

const SERVICE_ROLE_JWT = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${Buffer.from(
  JSON.stringify({ role: 'service_role', iss: 'https://vscprtuinxopistikpcs.supabase.co/auth/v1', ref: 'vscprtuinxopistikpcs' }),
).toString('base64url')}.dGVzdHNpZ25hdHVyZQ`;

const PRODUCTION_API_URL = 'https://sharpmindbackend-zeta.vercel.app/api/v1';

// A clean environment: no inherited SHARPMIND_ or NEXT_PUBLIC_ values, no accidental secrets.
function baseEnv() {
  const env = {};
  for (const [key, value] of Object.entries(process.env)) {
    if (/^(SHARPMIND_|NEXT_PUBLIC_)/.test(key)) continue;
    env[key] = value;
  }
  return env;
}

function runConfig(args, env = {}) {
  // spawnSync, not execFileSync: the generator writes warnings to stderr even when it succeeds, and
  // those warnings are part of what these tests assert on.
  const result = spawnSync(process.execPath, [writeConfig, ...args], {
    cwd: mobileRoot,
    env: { ...baseEnv(), ...env },
    encoding: 'utf8',
  });
  return { status: result.status ?? 1, stdout: String(result.stdout || ''), stderr: String(result.stderr || '') };
}

function readGenerated() {
  const text = fs.readFileSync(generatedFile, 'utf8');
  const match = text.match(/=\s*(\{[\s\S]*\});?\s*$/);
  assert.ok(match, 'generated config does not contain an object literal');
  return JSON.parse(match[1]);
}

after(() => {
  // Leave the working tree in the state a developer expects: a debug config.
  runConfig(['--app-env', 'debug']);
});

describe('secret-policy: forbidden environment names', () => {
  test('rejects every server-only variable family from the brief', () => {
    for (const name of [
      'OPENROUTER_API_KEY',
      'AI_OPENROUTER_API_KEY',
      'GEMINI_API_KEY',
      'AI_GEMINI_API_KEY',
      'GROQ_API_KEY',
      'AI_GROQ_API_KEY',
      'OPENAI_API_KEY',
      'ANTHROPIC_API_KEY',
      'SUPABASE_SERVICE_ROLE_KEY',
      'DATABASE_URL',
      'POSTGRES_PASSWORD',
      'DB_PASSWORD',
      'SHARPMIND_KEYSTORE_BASE64',
      'SHARPMIND_KEYSTORE_PASSWORD',
      'SHARPMIND_KEY_PASSWORD',
      'RAZORPAY_KEY_SECRET',
      'TWILIO_AUTH_TOKEN',
      'MSG91_AUTH_KEY',
      'RENDER_API_KEY',
      'GITHUB_TOKEN',
      'GH_TOKEN',
      'JWT_SECRET',
      'CRON_SECRET',
      'SIGNING_KEY',
      'PRIVATE_KEY',
    ]) {
      assert.equal(isForbiddenEnvName(name), true, `${name} should be forbidden in the client`);
    }
  });

  test('accepts the public client variables', () => {
    for (const name of [
      'SHARPMIND_API_URL',
      'NEXT_PUBLIC_API_URL',
      'SHARPMIND_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_URL',
      'SHARPMIND_SUPABASE_ANON_KEY',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'SHARPMIND_APP_ENV',
      'SHARPMIND_VERSION_CODE',
      'PATH',
      'HOME',
    ]) {
      assert.equal(isForbiddenEnvName(name), false, `${name} should be allowed`);
    }
  });
});

describe('secret-policy: developer host detection', () => {
  test('flags loopback, emulator, LAN and local hosts', () => {
    for (const host of ['localhost', '127.0.0.1', '10.0.2.2', '10.10.1.5', '192.168.1.20', '172.16.4.9', '172.31.255.254', '0.0.0.0', '::1', 'dev-machine.local', 'backend.internal']) {
      assert.equal(isNonPublicHost(host), true, `${host} should be treated as a developer host`);
    }
  });

  test('does not flag public hosts', () => {
    for (const host of ['sharpmindbackend-zeta.vercel.app', 'api.sharpmind.ai', 'vscprtuinxopistikpcs.supabase.co', '8.8.8.8', '172.32.0.1', '100.64.0.0']) {
      // 100.64.0.0 is CGNAT and IS non-public; the rest are public.
      if (host === '100.64.0.0') continue;
      assert.equal(isNonPublicHost(host), false, `${host} should be treated as public`);
    }
    assert.equal(isNonPublicHost('100.64.0.0'), true);
  });
});

describe('secret-policy: Supabase key classification', () => {
  test('distinguishes anon from service_role', () => {
    assert.equal(classifyJwt(ANON_JWT), 'public-anon-jwt');
    assert.equal(classifyJwt(SERVICE_ROLE_JWT), 'service-role-jwt');
    assert.equal(classifyJwt('not-a-jwt'), null);
    assert.equal(classifyJwt(PRODUCTION_API_URL), null);
  });
});

describe('secret-policy: masking never reveals a secret', () => {
  test('mask() hides the body of a value', () => {
    const masked = mask(SERVICE_ROLE_JWT);
    assert.equal(masked.includes(SERVICE_ROLE_JWT), false);
    assert.match(masked, /chars\)$/);
    assert.equal(mask(''), '(empty)');
  });
});

describe('secret-policy: API URL validation', () => {
  test('accepts the production HTTPS URL for release and qa', () => {
    for (const appEnv of ['release', 'qa']) {
      const result = validateApiUrl(PRODUCTION_API_URL, appEnv);
      assert.equal(result.ok, true, JSON.stringify(result.reasons));
    }
  });

  test('rejects developer hosts and cleartext for a distributed build, reporting every problem', () => {
    const result = validateApiUrl('http://10.0.2.2:4000/api/v1', 'release');
    assert.equal(result.ok, false);
    assert.equal(result.reasons.length, 2, 'both the protocol and the developer host should be reported');
    assert.match(result.reasons.join(' '), /https/);
    assert.match(result.reasons.join(' '), /developer host/);
  });

  test('allows the emulator loopback for a debug build', () => {
    const result = validateApiUrl('http://10.0.2.2:4000/api/v1', 'debug');
    assert.equal(result.ok, true);
  });

  test('rejects an empty or malformed URL', () => {
    assert.equal(validateApiUrl('', 'release').ok, false);
    const malformed = validateApiUrl('http://[bad', 'release');
    assert.equal(malformed.ok, false);
    // The value itself is not echoed, because a malformed field may contain something sensitive.
    assert.equal(malformed.reason.includes('http://[bad'), false);
  });
});

describe('write-public-config: distributed builds fail loudly', () => {
  test('release build succeeds with the full public configuration', () => {
    const result = runConfig(['--app-env', 'release'], { SHARPMIND_SUPABASE_ANON_KEY: ANON_JWT });
    assert.equal(result.status, 0, result.stderr);
    const generated = readGenerated();
    assert.equal(generated.appEnv, 'release');
    assert.equal(generated.apiUrl, PRODUCTION_API_URL);
    assert.equal(generated.apiUrlSource, 'configured');
    assert.equal(generated.supabaseAnonKey, ANON_JWT);
    assert.match(fs.readFileSync(generatedFile, 'utf8'), /GENERATED FILE/);
  });

  test('release build fails when the public anon key is missing, naming the variable', () => {
    const result = runConfig(['--app-env', 'release', '--report'], { SHARPMIND_SUPABASE_ANON_KEY: '' });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /SHARPMIND_SUPABASE_ANON_KEY/);
    assert.match(result.stderr, /NEXT_PUBLIC_SUPABASE_ANON_KEY/);
  });

  test('release build fails rather than falling back to localhost or the emulator', () => {
    const result = runConfig(['--app-env', 'release', '--report'], {
      SHARPMIND_API_URL: 'http://localhost:4000/api/v1',
      SHARPMIND_SUPABASE_ANON_KEY: ANON_JWT,
    });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /https/);
    assert.equal(result.stdout.includes('10.0.2.2'), false, 'must not silently retarget the emulator');
  });

  test('qa build enforces the same production rules as release', () => {
    const result = runConfig(['--app-env', 'qa', '--report'], {
      SHARPMIND_API_URL: 'http://localhost:4000/api/v1',
      SHARPMIND_SUPABASE_ANON_KEY: ANON_JWT,
    });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /SHARPMIND_API_URL/);
    assert.match(result.stderr, /https/);
  });

  test('an empty environment override does not erase the committed public default', () => {
    const result = runConfig(['--app-env', 'release'], {
      SHARPMIND_API_URL: '',
      SHARPMIND_SUPABASE_ANON_KEY: ANON_JWT,
    });
    assert.equal(result.status, 0, result.stderr);
    assert.equal(readGenerated().apiUrl, PRODUCTION_API_URL);
  });

  test('warns when the API base is missing the /api/v1 prefix the backend mounts', () => {
    const result = runConfig(['--app-env', 'release'], {
      SHARPMIND_API_URL: 'https://sharpmindbackend-zeta.vercel.app',
      SHARPMIND_SUPABASE_ANON_KEY: ANON_JWT,
    });
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stderr + result.stdout, /api\/v1/);
  });
});

describe('write-public-config: privileged values never cross into the client', () => {
  test('refuses a service-role key presented as the anon key, without printing it', () => {
    const result = runConfig(['--app-env', 'release', '--report'], { SHARPMIND_SUPABASE_ANON_KEY: SERVICE_ROLE_JWT });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /SERVICE-ROLE/i);
    assert.equal(result.stderr.includes(SERVICE_ROLE_JWT), false, 'the rejected secret must not be echoed');
    assert.equal(result.stdout.includes(SERVICE_ROLE_JWT), false);
  });

  test('refuses an OpenRouter key presented as the anon key', () => {
    const openrouter = 'sk-or-v1-abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789';
    const result = runConfig(['--app-env', 'release', '--report'], { SHARPMIND_SUPABASE_ANON_KEY: openrouter });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /provider API key/i);
    assert.equal(result.stderr.includes(openrouter), false);
  });

  test('refuses to copy a server-only variable into a client field', () => {
    const result = runConfig(['--app-env', 'release', '--report'], {
      AI_OPENROUTER_API_KEY: PRODUCTION_API_URL,
      SHARPMIND_API_URL: PRODUCTION_API_URL,
      SHARPMIND_SUPABASE_ANON_KEY: ANON_JWT,
    });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /server-only variable AI_OPENROUTER_API_KEY/);
  });

  test('reports server-only variables that exist in the environment but are not embedded', () => {
    const result = runConfig(['--app-env', 'debug'], {
      SUPABASE_SERVICE_ROLE_KEY: SERVICE_ROLE_JWT,
      AI_GEMINI_API_KEY: 'AIzaSyA1234567890abcdefghijklmnopqrstuv',
    });
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /NOT embedded/);
    assert.match(result.stdout, /SUPABASE_SERVICE_ROLE_KEY/);
    assert.equal(result.stdout.includes(SERVICE_ROLE_JWT), false);
    assert.equal(result.stdout.includes('AIzaSyA1234567890abcdefghijklmnopqrstuv'), false);
    const generated = readGenerated();
    assert.equal(generated.supabaseAnonKey, '');
    assert.equal(generated.apiUrl.includes('AIza'), false);
  });
});

describe('write-public-config: the developer workflow is untouched', () => {
  test('a debug build succeeds with no configuration at all', () => {
    const result = runConfig(['--app-env', 'debug']);
    assert.equal(result.status, 0, result.stderr);
    const generated = readGenerated();
    assert.equal(generated.appEnv, 'debug');
  });

  test('the committed defaults are used when the environment is silent', () => {
    const result = runConfig(['--app-env', 'debug']);
    assert.equal(result.status, 0, result.stderr);
    const generated = readGenerated();
    assert.equal(generated.apiUrl, PRODUCTION_API_URL.replace(/\/+$/, ''));
    assert.equal(generated.apiUrlSource, 'configured');
    assert.equal(generated.supabaseUrl, 'https://vscprtuinxopistikpcs.supabase.co');
  });

  test('a debug build reaches a local backend when the developer asks for it explicitly', () => {
    const result = runConfig(['--app-env', 'debug'], { SHARPMIND_USE_EMULATOR_API: '1' });
    assert.equal(result.status, 0, result.stderr);
    const generated = readGenerated();
    assert.equal(generated.apiUrl, 'http://10.0.2.2:4000/api/v1');
    assert.equal(generated.apiUrlSource, 'emulator-debug');
  });

  test('the emulator opt-in is ignored by a distributed build', () => {
    const result = runConfig(['--app-env', 'release', '--report'], {
      SHARPMIND_USE_EMULATOR_API: '1',
      SHARPMIND_SUPABASE_ANON_KEY: ANON_JWT,
    });
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.stdout.includes('10.0.2.2'), false);
  });
});

describe('security-audit', () => {
  test('selftest passes - the detectors really detect', () => {
    const stdout = execFileSync(process.execPath, [audit, 'selftest'], { cwd: mobileRoot, encoding: 'utf8' });
    assert.match(stdout, /\[selftest\] OK/);
  });

  test('the repository sources that reach the bundle contain no privileged credential', () => {
    const stdout = execFileSync(process.execPath, [audit, 'source'], { cwd: mobileRoot, encoding: 'utf8' });
    assert.match(stdout, /PASS: no private provider key/);
  });

  test('the generated client config is git-ignored', () => {
    const result = (() => {
      try {
        execFileSync('git', ['-C', repoRoot, 'check-ignore', '-q', generatedFile], { stdio: 'ignore' });
        return true;
      } catch {
        return false;
      }
    })();
    assert.equal(result, true, 'src/config/public-env.generated.ts must stay out of git');
  });

  test('no keystore other than the public React Native debug keystore is committed', () => {
    const stdout = execFileSync(process.execPath, [audit, 'source'], { cwd: mobileRoot, encoding: 'utf8' });
    assert.equal(stdout.includes('committed-keystore'), false);
    assert.match(stdout, /standard React Native debug keystore/);
  });

  // Regression: CI runs `npm --prefix apps/mobile run audit:artifact -- <path>` where <path> is
  // relative to the repository root, but npm executes the script with cwd = apps/mobile. The
  // auditor reported "artifact not found" for a file that was sitting right there, which is worse
  // than crashing: the job looks like it audited something and audited nothing.
  test('a repository-root-relative artifact path still resolves when cwd is apps/mobile', () => {
    const marker = path.join(mobileRoot, 'tmp-audit-path-resolution.bin');
    fs.writeFileSync(marker, 'deliberately not a zip archive');
    try {
      const relativeToRepoRoot = path.relative(repoRoot, marker).split(path.sep).join('/');
      const result = spawnSync(process.execPath, [audit, 'artifact', '--app-env', 'debug', relativeToRepoRoot], {
        cwd: mobileRoot, // what npm --prefix does
        encoding: 'utf8',
      });
      const output = `${result.stdout}\n${result.stderr}`;
      assert.equal(output.includes('artifact not found'), false,
        `the auditor must find ${relativeToRepoRoot} from cwd=apps/mobile, got:\n${output}`);
      // It reached the file and failed on its *contents*, which proves the path resolved.
      assert.match(output, /could not be audited/);
    } finally {
      fs.rmSync(marker, { force: true });
    }
  });

  test('a genuinely missing artifact says where it looked, including the repository root', () => {
    const result = spawnSync(process.execPath, [audit, 'artifact', '--app-env', 'debug', 'no/such/app.apk'], {
      cwd: mobileRoot,
      encoding: 'utf8',
    });
    const output = `${result.stdout}\n${result.stderr}`;
    assert.match(output, /artifact not found/);
    assert.ok(output.includes(path.join(repoRoot, 'no/such/app.apk')),
      `the error must list the repository-root resolution so the mistake is self-diagnosing, got:\n${output}`);
    assert.notEqual(result.status, 0);
  });
});
