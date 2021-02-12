module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
    jquery: true,
    browser: true,
  },
  extends: "eslint:recommended",
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {},
  overrides: [
    {
      files: "./public/assets/**/*.js",
      rules: {
        "no-undef": "off",
        "no-unused-vars": "off",
      },
    },
  ],
};
