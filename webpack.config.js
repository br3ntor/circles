const path = require("path");
const { resolve } = require("path");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  devServer: {
    contentBase: resolve(__dirname, "dist"),
  },
  devtool: "inline-source-map",
  output: {
    filename: "main.js",
    path: resolve(__dirname, "dist"),
  },
};
