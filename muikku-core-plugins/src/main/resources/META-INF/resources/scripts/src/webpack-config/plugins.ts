import * as webpack from "webpack";

import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

process.env.PUBLIC_PATH = process.env.PUBLIC_PATH || "/";

// Defines the client plugins for the webpack configuration
const client: webpack.WebpackPluginInstance[] = [
  new HtmlWebpackPlugin({
    template: "./index.html",
    hash: true,
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeAttributeQuotes: false,
      minifyJS: true,
      minifyCSS: true,
    },
  }),
  new MiniCssExtractPlugin({
    filename: "[name].css",
    chunkFilename: "[id].css",
  }) as unknown as webpack.WebpackPluginInstance,
];

if (process.env.NODE_ENV === "production") {
  client.push(
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    })
  );
} else {
  client.push(
    new webpack.LoaderOptionsPlugin({
      minimize: false,
      debug: true,
    }),
    new webpack.HotModuleReplacementPlugin()
  );
}

export default client;
