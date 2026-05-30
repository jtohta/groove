/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['./tests/helpers/nock-setup.ts'],
  testPathIgnorePatterns: ['<rootDir>/dist/'],
}
