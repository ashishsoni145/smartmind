const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

/**
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  watchFolders: [monorepoRoot],
  resolver: {
    nodeModulesPaths: [
      path.resolve(projectRoot, 'node_modules'),
      path.resolve(monorepoRoot, 'node_modules'),
    ],
    extraNodeModules: {
      '@sharpmind/api-client': path.resolve(monorepoRoot, 'packages/api-client/src'),
      '@sharpmind/types': path.resolve(monorepoRoot, 'packages/types/src'),
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(projectRoot), config);
