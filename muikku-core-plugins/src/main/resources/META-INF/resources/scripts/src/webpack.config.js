const fs = require("fs");
const webpack = require("webpack");
const path = require("path");

const isDevelopment = process.env.NODE_ENV !== "production";
const mode = isDevelopment ? "development" : "production";

const MiniCSSExtractPlugin = require("mini-css-extract-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

const plugins = [];

plugins.push(new ForkTsCheckerWebpackPlugin());
plugins.push(
  new MiniCSSExtractPlugin({
    filename: "[name].css",
    chunkFilename: "[name].css",
    ignoreOrder: true,
  })
);

const rules = [];

if (mode === "production") {
  rules.push({
    test: path.resolve(__dirname, "node_modules/redux-logger"),
    loader: "null-loader",
  });
  rules.push({
    test: path.resolve(__dirname, "node_modules/@redux-devtools/extension"),
    loader: "null-loader",
  });
}

rules.push({
  test: /\.tsx?$/,
  loader: "ts-loader",
  options: {
    transpileOnly: true,
  },
});
rules.push({
  test: /\.s?css$/,
  use: [
    {
      loader: MiniCSSExtractPlugin.loader,
    },
    {
      loader: "css-loader",
      options: {
        sourceMap: true,
        importLoaders: 1,
        url: false,
        modules: {
          compileType: "icss", // needed to import the sass variables to js
        },
      },
    },
    {
      loader: "sass-loader",
      options: {
        sourceMap: true,
      },
    },
  ],
});

const entries = {};
const filenames = fs.readdirSync("./entries");
for (let file of filenames) {
  const actualFileName = file.split(".");
  actualFileName.pop();
  if (process.env.TARGET && process.env.TARGET !== actualFileName.join(".")) {
    continue;
  }
  entries[actualFileName.join(".")] = "./entries/" + file;
}

module.exports = {
  mode,
  entry: entries,
  devtool: isDevelopment ? "inline-cheap-module-source-map" : false,
  output: {
    filename: "[name].js",
    path: __dirname + "/../dist",
  },
  optimization: {
    splitChunks: {
      chunks: "all",
      name: "vendor",
      cacheGroups: {
        vendor: {
          test: /[\/]node_modules[\/]/,
        },
      },
    },
  },
  resolve: {
    alias: {
      "~": __dirname,
    },
    extensions: [".js", ".ts", ".tsx"],
  },
  module: {
    rules,
  },
  plugins,
  externals: {
    jquery: "jQuery",
    moment: "moment",
  },
};
