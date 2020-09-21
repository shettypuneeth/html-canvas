const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const getWebpackConfig = (options) => {
  const withWorkspacePrefix = (value) => `${options.name}/${value}`;

  return {
    mode: "development",
    context: path.resolve(__dirname, "projects"),
    devtool: "inline-source-map",
    entry: {
      [options.entry.name]: withWorkspacePrefix(options.entry.path),
    },
    plugins: [
      new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
      new HtmlWebpackPlugin({
        title: options.title,
        template: withWorkspacePrefix(options.htmlTemplatePath || "index.html"),
      }),
    ],
    output: {
      path: path.resolve(__dirname, "dist"),
      publicPath: "/",
    },
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
          },
        },
      ],
    },
  };
};

module.exports = getWebpackConfig;
