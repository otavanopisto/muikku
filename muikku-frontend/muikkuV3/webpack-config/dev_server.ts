import { Configuration } from "webpack-dev-server";

// Defines the dev server configuration for webpack dev server
const devServer: Configuration = {
  port: 8000,
  host: "dev.muikkuverkko.fi",
  hot: "only",
  historyApiFallback: {
    disableDotRule: true,
  },
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
        "/tempFileUploadServlet",
        "/communicatorAttachmentUploadServlet",
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
    {
      // eslint-disable-next-line jsdoc/require-jsdoc
      context: (pathname) =>
        /^\/workspace\/.+\/materials\/.+\.(png|jpe?g|gif|webp|svg|bmp|pdf|mp3|mp4|wav|ogg|webm)$/i.test(
          pathname
        ) || pathname.startsWith("/materialAttachmentUploadServlet"),
      target: "https://dev.muikkuverkko.fi:8443",
      secure: false,
      changeOrigin: true,
    },
  ],
  webSocketServer: "ws",
};

export default devServer;
