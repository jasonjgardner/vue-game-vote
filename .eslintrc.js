module.exports = {
	root: true,
	env: {
		node: true
	},
	'extends': [
		'plugin:vue/recommended'
	],
	rules: {
		'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'no-mixed-spaces-and-tabs': 'off',
		'vue/html-indent': 'off',
		'vue/max-attributes-per-line': [
			'error', {
				'singleline': 3,
				'multiline': {
					'max': 2,
					'allowFirstLine':  true
				}
			}
		]
	},
	parserOptions: {
		parser: 'babel-eslint'
	}
};
