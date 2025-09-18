import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Match your esbuild output structure
    outDir: "../dist",
    assetsDir: "assets",

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
        assetFileNames: "[name]-[hash].[ext]",
      },

      external: ["/gfx/*", "/sounds/*"],
    },
  },
});
