import { Configuration } from "webpack-dev-server";

// Defines the dev server configuration for webpack dev server
const devServer: Configuration = {
  port: 8000,
  hot: "only",
  historyApiFallback: true,
  host: "dev.muikkuverkko.fi",
  client: {
    overlay: true,
  },
  proxy: [
    {
      context: [
        "/gfx",
        "/heartbeat",
        "/rest",
        "/scripts",
        "/login",
        "/logout",
        "/sounds",
      ],
      target: "https://dev.muikkuverkko.fi:8443",
      secure: false,
      changeOrigin: true,
    },
  ],
};

export default devServer;
