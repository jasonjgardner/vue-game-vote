const pkg = require('./package.json'),
	path = require('path');

const DEV = process.env.NODE_ENV !== 'production';

module.exports = {
	assetsDir: 'assets',
	runtimeCompiler: true,
	css: {
		sourceMap: DEV,
		extract: false,
		loaderOptions: {
			sass: {
				includePaths: [
					path.resolve(__dirname, '/node_modules/')
				]
			},
			postcss: {
				ident: 'postcss',
				plugins: () => [
					require('autoprefixer')(),
					require('postcss-preset-env')({
						stage: 0
					}),
					require('cssnano')({
						preset: 'default'
					})
				]
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
		config.module.rule('md')
			.test(/\.md$/)
			.use('html-loader')
			.loader('html-loader')
			.end()
			.use('markdown-loader')
			.loader('markdown-loader');

		config.plugin('html').tap(args => {
			args[0].title = pkg.config.title;
			args[0].version = pkg.version;
			args[0].themeColor = pkg.config.themeColor;

			return args;
		})
	}
};
