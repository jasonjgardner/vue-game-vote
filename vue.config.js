const pkg = require('./package.json'),
	path = require('path'),
	proc = require('child_process'),
	ImageminPlugin = require('imagemin-webpack-plugin').default,
	CompressionPlugin = require('compression-webpack-plugin');

const DEV = process.env.NODE_ENV !== 'production',
	INCLUDES = [
		'C:\\node_modules',
		'D:\\node_modules',
		path.join(__dirname, '/node_modules')
	];

module.exports = {
	assetsDir: 'assets',
	runtimeCompiler: true,
	devServer: {
		compress: true,
		https: false
	},
	css: {
		sourceMap: DEV,
		extract: true,
		loaderOptions: {
			sass: {
				sourceMap: DEV,
				indentedSyntax: false,
				includePaths: INCLUDES
			}
		}
	},
	pwa: {
		name: pkg.config.title || pkg.name,
		themeColor: pkg.config.themeColor,
		msTileColor: pkg.config.themeColor
	},
	publicPath: pkg.config.publicPath,
	outputDir: path.join(__dirname, 'dist'),
	productionSourceMap: false,
	pluginOptions: {
		critical: {
			width: 375,
			height: 565
		},
		webpackBundleAnalyzer: {
			openAnalyzer: DEV
		}
	},
	configureWebpack: {
		plugins: [
			new ImageminPlugin({
				test: /\.(jpe?g|png|gif|svg)$/i
			}),
			new CompressionPlugin()
		]
	},
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
			args[0]['process.env']['BUILD_TIME'] =
				JSON.stringify(proc.execSync('git log -1 --format=%cd --date=iso').toString().trim());

			return args;
		});
	},
	parallel: undefined
};
