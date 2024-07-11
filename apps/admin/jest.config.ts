import type { Config } from 'jest';
import nextJest from 'next/jest';

const createJestConfig = nextJest({
  dir: '.',
});

const config: Config = {
  displayName: 'admin',
  preset: '../../jest.preset.js',
  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,

  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/next/babel'] }],
  },

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: 'v8',

  testEnvironment: 'jsdom',

  moduleNameMapper: {
    '@/(.*)$': ['<rootDir>/src/$1'],
  },

  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  rootDir: '.',
};

export default createJestConfig(config);
