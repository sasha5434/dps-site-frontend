/* eslint-disable quotes */
module.exports = {
	"css": {
		extract: process.env.NODE_ENV === "production" ? {
			ignoreOrder: true,
		} : false
	},
	"crossorigin": "anonymous",
	"assetsDir": "./static",
	"productionSourceMap": false,
	"configureWebpack": { 
		performance: { hints: false }
	},
	"chainWebpack": config => {
		config.module.rule("md")
			.test(/\.md/)
			.use("vue-loader")
			.loader("vue-loader")
			.end()
			.use("vue-md-loader")
			.loader("vue-md-loader")
			.options({
				live: false
			});
		config.plugin("html")
			.tap(args => {
				args[0].title = "Asura TeraLogs - Tera Online damage statistic storage site for server Asura.";
				return args;
			});
		config.optimization.minimizer("terser")
			.tap((args) => {
				if (process.env.NODE_ENV === "production") {
					args[0].terserOptions.compress.drop_console = true;
					args[0].terserOptions.compress.drop_debugger = true;
				}
				args[0].terserOptions.mangle.safari10 = false;
				return args;
			});
	},
	"pluginOptions": {
		webpackBundleAnalyzer: {
			openAnalyzer: !(process.env.NODE_ENV === "production"),
			reportFilename: "bundle.html"
		}
	}
};
