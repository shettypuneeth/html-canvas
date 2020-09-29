const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const getWebpackConfig = (options) => {
  const withWorkspacePrefix = (value) => `${options.name}/${value}`;
  const isProd = process.env.NODE_ENV === "production";

  return {
    mode: isProd ? "production" : "development",
    context: path.resolve(__dirname, "projects"),
    devtool: isProd ? undefined : "inline-source-map",
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
      filename: isProd ? "[name].bundle.[hash].js" : "[name].bundle.js",
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
