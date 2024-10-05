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
    jest: true,
  },
  ...(tsconfigExists && { parser: "@typescript-eslint/parser" }),
  parserOptions: {
    sourceType: "module",
    ...(tsconfigExists && { project: tsconfigPath }),
  },
  extends: [
    "eslint:recommended",
    "plugin:jest/recommended",
    "plugin:jest-dom/recommended",
    "plugin:prettier/recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "typescript",
    "typescript/react",
  ],
  plugins: ["import", ...(tsconfigExists ? ["deprecation"] : [])],
  settings: {
    react: {
      version: "detect",
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
    "react/display-name": "off",
    "react/react-in-jsx-scope": "off",
    "react/jsx-uses-react": "off",
    "react/prop-types": "off",
    "react/no-unescaped-entities": ["error", { forbid: [">", "}"] }],
    // Allow exporting of unnamed objects as a default
    "import/no-anonymous-default-export": [
      "error",
      {
        allowObject: true,
      },
    ],
    "import/first": "error",
    "import/no-amd": "error",
    "import/no-webpack-loader-syntax": "error",
    "import/no-unused-modules": "error",
    "prettier/prettier": [
      "error",
      {
        trailingComma: "es5",
      },
    ],
    "no-unused-vars": [
      "warn",
      {
        caughtErrors: "none",
        destructuredArrayIgnorePattern: "^_",
        ignoreRestSiblings: true,
        args: "none",
      },
    ],
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        caughtErrors: "none",
        destructuredArrayIgnorePattern: "^_",
        ignoreRestSiblings: true,
        args: "none",
      },
    ],
    ...(tsconfigExists && { "deprecation/deprecation": "warn" }),
  },
  overrides: [
    {
      files: ["**/*.{ts,tsx}"],
      rules: {
        // Empty functions are ok, especially for default values
        "no-empty-function": "off",
        "@typescript-eslint/no-empty-function": "off",
        // Requires 'public' before public methods
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
      files: ["**/*.test.js", "**/*.test.ts", "**/*.test.tsx"],
      rules: {
        "max-lines-per-function": "off",
      },
    },
  ],
  ignorePatterns: [".eslintrc.js", "dist/", "node_modules/"],
};
