#!/usr/bin/env node
const path = require('path');
const Module = require('module');

// eslint-config-next is shared at the workspace root by npm, while Next.js is
// resolved from this app. Add the app's dependencies to Node's global lookup path
// so the shared config can load the matching Next.js parser.
const localNodeModules = path.join(__dirname, 'node_modules');
const nodePaths = (process.env.NODE_PATH || '').split(path.delimiter).filter(Boolean);
if (!nodePaths.includes(localNodeModules)) nodePaths.unshift(localNodeModules);
process.env.NODE_PATH = nodePaths.join(path.delimiter);
Module._initPaths();

const eslintPackage = require.resolve('eslint/package.json', { paths: [__dirname] });
const eslintBin = path.join(path.dirname(eslintPackage), 'bin', 'eslint.js');
process.argv = [process.execPath, eslintBin, '.', '--ext', '.js,.jsx,.ts,.tsx'];
require(eslintBin);
