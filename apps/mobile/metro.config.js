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
    /**
     * A fallback only, and not what makes the workspace packages resolve.
     *
     * npm workspaces symlinks node_modules/@sharpmind/* to packages/*, so Metro *finds* those
     * packages through normal resolution and never consults extraNodeModules. It then reads their
     * package.json, whose `main` is `dist/index.js` - a build output nothing in the mobile pipeline
     * produces - and fails with "specifies a `main` module field that could not be resolved".
     *
     * What actually fixes it is the `react-native` field in each package's package.json, pointing at
     * `src/index.ts`. @react-native/metro-config sets resolverMainFields to
     * ["react-native", "browser", "main"], so Metro prefers source, while Node, webpack and tsc
     * ignore that field entirely and keep using their own path mappings.
     *
     * This only ever mattered for a bundled build: `debug` is a debuggable variant and loads JS from
     * Metro's dev server, which resolves through the same config, but no distributed artifact had
     * been built until the qaStandalone variant was added.
     */
    extraNodeModules: {
      '@sharpmind/api-client': path.resolve(monorepoRoot, 'packages/api-client/src'),
      '@sharpmind/types': path.resolve(monorepoRoot, 'packages/types/src'),
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(projectRoot), config);
