import { Configuration } from "webpack-dev-server";

// Defines the dev server configuration for webpack dev server
const devServer: Configuration = {
  port: 8000,
  host: "dev.muikkuverkko.fi",
  hot: "only",
  historyApiFallback: true,
  client: {
    overlay: true,
    logging: "none",
    webSocketTransport: "ws",
    webSocketURL: "ws://dev.muikkuverkko.fi:8000/ws",
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
    {
      context: ["/ws/socket/**"],
      target: "wss://dev.muikkuverkko.fi",
      ws: true,
      secure: true,
      changeOrigin: true,
      logLevel: "debug",
    },
  ],
  webSocketServer: "ws",
};

export default devServer;
