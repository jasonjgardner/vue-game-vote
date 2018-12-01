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
		name: 'Video Game Vote',
		themeColor: '#2d2d2d',
		msTileColor: '#2d2d2d'
	},
	baseUrl: pkg.config.deploymentPath,
	outputDir: path.join(__dirname, '/dist'),
	productionSourceMap: false,
	configureWebpack: {
		plugins: [
		]
	}
};
