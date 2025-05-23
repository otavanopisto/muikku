import path from "path";
import { build as _build } from "esbuild";
import { readFileSync } from "fs";
import { sassPlugin } from "esbuild-sass-plugin";
import { TsconfigPathsPlugin } from "@esbuild-plugins/tsconfig-paths";
import moment from "moment";

// the tsconfig to use in here will be slightly modified the reason is that we want
// to affect the typescript compiler not to import from nodejs folders
const tsConfig = JSON.parse(readFileSync("tsconfig.json", "utf-8"));
delete tsConfig.compilerOptions.paths;

// process to build
const build = _build({
  logLevel: "info",
  bundle: true,
  splitting: true,
  minify: process.env.NODE_ENV === "production",
  sourcemap: process.env.NODE_ENV !== "production",
  define: {
    "process.env.NODE_ENV": JSON.stringify(
      process.env.NODE_ENV || "development"
    ),
  },
  entryPoints: ["./entries/root.tsx", "./entries/polyfill-mediarecorder.ts"],
  format: "esm",
  entryNames: "[name]",
  outdir: path.resolve(path.join("../dist")),
  publicPath: "../dist",
  external: ["/gfx/*", "/sounds/*"],
  loader: {
    ".png": "dataurl",
    ".jpg": "dataurl",
    ".svg": "text",
    ".css": "css",
    ".ts": "ts",
    ".tsx": "tsx",
    ".woff": "dataurl",
    ".woff2": "dataurl",
    ".eot": "dataurl",
    ".ttf": "dataurl",
    ".wav": "dataurl",
  },
  // commons file name
  chunkNames: "commons-[hash]",
  // modified tsconfig
  tsconfigRaw: JSON.stringify({ tsConfig }),
  plugins: [
    {
      name: "css",
      setup(build) {
        // Redirect all paths css or scss
        build.onResolve({ filter: /.\.s[ac]ss$/ }, (args) => {
          const path1 = args.resolveDir.split("src");

          const realPath = `${path1[0]}src${path1[1]}src`;
          const realPath2 = args.path.split("~")[1];

          return { path: path.join(realPath, realPath2) };
        });
      },
    },
    sassPlugin(),
    TsconfigPathsPlugin({ tsconfig: "tsconfig.json" }),
  ],
});

// first let's build the service worker
build
  .then(() => {
    console.log("DONE", moment().format("YYYY-MM-DD HH:mm:ss"));
  })
  .catch((err) => console.error(err.stack));
