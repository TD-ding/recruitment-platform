module.exports = {
  presets: [['ts-jest', { tsconfig: 'tsconfig.json' }]],
  testEnvironment: 'node',
  testMatch: ['**/test/**/*.test.ts'],
};
