const pkg = require('./package.json'),
	path = require('path'),
	proc = require('child_process'),
	ImageminPlugin = require('imagemin-webpack-plugin').default,
	CompressionPlugin = require('compression-webpack-plugin'),
	SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');

const DEV = process.env.NODE_ENV !== 'production',
	INCLUDES = [
		'C:\\node_modules',
		'D:\\node_modules',
		path.join(__dirname, '/node_modules')
	];

module.exports = {
	assetsDir: 'assets',
	runtimeCompiler: DEV,
	devServer: {
		compress: true,
		https: false
	},
	parallel: true,
	css: {
		sourceMap: DEV,
		extract: !DEV,
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
			width: 320,
			height: 480
		},
		externals: [
			{
				module: 'normalize',
				entry: 'https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css',
				attributes: {
					integrity: 'sha256-l85OmPOjvil/SOvVt3HnSSjzF1TUMyT9eV0c2BzEGzU=',
					crossorigin: 'anonymous'
				}
			}
		],
		meta: {
			projectName: pkg.config.title,
			url: pkg.homepage,
			description: pkg.description,
			twitterHandle: 'JasonGardner',
			googleAnalytics: process.env.VUE_APP_GA_TRACKING
		},
		webpackBundleAnalyzer: {
			openAnalyzer: true
		}
	},
	configureWebpack: {
		plugins: [
			new ImageminPlugin({
				disable: !DEV,
				test: 'src/assets/img/**',
				cacheFolder: path.join(__dirname, '/.cache'),
				maxConcurrency: Infinity
			}),
			new CompressionPlugin({
				cache: path.join(__dirname, '/.cache'),
				algorithm: 'gzip'
			}),
			new SWPrecacheWebpackPlugin()
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
			args[0] = {
				...args[0],
				...pkg.config,
				...{
					version: pkg.version,
					title: pkg.config.title,
					typekitId: process.env.VUE_APP_TYPEKIT_ID
				}
			};

			return args;
		});

		config.plugin('define').tap(args => {
			args[0]['process.env']['BUILD_TIME'] =
				JSON.stringify(proc.execSync('git log -1 --format=%cd --date=iso').toString().trim());
			args[0]['process.env']['VERSION'] = JSON.stringify(pkg.version) + (DEV ? '' : '-beta');

			return args;
		});
	}
};
