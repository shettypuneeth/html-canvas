const gulp = require("gulp");
const startDevServer = require("./webpack-dev-server");
const inquirer = require("inquirer");

gulp.task("start-dev-server", async (cb) => {
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

  startDevServer(options);
  cb();
});

gulp.task("default", gulp.series(["start-dev-server"]));
