module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ["plugin:react/recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    tsconfigRootDir: __dirname,
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint"],
  rules: {
    "react/jsx-tag-spacing": 1,
    "@typescript-eslint/comma-dangle": 1,
    "react/function-component-definition": [2, { namedComponents: "function-declaration" }],
    "radix": 0,
    "comma-dangle": "always-multiline",
  },
  ignorePatterns: ["**/*.js"],
};
