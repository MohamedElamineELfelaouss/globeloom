// Test setup file
require("dotenv").config({ path: ".env.test" });

// Mock console.log in tests to reduce noise
if (process.env.NODE_ENV === "test") {
  global.console = {
    ...console,
    log: jest.fn(),
    error: console.error,
    warn: console.warn,
    info: jest.fn(),
    debug: jest.fn(),
  };
}
