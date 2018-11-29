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
			}
		}
	},
	pwa: {
		name: 'Game Vote',
		themeColor: '#2d2d2d',
		msTileColor: '#2d2d2d'
	},
	baseUrl: DEV ? pkg.config.deploymentPath : '/',
	outputDir: path.resolve(__dirname, '/public'),
	productionSourceMap: false,
	configureWebpack: {
		plugins: [
		]
	}
};
