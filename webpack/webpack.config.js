const path = require("path");

module.exports = {
  entry: './src/js/script.js',
  output: {
    filename: "script.js",
    path: path.resolve(__dirname, "build")
  },
  mode: "development",
  devtool: "source-map",
  experiments: {
    topLevelAwait: true,
  },
  devServer: {
    contentBase: path.resolve(__dirname, "build"),
    watchContentBase: true,
  },
};