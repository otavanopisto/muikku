import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    define: {
      "process.env.NODE_ENV": JSON.stringify(env.NODE_ENV || "development"),
    },

    base: "/scripts/dist",

    // Add base path configuration
    build: {
      // Match your esbuild output structure
      outDir: "../dist",

      minify: env.NODE_ENV === "production" ? "esbuild" : false,
      sourcemap: env.NODE_ENV !== "production",

      assetsDir: "",

      // Inline small assets like your esbuild
      assetsInlineLimit: 4096, // 4kb limit for inlining

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
  };
});
