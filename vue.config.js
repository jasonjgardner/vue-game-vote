const pkg = require('./package.json'),
	path = require('path'),
	merge = require('babel-merge');

const DEV = process.env.NODE_ENV !== 'production',
	INCLUDES = [
		'C:\\node_modules',
		'D:\\node_modules',
		path.join(__dirname, '/node_modules')
	];

module.exports = {
	assetsDir: 'assets',
	runtimeCompiler: true,
	css: {
		sourceMap: DEV,
		extract: !DEV,
		loaderOptions: {
			sass: {
				sourceMap: DEV,
				indentedSyntax: false,
				includePaths: [
					path.resolve(__dirname, '/node_modules/')
				]
			},
			postcss: {
				sourceMap: DEV,
				plugins: {
					'autoprefixer': {},
					'postcss-preset-env': {
						stage: 0
					},
					'cssnano': {
						preset: 'default'
					}
				}
			}
		}
	},
	pwa: {
		name: pkg.config.title || pkg.name,
		themeColor: pkg.config.themeColor,
		msTileColor: pkg.config.themeColor
	},
	baseUrl: pkg.config.deploymentPath,
	outputDir: path.join(__dirname, '/dist'),
	productionSourceMap: false,
	configureWebpack: {
		plugins: [
		]
	},
	chainWebpack: config => {
		/*config.module.rule('scss')
			.test(/\.scss$/)
			.oneOf('vue-modules')
				.resourceQuery(/module/)
					.use('vue')
						.loader('vue-style-loader')
							.tap(options => merge(options, {
							sourceMap: DEV,
							shadowMode: false
						}))
						.end()
					.use('css')
						.loader('css-loader')
							.tap(options => merge(options, {
								sourceMap: DEV,
								importLoaders: 1,
								modules: true,
								localIdentName: '[name]_[local]_[hash:base64:5]'
							}))
						.end()
					.use('postcss')
						.loader('postcss-loader')
							.tap(options => merge(options, {plugins: []}))
						.end()
					.use('sass')
						.loader('sass-loader')
						.tap(options => merge(options, {
								sourceMap: DEV,
								indentedSyntax: false,
								includePaths: INCLUDES
							}));

		config.module.rule('scss').test(/\.scss$/)
			.oneOf('vue')
			.resourceQuery(/\?vue/)
				.use('vue')
						.loader('vue-style-loader')
							.tap(options => merge(options, {
							sourceMap: DEV,
							shadowMode: false
						}))
						.end()
					.use('css')
						.loader('css-loader')
							.tap(options => merge(options, {
								sourceMap: DEV,
								importLoaders: 1,
								modules: true,
								localIdentName: '[name]_[local]_[hash:base64:5]'
							}))
						.end()
					.use('postcss')
						.loader('postcss-loader')
							.tap(options => merge(options, {plugins: []}))
						.end()
					.use('sass')
						.loader('sass-loader')
						.tap(options => merge(options, {
								sourceMap: DEV,
								indentedSyntax: false,
								includePaths: INCLUDES
							}));

		config.module.rule('scss').test(/\.scss$/)
			.oneOf('normal-modules')
			.test(/\.module\.\w+$/)
				.use('vue')
						.loader('vue-style-loader')
							.tap(options => merge(options, {
							sourceMap: DEV,
							shadowMode: false
						}))
						.end()
					.use('css')
						.loader('css-loader')
							.tap(options => merge(options, {
								sourceMap: DEV,
								importLoaders: 1,
								modules: true,
								localIdentName: '[name]_[local]_[hash:base64:5]'
							}))
						.end()
					.use('postcss')
						.loader('postcss-loader')
							.tap(options => merge(options, {plugins: []}))
						.end()
					.use('sass')
						.loader('sass-loader')
						.tap(options => merge(options, {
								sourceMap: DEV,
								indentedSyntax: false,
								includePaths: INCLUDES
							}));

		config.module.rule('scss').test(/\.scss$/)
			.oneOf('normal')
			.use('vue')
				.loader('vue-style-loader')
					.tap(options => merge(options, {
					sourceMap: DEV,
					shadowMode: false
				}))
					.end()
				.use('css')
						.loader('css-loader')
							.tap(options => merge(options, {
								sourceMap: DEV,
								importLoaders: 1,
								modules: true,
								localIdentName: '[name]_[local]_[hash:base64:5]'
							}))
						.end()
					.use('postcss')
						.loader('postcss-loader')
							.tap(options => merge(options, {plugins: []}))
						.end()
					.use('sass')
						.loader('sass-loader')
						.tap(options => merge(options, {
								sourceMap: DEV,
								indentedSyntax: false,
								includePaths: INCLUDES
							}));
*/

		const svgRule = config.module.rule('svg');

		svgRule.uses.clear();

		svgRule
			.use('vue-svg-loader')
			.loader('vue-svg-loader');

		config.module.rule('md')
			.test(/\.md$/)
			.use('markdown-loader')
			.loader('markdown-loader')
			.end()
			.use('html-loader')
			.loader('html-loader');

		config.plugin('html').tap(args => {
			args[0].title = pkg.config.title;
			args[0].version = pkg.version;
			args[0].themeColor = pkg.config.themeColor;

			return args;
		});
	}
};
