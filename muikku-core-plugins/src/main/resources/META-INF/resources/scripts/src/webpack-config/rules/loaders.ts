import * as webpack from "webpack";

// Defines the postcss loader for the webpack configuration
export const postcss: webpack.RuleSetRule = {
  loader: "postcss-loader",
  options: {
    sourceMap: true,
  },
};

// Defines the css loader for the webpack configuration
export const css: webpack.RuleSetRule = {
  loader: "css-loader",
  options: {
    sourceMap: true,
    importLoaders: 1,
    url: false,
  },
};

// Defines the css vendors loader for the webpack configuration
export const cssVendors: webpack.RuleSetRule = {
  loader: "css-loader",
  options: {
    sourceMap: true,
  },
};

// Defines the scss loader for the webpack configuration
export const scss: webpack.RuleSetRule = {
  loader: "sass-loader",
  options: {
    sourceMap: true,
  },
};

// Defines the resolve url loader for the webpack configuration
export const resolveUrl: webpack.RuleSetRule = {
  loader: "resolve-url-loader",
};

// Defines the esbuild loader for the webpack configuration
export const esbuild: webpack.RuleSetRule = {
  loader: "esbuild-loader",
  options: {
    loader: "tsx",
    target: "es2015",
  },
};

// Defines the esbuild typescript loader for the webpack configuration
export const esbuildTypescript: webpack.RuleSetRule = {
  loader: "esbuild-loader",
  options: {
    loader: "ts",
    target: "es2015",
  },
};

// Defines the style loader for the webpack configuration
export const style: webpack.RuleSetRule = {
  loader: "style-loader",
};
