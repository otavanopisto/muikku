import * as webpack from "webpack";
import {
  css as cssLoader,
  scss as scssLoader,
  style,
  esbuild,
  esbuildTypescript,
} from "./loaders";

const exclude = /node_modules/;

export const js: webpack.RuleSetRule = {
  test: /.jsx?$/,
  use: [esbuild],
  exclude,
};

export const ts2: webpack.RuleSetRule = {
  test: /.ts?$/,
  use: [esbuildTypescript],
  exclude,
};

export const ts: webpack.RuleSetRule = {
  test: /.tsx?$/,
  use: [esbuild],
  exclude,
};

// Defines the scss rule loaders
export const scss: webpack.RuleSetRule = {
  test: /\.scss$/,
  use: [style, cssLoader, scssLoader],
};

// Defines the css rule loaders
export const css: webpack.RuleSetRule = {
  test: /\.css$/,
  exclude,
  use: [style, cssLoader, scssLoader],
};

// Defines the css dependencies rule loaders
export const cssDependencies: webpack.RuleSetRule = {
  test: /\.css$/,
  include: /node_modules/,
  use: [style, cssLoader, scssLoader],
};
