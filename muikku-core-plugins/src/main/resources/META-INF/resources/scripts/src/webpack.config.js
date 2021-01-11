let fs = require('fs');
let webpack = require("webpack");
let path = require("path");

const isDevelopment = process.env.NODE_ENV !== "production";
const mode = isDevelopment ? "development" : "production";

let MiniCSSExtractPlguin = require('mini-css-extract-plugin');

const plugins = [
	new MiniCSSExtractPlguin({
		filename: "[name].css",
		chunkFilename: "[name].css",
		ignoreOrder: true,
	}),
];
const rules = [];

if (mode === "production") {
	rules.push({ test: path.resolve(__dirname, "node_modules/redux-logger"), loader: "null-loader" });
	rules.push({ test: path.resolve(__dirname, "node_modules/redux-devtools-extension"), loader: "null-loader" });
}

rules.push({
	test: /\.tsx?$/,
	loader: "awesome-typescript-loader",
});
rules.push({
	test: /\.s?css$/,
	use: [
		{
			loader: MiniCSSExtractPlguin.loader,
		},
		{
			loader: "css-loader",
			options: { sourceMap: true, importLoaders: 1 },
		},
		{
			loader: "sass-loader",
			options: { sourceMap: true },
		},
	]
});

let entries = {};
let filenames = fs.readdirSync('./entries');
for (let file of filenames) {
	let actualFileName = file.split(".");
	actualFileName.pop();
	if (process.env.TARGET && process.env.TARGET !== actualFileName.join(".")) {
		continue;
	}
	entries[actualFileName.join(".")] = './entries/' + file;
}

module.exports = {
	mode,
	entry: entries,
	devtool: isDevelopment ? "inline-source-map" : false,
	output: {
		filename: "[name].js",
		path: __dirname + "/../dist"
	},
	optimization: {
		splitChunks: {
			chunks: "all",
			name: "vendors",
			cacheGroups: {
				vendors: {
					test: /[\/]node_modules[\/]/,
				},
			},
		}
	},
	resolve: {
		alias: {
			"~": __dirname
		},
		extensions: [".js", ".ts", ".tsx"]
	},
	module: {
		rules
	},
	plugins,
	externals: {
		"jquery": "jQuery",
		"mApi": "mApi",
		"moment": "moment",
		"getLocaleText": "getLocaleText"
	}
};
