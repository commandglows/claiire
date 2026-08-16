const path = require('node:path');

const jestConfigDir = path.dirname(require.resolve('jest-config'));
const jestEnvironmentNode = require.resolve('jest-environment-node', {
  paths: [jestConfigDir],
});

/** @type {import('jest').Config} */
module.exports = {
  projects: [
    {
      displayName: 'unit',
      rootDir: __dirname,
      testEnvironment: jestEnvironmentNode,
      testMatch: ['**/engine/**/*.test.ts'],
      transform: {
        '^.+\\.tsx?$': [
          'ts-jest',
          {
            tsconfig: '<rootDir>/tsconfig.json',
          },
        ],
      },
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
        '^lucide-react-native$': '<rootDir>/__mocks__/lucide-react-native.ts',
      },
    },
    {
      displayName: 'react-native',
      rootDir: __dirname,
      preset: 'jest-expo',
      testMatch: ['**/*.test.tsx', '**/components/**/*.test.ts'],
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
        '^lucide-react-native$': '<rootDir>/__mocks__/lucide-react-native.ts',
      },
      transformIgnorePatterns: [
        '/node_modules/(?!(.pnpm|react-native|@react-native|@react-native-community|expo|@expo|react-navigation|@react-navigation|convex|zustand|lucide-react-native))',
      ],
    },
  ],
};
