const fs = require("fs");

// A package can define a custom tsconfig just for eslint, and if they do we should use it
const tsconfigPath = fs.existsSync("./tsconfig.eslint.json")
  ? "./tsconfig.eslint.json"
  : "./tsconfig.json";
// Does the desired tsconfig exist?
const tsconfigExists = fs.existsSync(tsconfigPath);

module.exports = {
  env: {
    es2022: true,
    browser: true,
    node: true,
  },
  ...(tsconfigExists && { parser: "@typescript-eslint/parser" }),
  parserOptions: {
    sourceType: "module",
    ...(tsconfigExists && { project: tsconfigPath }),
  },
  extends: [
    "eslint:recommended",
    "plugin:prettier/recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:import/recommended",
  ],
  settings: {
    react: {
      version: "detect",
    },
    "import/resolver": {
      typescript: true,
      node: true,
    },
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
  },
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
    "no-console": ["warn", { allow: ["warn", "error"] }],
    // Requires the displayName property to be set, not ideal for stateless components
    "no-unused-vars": [
      "warn",
      {
        caughtErrors: "none",
        destructuredArrayIgnorePattern: "^_",
        ignoreRestSiblings: true,
        args: "none",
      },
    ],
    "no-empty-function": "off",
    "react/display-name": "off",
    "react/react-in-jsx-scope": "off",
    "react/jsx-uses-react": "off",
    "react/prop-types": "off",
    "react/no-unescaped-entities": ["error", { forbid: [">", "}"] }],
    "prettier/prettier": [
      "error",
      {
        trailingComma: "es5",
      },
    ],
  },
  overrides: [
    {
      extends: [
        "plugin:import/typescript",
        "plugin:@typescript-eslint/recommended",
        //'plugin:@typescript-eslint/recommended-type-checked',
        //'plugin:@typescript-eslint/stylistic-type-checked',
      ],
      files: ["**/*.ts", "**/*.tsx"],
      rules: {
        "@typescript-eslint/no-unused-vars": [
          "warn",
          {
            caughtErrors: "none",
            destructuredArrayIgnorePattern: "^_",
            ignoreRestSiblings: true,
            args: "none",
          },
        ],
        "@typescript-eslint/no-empty-function": "off",
        // Do not require 'public' before public methods
        "@typescript-eslint/explicit-member-accessibility": "off",
      },
    },
    {
      files: ["**/*.jsx", "**/*.tsx"],
      rules: {
        "max-lines-per-function": [
          "error",
          {
            max: 160, // Twice as long as normal
            skipBlankLines: true,
            skipComments: true,
          },
        ],
      },
    },
    {
      extends: ["plugin:jest/recommended", "plugin:jest-dom/recommended"],
      env: {
        jest: true,
      },
      files: ["**/*.test.js", "**/*.test.ts", "**/*.test.tsx", "jest.*"],
      rules: {
        "max-lines-per-function": "off",
      },
    },
  ],
  ignorePatterns: ["dist/", "node_modules/"],
};
