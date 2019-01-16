module.exports = {
	sourceMap: process.env.NODE_ENV !== 'production',
	plugins: {
		autoprefixer: {},
		'postcss-easings': {},
		'postcss-preset-env': {
			stage: 0
		},
		cssnano: {
			preset: 'default'
		}
	}
};
