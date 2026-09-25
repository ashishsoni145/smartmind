module.exports = {
  preset: '@react-native/jest-preset',
  testMatch: ['**/__tests__/**/*.test.ts', '**/__tests__/**/*.test.tsx'],
  moduleNameMapper: {
    '^@sharpmind/api-client$': '<rootDir>/../../packages/api-client/src/index.ts',
    '^@sharpmind/types$': '<rootDir>/../../packages/types/src/index.ts',
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-navigation|@tanstack)/)',
  ],
};
