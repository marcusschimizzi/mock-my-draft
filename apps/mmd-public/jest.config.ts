/* eslint-disable */
export default {
  displayName: 'mmd-public',
  preset: '../../jest.preset.js',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['next/babel'] }],
  },
  moduleNameMapper: {
    '^next/image$': '<rootDir>/__mocks__/nextImageMock.js',
    '\\.(svg|png|jpg|jpeg|gif|webp)$': '<rootDir>/__mocks__/fileMock.js',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/apps/mmd-public',
  setupFilesAfterEnv: ['<rootDir>/test/setup-tests.ts'],
};
