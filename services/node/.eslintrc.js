module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ["plugin:react/recommended", "xo", "xo-space", "xo-typescript"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: { jsx: true },
    tsconfigRootDir: __dirname,
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint"],
  rules: {
    "object-curly-spacing": 0,
    "react/jsx-tag-spacing": 0,
    "radix": 0,
    "@typescript-eslint/triple-slash-reference": 0,
    "@typescript-eslint/comma-dangle": 0,
    "@typescript-eslint/indent": 0,
    "@typescript-eslint/quotes": 0,
    "@typescript-eslint/object-curly-spacing": 0,
    "@typescript-eslint/no-confusing-void-expression": "off",
    "curly": "off",
  },
  ignorePatterns: ["**/*.js"],
};
