const pkg = require('./package.json'),
	path = require('path'),
	webpack = require('webpack');

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
				includePaths: INCLUDES
			},
			postcss: {
				sourceMap: DEV,
				plugins: {
					autoprefixer: {},
					'postcss-preset-env': {
						stage: 0
					},
					cssnano: {
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
	chainWebpack: config => {
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

		config.plugin('define').tap(args => {
			args[0]['process.env'] = {
				...args[0]['process.env'],
				...{
					'BUILD_TIME': JSON.stringify(+(new Date()))
				}
			};

			return args;
		});
	}
};
