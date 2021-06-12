module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['plugin:react/recommended', 'xo', 'xo-space', 'xo-typescript'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {jsx: true},
    tsconfigRootDir: __dirname,
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {
    'react/jsx-tag-spacing': 1,
    'react/function-component-definition': [2, {namedComponents: 'function-declaration'}],
    'radix': 0,
    '@typescript-eslint/comma-dangle': 0,
    '@typescript-eslint/indent': 0,
    '@typescript-eslint/quotes': 0,
  },
  ignorePatterns: ['**/*.js'],
};
