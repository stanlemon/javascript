const path = require("path");

const babelOptions = require("./.babelrc.json");

// Disable using esmodules everywhere
babelOptions.presets.find(
  (preset) => preset[0] === "@babel/preset-env"
)[1].modules = "auto";

// These are packages we know ship with esmodules and need to be transformed
const esModules = [
  "uuid",
  "lowdb",
  "steno",
  "lodash-es",
  "@stanlemon/server",
  "@stanlemon/server-with-auth",
].join("|");

module.exports = {
  verbose: true,
  setupFilesAfterEnv: [path.resolve(__dirname, "./jest.setup.js")],
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(js|jsx|ts|tsx)?$": ["babel-jest", babelOptions],
  },
  // Ignore transforms for node_modules, except...
  transformIgnorePatterns: [`/node_modules/(?!${esModules})`],
  moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
  },
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
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
