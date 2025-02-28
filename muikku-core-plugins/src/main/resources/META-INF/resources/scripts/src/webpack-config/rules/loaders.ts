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

// Defines the babel loader for the webpack configuration
export const babel: webpack.RuleSetRule = {
  loader: "babel-loader",
  options: {
    cacheDirectory: true,
    rootMode: "upward",
  },
};

// Defines the typescript loader for the webpack configuration
export const typescript: webpack.RuleSetRule = {
  loader: "ts-loader",
  options: {
    transpileOnly: true,
  },
};

// Defines the style loader for the webpack configuration
export const style: webpack.RuleSetRule = {
  loader: "style-loader",
};
