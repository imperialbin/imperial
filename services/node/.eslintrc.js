module.exports = {
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
	extends: ['plugin:react/recommended', 'xo', 'xo-typescript', 'xo-react'],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: 12,
		sourceType: 'module',
	},
	plugins: ['react', '@typescript-eslint'],
	rules: {
		'react/jsx-tag-spacing': 0,
		'@typescript-eslint/comma-dangle': 0,
		'react/function-component-definition': [2, {namedComponents: 'function-declaration'}],
		'radix': 0,
	},
	ignorePatterns: ['**/*.js'],
};
