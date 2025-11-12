import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { devtools } from "@tanstack/devtools-vite";

// https://vite.dev/config/

// Configuration for Vite.
// Includes build configuration and dev server configuration.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const plugins = [
    react({
      babel: {
        presets: ["jotai/babel/preset"],
      },
    }),
  ];

  if (env.NODE_ENV === "development") {
    plugins.push(devtools());
  }

  return {
    plugins,
    resolve: {
      // Alias for the src directory
      alias: {
        "~": path.resolve(__dirname, "./"),
        src: "/src",
      },
    },
    define: {
      "process.env.NODE_ENV": JSON.stringify(env.NODE_ENV || "development"),
    },
    // Add base path configuration based on the mode
    base: mode === "production" ? "/scripts/dist" : "/",

    // Add build configuration
    build: {
      // Match your esbuild output structure
      outDir: "../dist",

      minify: env.NODE_ENV === "production" ? "esbuild" : false,
      sourcemap: env.NODE_ENV !== "production",

      assetsDir: "",

      // Create multiple entry points like your esbuild
      rollupOptions: {
        input: {
          root: "./src/main.tsx",
          // Add polyfill entry if needed
          // polyfill: './src/polyfill-mediarecorder.ts'
        },
        output: {
          // Use [name] pattern like your esbuild
          entryFileNames: "[name].js",
          chunkFileNames: "commons-[hash].js",
          assetFileNames: (assetInfo) => {
            // Handle CSS files specially
            if (assetInfo.names.some((name) => name.endsWith(".css"))) {
              const hasHash = assetInfo.names.some(
                (name) => name.includes("-") && /[A-Z0-9]{8,}/.test(name)
              );

              if (!hasHash) {
                return "root.css";
              }
              return "[name]-[hash].[ext]";
            }

            // For all other assets, put them in the root directory to match your imports
            return "[name]-[hash].[ext]";
          },
        },

        external: ["/gfx/*", "/sounds/*"],
      },
    },

    // Dev server configuration, with proxys
    server: {
      watch: {
        usePolling: true,
      },
      host: "dev.muikkuverkko.fi",
      strictPort: true,
      port: 8000,
      proxy: {
        "/gfx": {
          target: "https://dev.muikkuverkko.fi:8443/gfx",
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/gfx/, ""),
        },
        "/heartbeat": {
          target: "https://dev.muikkuverkko.fi:8443/heartbeat",
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/heartbeat/, ""),
        },
        "/rest": {
          target: "https://dev.muikkuverkko.fi:8443/rest",
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/rest/, ""),
        },
        "/scripts": {
          target: "https://dev.muikkuverkko.fi:8443/scripts",
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/scripts/, ""),
        },
        "/login": {
          target: "https://dev.muikkuverkko.fi:8443/login",
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/login/, ""),
        },
        "/logout": {
          target: "https://dev.muikkuverkko.fi:8443/logout",
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/logout/, ""),
        },
        "/sounds": {
          target: "https://dev.muikkuverkko.fi:8443/sounds",
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/sounds/, ""),
        },
        "/ws": {
          target: "wss://dev.muikkuverkko.fi",
          changeOrigin: true,
          ws: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/ws/, "/ws"),
        },
      },
    },
  };
});
