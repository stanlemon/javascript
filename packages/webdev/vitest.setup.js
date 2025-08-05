import { vi } from "vitest";

if (process.argv.includes("--silent")) {
  global.console = {
    ...console,
    // Comment to expose a specific log level
    log: vi.fn(),
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  };
}
