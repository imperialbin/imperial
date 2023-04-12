module.exports = {
  env: {
    browser: false,
    es2021: true,
  },
  extends: ["xo", "xo-typescript"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "@typescript-eslint/consistent-type-imports": "off",

    "no-tabs": ["error"],
    "jsx-quotes": ["error", "prefer-double"],
    "no-warning-comments": "off",

    /* must be a space for object curly spacing */
    "@typescript-eslint/object-curly-spacing": ["error", "always"],

    // Prettier
    "@typescript-eslint/comma-dangle": "off",
    "no-mixed-operators": "off",
    "operator-linebreak": "off",
    "@typescript-eslint/naming-convention": "off",
    "@typescript-eslint/quotes": "off",
    "@typescript-eslint/indent": "off",
    "arrow-parens": ["error", "always"],
    "@typescript-eslint/no-floating-promises": "off",
    "no-await-in-loop": "off",
    "@typescript-eslint/ban-types": "off",
    "@typescript-eslint/no-extraneous-class": "off",
    "@typescript-eslint/non-nullable-type-assertion-style": "off",
    "no-bitwise": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        destructuredArrayIgnorePattern: "^_",
        argsIgnorePattern: "^_",
        ignoreRestSiblings: true,
      },
    ],
  },
};
