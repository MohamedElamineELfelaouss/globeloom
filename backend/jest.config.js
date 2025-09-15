module.exports = {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.js", "**/src/**/*.test.js"],
  collectCoverageFrom: ["src/**/*.js", "!src/scripts/**", "!src/config/**"],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
};
