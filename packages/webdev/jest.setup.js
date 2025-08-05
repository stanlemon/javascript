import "@testing-library/jest-dom";

if (process.argv.includes("--silent")) {
  global.console = {
    ...console,
    // Comment to expose a specific log level
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };
}
