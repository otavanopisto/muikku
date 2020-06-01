let fs = require('fs');
let webpack = require("webpack");
let path = require("path");

let ExtractTextPlugin = require('extract-text-webpack-plugin');

let plugins = [
	new webpack.optimize.CommonsChunkPlugin({
		name: 'vendor',
		minChunks: ({ context }) => context && context.includes("node_modules"),
	}),
	new webpack.EnvironmentPlugin({
		'NODE_ENV': "development"
	})
];

if (process.env.NODE_ENV === "production"){
	console.log("minifying and removing duplications");
	plugins.push(new webpack.optimize.DedupePlugin())
	plugins.push(new webpack.optimize.UglifyJsPlugin({
        	output: {
        		comments: false,
        	},
        	compress: {
            warnings: true,
            screw_ie8: true
          }
	}));
}

let rules = [];

if (process.env.NODE_ENV === "production"){
	console.log("avoiding redux logger and devtools extension");
	rules.push({test: path.resolve(__dirname, "node_modules/redux-logger"), loader: "null-loader"});
	rules.push({test: path.resolve(__dirname, "node_modules/redux-devtools-extension"), loader: "null-loader"});
}

rules.push({test: /\.tsx?$/, loader: "awesome-typescript-loader" });
rules.push({
  test: /\.css$/,
  loader: ExtractTextPlugin.extract({
    use: ['css-loader?importLoaders=1'],
  }),
});
rules.push({
  test: /\.(sass|scss)$/,
  loader: ExtractTextPlugin.extract(['css-loader', 'sass-loader'])
});
plugins.push(new ExtractTextPlugin({
  filename: '[name].css',
  allChunks: true,
}))

if (process.env.NODE_ENV !== "production") {
	console.log("using source-map-loader");
	rules.push({ enforce: "pre", test: /\.ts|\.tsx$/, loader: "source-map-loader" });
}

if (process.env.NODE_ENV !== "production") {
	console.log("setting devtool as source map");
	plugins.push(new webpack.EvalSourceMapDevToolPlugin({
		exclude: [
			'node_modules/*.js'
		]
  }));
}

let entries = {};
let filenames = fs.readdirSync('./entries');
for (let file of filenames) {
  let actualFileName = file.split(".");
  actualFileName.pop();
  if (process.env.TARGET && process.env.TARGET !== actualFileName.join(".")){
    continue;
  }
  entries[actualFileName.join(".")] = './entries/' + file;
}

module.exports = {
	entry: entries,
	output: {
		filename: "[name].js",
		path: __dirname + "/../dist"
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
