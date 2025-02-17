// Generated from the ESM version of the file by Claude Haiku
const globals = require("globals");
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const prettierPlugin = require("eslint-plugin-prettier/recommended");
const reactPlugin = require("eslint-plugin-react");
const importPlugin = require("eslint-plugin-import");
const jest = require("eslint-plugin-jest");
const jestDom = require("eslint-plugin-jest-dom");

module.exports = tseslint.config(
  {
    ignores: [
      "**/node_modules/",
      ".git/",
      "**/dist/",
      // This is an override of @types/pouchdb-core which we want to ignore when linting
      "**/types-pouchdb-core/",
    ],
  },
  eslint.configs.recommended,
  prettierPlugin,
  importPlugin.flatConfigs.react,
  importPlugin.flatConfigs.typescript,

  reactPlugin.configs.flat.recommended,
  {
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.jest,
        ...globals.node,
      },
    },
    plugins: {
      reactPlugin,
    },
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
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    extends: [...tseslint.configs.recommended],
    /*
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['*.ts', '*.tsx'],
        },
        tsconfigRootDir: import.meta.dirname,

      },
    },
    */
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
    files: [
      "**/*.test.js",
      "**/*.test.ts",
      "**/*.test.tsx",
      "jest.setup.js",
      "jest.config.js",
    ],
    ...jestDom.configs["flat/recommended"],
    ...jest.configs["flat/recommended"],
    rules: {
      "max-lines-per-function": "off",
    },
  }
);
