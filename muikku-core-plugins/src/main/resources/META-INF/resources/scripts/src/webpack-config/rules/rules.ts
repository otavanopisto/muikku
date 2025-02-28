import * as webpack from "webpack";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import {
  css as cssLoader,
  scss as scssLoader,
  babel,
  typescript,
} from "./loaders";

const exclude = /node_modules/;

// Defines the js rule loaders
export const js: webpack.RuleSetRule = {
  test: /.jsx?$/,
  use: babel,
  exclude,
};

// Defines the ts rule loaders
export const ts: webpack.RuleSetRule = {
  test: /.tsx?$/,
  use: typescript,
  exclude,
};

// Defines the scss rule loaders
export const scss: webpack.RuleSetRule = {
  test: /\.scss$/,
  use: [MiniCssExtractPlugin.loader, cssLoader, scssLoader],
};

// Defines the css rule loaders
export const css: webpack.RuleSetRule = {
  test: /\.css$/,
  exclude,
  use: [MiniCssExtractPlugin.loader, cssLoader, scssLoader],
};

// Defines the css dependencies rule loaders
export const cssDependencies: webpack.RuleSetRule = {
  test: /\.css$/,
  include: /node_modules/,
  use: [MiniCssExtractPlugin.loader, cssLoader, scssLoader],
};
