import { Configuration as WebpackConfiguration } from "webpack";
import { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";

import TerserPlugin from "terser-webpack-plugin";

import resolvePath from "./path";

import rules from "./rules";
import plugins from "./plugins";
import devServer from "./dev_server";
import path from "path";

/**
 * Webpack configuration interface
 */
interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

const context = resolvePath();

const publicPath = process.env.PUBLIC_PATH || "/";

const extensions = [".js", ".ts", ".jsx", ".tsx"];

// Defines the alias for the webpack configuration
const alias = {
  "@babel/runtime": resolvePath("node_modules/@babel/runtime"),
  "react-dom": "@hot-loader/react-dom",
  "~": path.resolve(
    "C:/Otavia/muikku/muikku-core-plugins/src/main/resources/META-INF/resources/scripts/src"
  ),
};

// Defines the webpack configuration
const config: Configuration = {
  resolve: { extensions, alias },
  mode: "development",
  target: "web",
  entry: [
    "webpack-dev-server/client?hot=true",
    "webpack/hot/only-dev-server",
    "react-hot-loader/patch",
    "@babel/polyfill",
    "raf/polyfill",
    "./entries/root",
  ],
  output: {
    filename: "[name].[contenthash].js",
    path: resolvePath("build"),
    publicPath,
    chunkFilename: "[name].[id].[contenthash].js",
  },
  module: { rules },
  plugins,
  externals: {
    jquery: "jQuery",
  },
  devServer,
  devtool: "inline-cheap-module-source-map",
  context,
  optimization: {
    emitOnErrors: true,
    splitChunks: {
      chunks: "all",
    },
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        parallel: true,
        terserOptions: {
          // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
        },
      }),
    ],
  },
  performance: {
    hints: false,
  },
};

export default config;
