const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const path = require("path");

const getWebpackConfig = require("./webpack.config");

const port = 3000;

module.exports = (projectConfig) => {
  const webpackConfig = getWebpackConfig(projectConfig);

  const options = {
    publicPath: webpackConfig.output.publicPath,
    contentBase: path.join(__dirname, `projects/${projectConfig}/assets`),
    hot: true,
    inline: true,
    stats: { colors: true },
  };

  const server = new WebpackDevServer(webpack(webpackConfig), options);

  server.listen(port, "localhost", function (err) {
    if (err) {
      console.log(err);
    }
    console.log("WebpackDevServer listening at localhost:", port);
  });
};
