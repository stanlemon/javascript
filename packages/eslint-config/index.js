module.exports = {
  env: {
    es2022: true,
    browser: true,
    node: true,
    jest: true,
  },
  parserOptions: {
    sourceType: "module",
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
  plugins: ["import"],
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
    "no-console": "warn",
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
    "no-unused-vars": "warn",
    "@typescript-eslint/no-unused-vars": "warn",
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
