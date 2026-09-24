#!/usr/bin/env node
/**
 * Builds the static export of apps/web that the Android shell bundles.
 *
 * Required env (inlined into the bundle at build time):
 *   NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
 * Strongly recommended:
 *   NEXT_PUBLIC_API_URL  The Android WebView serves the bundle from https://localhost, so the web
 *                        client's same-origin "/api/v1" fallback does not apply on a device.
 *
 * SHARPMIND_ALLOW_PLACEHOLDER_CONFIG=1 lets CI produce a smoke-test build (packaging only) when
 * secrets are unavailable, e.g. on forked pull requests. Such an APK cannot sign in.
 */
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const webDir = path.resolve(here, '../../web');
const outIndex = path.join(webDir, 'out', 'index.html');
const env = { ...process.env };

const required = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'];
const missingRequired = required.filter((name) => !env[name]);

if (missingRequired.length > 0) {
  if (env.SHARPMIND_ALLOW_PLACEHOLDER_CONFIG === '1') {
    console.warn(
      `[mobile] ${missingRequired.join(', ')} missing: using placeholders for a smoke-test build.\n` +
        '[mobile] The resulting APK packages correctly but cannot reach Supabase.'
    );
    env.NEXT_PUBLIC_SUPABASE_URL ||= 'https://placeholder.invalid';
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||= 'placeholder-anon-key';
  } else {
    console.error(
      `[mobile] Missing required env: ${missingRequired.join(', ')}.\n` +
        '[mobile] apps/web refuses to build for production without Supabase credentials.\n' +
        '[mobile] Export them (see .env.example) and re-run.'
    );
    process.exit(1);
  }
}

if (!env.NEXT_PUBLIC_API_URL) {
  console.warn(
    '[mobile] Warning: NEXT_PUBLIC_API_URL is not set. Backend API calls from the app will target\n' +
      '[mobile] http://localhost:4000/api/v1, which is unreachable from a phone.'
  );
}

const result = spawnSync('npm', ['run', 'build'], { cwd: webDir, stdio: 'inherit', env });
if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

if (!existsSync(outIndex)) {
  console.error(`[mobile] Expected static export at ${outIndex}, but it was not found.`);
  process.exit(1);
}

console.log(`[mobile] Web bundle ready at ${path.dirname(outIndex)}`);
