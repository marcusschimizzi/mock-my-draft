/* eslint-disable */
export default {
  displayName: 'visualizations',
  preset: '../../jest.preset.js',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['next/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/visualizations',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};
