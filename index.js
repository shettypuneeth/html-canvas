const startDevServer = require("./webpack-dev-server");

const options = {
  name: "watch-face",
  title: "watch-face",
  entry: {
    name: "watch-face",
    path: "index.js",
  },
};

startDevServer(options);
