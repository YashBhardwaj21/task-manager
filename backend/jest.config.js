module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./src/tests/setup.js'],
  clearMocks: true,
  testMatch: ['**/*.test.js'],
  collectCoverageFrom: [
    'src/controllers/**/*.js',
    'src/services/**/*.js',
    'src/middleware/**/*.js',
    'src/routes/**/*.js'
  ],
  coverageDirectory: 'coverage'
};
