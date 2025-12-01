import { Configuration as WebpackConfiguration } from "webpack";
import { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";
import { EsbuildPlugin } from "esbuild-loader";
import resolvePath from "./path";
import rules from "./rules";
import plugins from "./plugins";
import devServer from "./dev_server";
import path from "path";

const SRC_DIR = path.resolve(__dirname, "..");

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
  "~": SRC_DIR,
};

const fallback = {
  "react/jsx-runtime": "react/jsx-runtime.js",
  "react/jsx-dev-runtime": "react/jsx-dev-runtime.js",
};

// Defines the webpack configuration
const config: Configuration = {
  resolve: { extensions, alias, fallback },
  mode: "development",
  target: "web",
  entry: [
    "webpack-dev-server/client?hot=true",
    "webpack/hot/only-dev-server",
    "react-hot-loader/patch",
    "raf/polyfill",
    "./entries/root.dev",
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
  devtool: "eval-source-map",
  context,
  optimization: {
    emitOnErrors: true,
    splitChunks: {
      chunks: "all",
    },
    minimize: false,
    minimizer: [
      new EsbuildPlugin({
        target: "es2015",
        css: true,
      }),
    ],
  },
  performance: {
    hints: false,
  },
};

export default config;
