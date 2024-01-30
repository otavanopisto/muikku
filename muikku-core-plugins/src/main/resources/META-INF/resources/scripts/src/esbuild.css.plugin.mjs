/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line no-undef
const path = require("path");

module.exports = {
  name: "css",
  setup(build) {
    // Redirect all paths css or scss
    build.onResolve({ filter: /.\.s[ac]ss$/ }, (args) => {
      const path1 = args.resolveDir.replace("src", "");
      return { path: path.join(path1, args.path) };
    });
  },
};
