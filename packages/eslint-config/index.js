const fs = require("fs");

const dir = process.cwd();

const tsconfig = dir + "/tsconfig.json";
const tsconfigEslint = dir + "/tsconfig.eslint.json";

// If there is a tsconfig.eslint file, use that instead of the main one
// See: https://github.com/typescript-eslint/typescript-eslint/blob/main/docs/linting/TYPED_LINTING.md
const tsProject = fs.existsSync(tsconfigEslint) ? tsconfigEslint : tsconfig;

module.exports = {
  env: {
    es2021: true,
    browser: true,
    node: true,
    jest: true,
  },
  extends: [
    "react-app",
    "plugin:jest/recommended",
    "plugin:jest-dom/recommended",
    "plugin:prettier/recommended",
  ],
  rules: {
    // Requires strict equality
    eqeqeq: "error",
    // If functions are too long, break them up into smaller ones
    "max-lines-per-function": [
      "error",
      {
        max: 80,
        skipBlankLines: true,
        skipComments: true,
      },
    ],
    // Linting shouldn't break on this, but we also want to discourage using console logging
    "no-console": "warn",
    // Requires the displayName property to be set, not ideal for stateless components
    "react/display-name": "off",
    // Allow exporting of unamed objects as a default
    "import/no-anonymous-default-export": [
      "error",
      {
        allowObject: true,
      },
    ],
  },
  overrides: [
    {
      files: ["**/*.{ts,tsx}"],
      plugins: ["@typescript-eslint"],
      extends: [
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
      ],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        // Lint with Type Information
        // https://github.com/typescript-eslint/typescript-eslint/blob/main/docs/linting/TYPED_LINTING.md
        tsconfigRootDir: dir,
        project: tsProject,
      },
      settings: {
        "import/parsers": {
          "@typescript-eslint/parser": [".ts", ".tsx"],
        },
      },
      rules: {
        // Empty functions are ok, especially for default values
        "no-empty-function": "off",
        "@typescript-eslint/no-empty-function": "off",
        // Requires 'public' before public methods
        "@typescript-eslint/explicit-member-accessibility": "off",
      },
    },
    {
      files: ["**/*.jsx", "**/.tsx"],
      rules: {
        "max-lines-per-function": [
          "error",
          {
            max: 160,
            skipBlankLines: true,
            skipComments: true,
          },
        ],
      },
    },
    {
      files: ["**/*.test.*"],
      rules: {
        "max-lines-per-function": "off",
      },
    },
  ],
};
