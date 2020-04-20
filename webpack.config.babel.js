import path from "path";
import webpack from "webpack";
// import marked from "marked";
// const renderer = new marked.Renderer();

import { WDS_PORT } from "./src/shared/config";
import { isProd } from "./src/shared/util";

export default {
  entry: ["react-hot-loader/patch", "./src/client"],
  output: {
    filename: "js/bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: isProd ? "/static/" : `http://localhost:${WDS_PORT}/dist/`,
  },
  module: {
    rules: [
      { test: /\.(js|jsx)$/, use: "babel-loader", exclude: /node_modules/ },
      {
        test: /\.md$/,
        use: [
          { loader: "raw-loader" },
          // { loader: "html-loader" },
          // { loader: "markdown-loader", options: { pedantic: true, renderer } },
        ],
      },
    ],
  },
  devtool: isProd ? false : "source-map",
  resolve: {
    extensions: [".js", ".jsx"],
  },
  devServer: {
    port: WDS_PORT,
    hot: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
};
