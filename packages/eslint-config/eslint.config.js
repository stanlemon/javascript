import eslint from "@eslint/js";
import vitest from "@vitest/eslint-plugin";
import importPlugin from "eslint-plugin-import";
import prettierPlugin from "eslint-plugin-prettier/recommended";
import reactPlugin from "eslint-plugin-react";
import testingLibrary from "eslint-plugin-testing-library";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["**/node_modules/", ".git/", "**/dist/"],
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
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    extends: [...tseslint.configs.recommended],
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
      "**/testUtils.js",
      "**/test-utils.js",
      "vitest.setup.js",
      "vitest.config.js",
    ],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.vitest,
      },
    },
    plugins: {
      vitest,
      testingLibrary,
    },
    ...vitest.configs.recommended,
    ...testingLibrary.configs["flat/react"],
    rules: {
      "max-lines-per-function": "off",
    },
  }
);
