const gulp = require("gulp");
const startDevServer = require("./webpack-dev-server");
const inquirer = require("inquirer");
const webpack = require("webpack");
const getWebpackConfig = require("./webpack.config");

const getProjectToRun = async () => {
  const { projectName } = await inquirer.prompt([
    {
      type: "checkbox",
      message: "Select the project to run",
      name: "projectName",
      choices: [
        {
          name: "watch-face",
        },
      ],
    },
  ]);

  const options = {
    name: projectName,
    title: projectName,
    entry: {
      name: projectName,
      path: "index.js",
    },
  };

  return options;
};

gulp.task("start-dev-server", async (done) => {
  const options = await getProjectToRun();

  startDevServer(options);
  done();
});

gulp.task("build", async (done) => {
  process.env.NODE_ENV = "production";
  const options = await getProjectToRun();
  const config = getWebpackConfig(options);

  const compiler = webpack(config);

  compiler.run((err) => {
    if (err) {
      console.log("Error", err);
    } else {
      done();
    }
  });
});

gulp.task("default", gulp.series(["start-dev-server"]));
