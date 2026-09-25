/**
 * React Native's Gradle plugin resolves native packages from apps/mobile/node_modules.
 * npm workspaces hoist them to the repository root, so create the links Gradle expects.
 */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const mobileRoot = path.resolve(here, '..');
const requireFromMobile = createRequire(path.join(mobileRoot, 'package.json'));
const nodeModules = path.join(mobileRoot, 'node_modules');

const packages = [
  'react-native',
  '@react-native/gradle-plugin',
  '@react-native/codegen',
  '@react-native/metro-config',
  '@react-native/babel-preset',
  '@react-native/js-polyfills',
];

fs.mkdirSync(nodeModules, { recursive: true });

for (const name of packages) {
  let resolved;
  try {
    resolved = requireFromMobile.resolve(`${name}/package.json`);
  } catch {
    continue;
  }
  const source = path.dirname(resolved);
  const destination = path.join(nodeModules, name);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  if (fs.existsSync(destination)) {
    continue;
  }
  const relative = path.relative(path.dirname(destination), source);
  fs.symlinkSync(relative, destination, 'dir');
}
