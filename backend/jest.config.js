module.exports = {
  setupFilesAfterEnv: ['./tests/setup.js'],
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'], // Only look for tests in the /tests folder
  coveragePathIgnorePatterns: ['/node_modules/', '/tests/', '/src/config/'], //for coverage
  verbose: true,
  maxWorkers: 1, // serial tests
};
