/** @type {import('ts-jest/dist/types').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "@imperial/commons": "<rootDir>/../../packages/commons",
    "@imperial/internal": "<rootDir>/../../packages/internal",
  },
};
