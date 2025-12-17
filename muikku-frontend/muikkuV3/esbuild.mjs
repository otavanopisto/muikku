import path from "path";
import { fileURLToPath } from "url";
import { build as _build } from "esbuild";
import { readFileSync } from "fs";
import { emptyDirSync } from "fs-extra";
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
      name: "clean-dist",
      setup(build) {
        // onStart is called whenever the build process starts
        build.onStart(() => {
          const outdir = build.initialOptions.outdir;
          if (outdir) {
            try {
              emptyDirSync(outdir);
              console.log(`Cleaned output directory: ${outdir}`);
            } catch (e) {
              console.error("Cleaning output directory failed", e);
            }
          }
        });
      },
    },
    {
      name: "css",
      setup(build) {
        // Redirect all paths css or scss
        build.onResolve({ filter: /.\.s[ac]ss$/ }, (args) => {
          // If path starts with ~/, resolve it relative to muikkuV3 directory
          if (args.path.startsWith("~/")) {
            // Get the directory where esbuild.mjs is located (muikkuV3)
            const muikkuV3Dir = path.dirname(fileURLToPath(import.meta.url));
            // Remove the ~/ prefix and resolve the path
            const relativePath = args.path.replace(/^~\//, "");
            const resolvedPath = path.join(muikkuV3Dir, relativePath);
            return { path: resolvedPath };
          }
          // If not a ~/ path, let esbuild resolve it normally
          return undefined;
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
