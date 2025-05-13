import * as webpack from "webpack";
import {
  css as cssLoader,
  scss as scssLoader,
  style,
  esbuild,
  esbuildTypescript,
  resolveUrl,
  postcss,
} from "./loaders";

// Defines the excluded files
const exclude = /node_modules/;

// Defines the js rule loaders
export const js: webpack.RuleSetRule = {
  test: /.jsx?$/,
  use: [esbuild],
  exclude,
};

// Defines the ts2 rule loaders
export const ts2: webpack.RuleSetRule = {
  test: /.ts?$/,
  use: [esbuildTypescript],
  exclude,
};

// Defines the tsx rule loaders
export const ts: webpack.RuleSetRule = {
  test: /.tsx?$/,
  use: [esbuild],
  exclude,
};

// Defines the scss rule loaders
export const scss: webpack.RuleSetRule = {
  test: /\.scss$/,
  use: [style, cssLoader, postcss, resolveUrl, scssLoader],
};

// Defines the css rule loaders
export const css: webpack.RuleSetRule = {
  test: /\.css$/,
  exclude,
  use: [style, cssLoader, postcss],
};

// Defines the css dependencies rule loaders
export const cssDependencies: webpack.RuleSetRule = {
  test: /\.css$/,
  include: /node_modules/,
  use: [style, cssLoader, postcss],
};

export const image: webpack.RuleSetRule = {
  test: /\.(png|svg|jpg|jpeg|gif)$/i,
  type: "asset/resource",
  generator: {
    filename: "images/[name][ext]",
  },
};
