#!/usr/bin/env node
const path = require('path');

// On Windows (e.g. FAT32/exFAT filesystems), patch fs.readlink to avoid EISDIR errors
if (process.platform === 'win32') {
  try {
    require('./patch-fs.js');
    const patchPath = path.resolve(__dirname, 'patch-fs.js').replace(/\\/g, '/');
    if (!process.env.NODE_OPTIONS || !process.env.NODE_OPTIONS.includes('patch-fs')) {
      process.env.NODE_OPTIONS = `${process.env.NODE_OPTIONS || ''} --require "${patchPath}"`.trim();
    }
  } catch (e) {
    // Ignore if patch-fs is not available
  }
}

// Dynamically resolve Next.js CLI using Node's standard module resolution.
// This resolves correctly in local node_modules, parent workspaces, or hoisted monorepos (Vercel).
try {
  const nextBin = require.resolve('next/dist/bin/next');
  require(nextBin);
} catch (err) {
  console.error('[SharpMind] Failed to resolve next binary via require.resolve:', err.message);
  process.exit(1);
}
