/**
 * Cross-platform Gradle runner for apps/mobile/android.
 *
 * Windows PowerShell/cmd cannot execute `./gradlew`, so npm scripts go through
 * this file: it writes the public client config, then runs `gradlew.bat` on
 * Windows or `./gradlew` elsewhere with the given tasks. The Gradle exit code is
 * propagated unchanged so CI and local shells see real failures.
 *
 * Usage: node scripts/gradle.mjs <gradle tasks and flags...>
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const mobileRoot = path.resolve(here, '..');
const androidDir = path.join(mobileRoot, 'android');
const isWindows = process.platform === 'win32';
const wrapper = isWindows ? path.join(androidDir, 'gradlew.bat') : path.join(androidDir, 'gradlew');

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('[mobile] Usage: node scripts/gradle.mjs <gradle tasks...>');
  process.exit(2);
}

if (!fs.existsSync(wrapper)) {
  console.error(`[mobile] Gradle wrapper not found at ${wrapper}`);
  process.exit(2);
}

const config = spawnSync(process.execPath, [path.join(here, 'write-public-config.mjs')], { stdio: 'inherit' });
if (config.status !== 0) {
  process.exit(config.status ?? 1);
}

if (!isWindows) {
  try {
    fs.accessSync(wrapper, fs.constants.X_OK);
  } catch {
    // Git checkouts on some file systems drop the executable bit.
    fs.chmodSync(wrapper, 0o755);
  }
}

const result = spawnSync(wrapper, args, {
  cwd: androidDir,
  stdio: 'inherit',
  // gradlew.bat is a batch file, so it needs the shell on Windows.
  shell: isWindows,
  env: process.env,
});

if (result.error) {
  console.error(`[mobile] Could not start Gradle: ${result.error.message}`);
  process.exit(1);
}
process.exit(result.status ?? 1);
