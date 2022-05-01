import path from "path";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";

const babelOptions = JSON.parse(
  readFileSync(new URL("./.babelrc.json", import.meta.url))
);

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  verbose: true,
  setupFilesAfterEnv: [path.resolve(__dirname, "./jest.setup.js")],
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(js|jsx|ts|tsx)?$": ["babel-jest", babelOptions],
  },
  moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
  },
  coverageDirectory: "coverage",
  coverageReporters: ["json", "lcov", "text", "html"],
  collectCoverageFrom: [
    "**/*.{js,jsx,ts,tsx}",
    "!**/node_modules/**",
    "!**/dist/**",
    "!**/__tests__/**",
    "!**/*.test.{js,jsx,ts,tsx}",
  ],
  coveragePathIgnorePatterns: [
    // Ignore all of our dependencies
    "/node_modules/",
    // Ignore coverage files
    "\\.coverage\\/",
    // Ignore config files
    "\\.config\\.js$",
  ],
};
