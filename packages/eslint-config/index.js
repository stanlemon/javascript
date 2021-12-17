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
      files: ["**/*.ts", "**/*.tsx"],
      extends: ["plugin:@typescript-eslint/recommended"],
      rules: {
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
