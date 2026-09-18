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

const nextConfig: NextConfig = {
  output: 'export',
  outputFileTracingRoot: path.resolve(__dirname, '../../'),
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  webpack: (config) => {
    config.resolve.symlinks = false;
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@sharpmind/types$': path.resolve(__dirname, '../../packages/types/src/index.ts'),
      '@sharpmind/types': path.resolve(__dirname, '../../packages/types/src'),
      '@sharpmind/api-client$': path.resolve(__dirname, '../../packages/api-client/src/index.ts'),
      '@sharpmind/api-client': path.resolve(__dirname, '../../packages/api-client/src'),
    };
    return config;
  },
};

export default nextConfig;
