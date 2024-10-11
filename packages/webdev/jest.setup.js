import "@testing-library/jest-dom";

if (!global.setImmediate) {
  // This is as gross as it looks. It's a workaround for using PouchDB in tests.
  global.setImmediate = global.setTimeout; // ts: as unknown as typeof setImmediate;
}

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
