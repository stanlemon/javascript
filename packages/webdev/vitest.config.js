import path from "path";

import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: [path.resolve(import.meta.dirname, "./vitest.setup.js")],
    css: {
      modules: {
        classNameStrategy: "non-scoped",
      },
    },
    coverage: {
      provider: "v8",
      reporter: ["json", "lcov", "text", "html"],
      reportsDirectory: "coverage",
      include: ["**/*.{js,jsx,ts,tsx}"],
      exclude: [
        "**/node_modules/**",
        "**/dist/**",
        "**/__tests__/**",
        "**/*.test.{js,jsx,ts,tsx}",
        "**/*.config.{js,ts}",
        "**/coverage/**",
      ],
    },
  },
  resolve: {
    alias: {
      "\\.(css|less|sass|scss)$": "identity-obj-proxy",
    },
  },
});
