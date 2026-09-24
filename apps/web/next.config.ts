import './patch-fs.js';
import path from 'path';
import type { NextConfig } from 'next';

// On Windows FAT32, child worker processes must also preload patch-fs.js
if (process.platform === 'win32') {
  const patchFile = path.resolve(__dirname, 'patch-fs.js').replace(/\\/g, '/');
  if (!process.env.NODE_OPTIONS || !process.env.NODE_OPTIONS.includes('patch-fs')) {
    process.env.NODE_OPTIONS = `${process.env.NODE_OPTIONS || ''} --require "${patchFile}"`.trim();
  }
}

import fs from 'fs';

const monorepoRoot = path.resolve(__dirname, '../../');
const isMonorepo = fs.existsSync(path.resolve(monorepoRoot, 'package.json'));

const typesIndexPath = fs.existsSync(path.resolve(__dirname, '../../packages/types/src/index.ts'))
  ? path.resolve(__dirname, '../../packages/types/src/index.ts')
  : path.resolve(__dirname, 'src/packages/types/index.ts');

const typesDir = fs.existsSync(path.resolve(__dirname, '../../packages/types/src'))
  ? path.resolve(__dirname, '../../packages/types/src')
  : path.resolve(__dirname, 'src/packages/types');

const apiClientIndexPath = fs.existsSync(path.resolve(__dirname, '../../packages/api-client/src/index.ts'))
  ? path.resolve(__dirname, '../../packages/api-client/src/index.ts')
  : path.resolve(__dirname, 'src/packages/api-client/index.ts');

const apiClientDir = fs.existsSync(path.resolve(__dirname, '../../packages/api-client/src'))
  ? path.resolve(__dirname, '../../packages/api-client/src')
  : path.resolve(__dirname, 'src/packages/api-client');

const nextConfig: NextConfig = {
  output: 'export',
  outputFileTracingRoot: isMonorepo ? monorepoRoot : __dirname,
  devIndicators: false,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  webpack: (config) => {
    config.resolve.symlinks = false;
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@sharpmind/types$': typesIndexPath,
      '@sharpmind/types': typesDir,
      '@sharpmind/api-client$': apiClientIndexPath,
      '@sharpmind/api-client': apiClientDir,
    };
    return config;
  },
};

export default nextConfig;
