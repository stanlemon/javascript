const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const couchdbUrl = process.env.COUCHDB_URL
  ? process.env.COUCHDB_URL
  : "http://localhost:5984/";

module.exports = {
  mode: "development",
  entry: ["./src/index.tsx", "react-hot-loader/patch"],
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
  },
  devtool:
    process.env.NODE_ENV === "production" ? "source-map" : "eval-source-map",
  devServer: {
    hot: true,
    historyApiFallback: true,
    proxy: {
      "/couchdb": {
        target: couchdbUrl,
        pathRewrite: {
          "^/couchdb": "",
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.([j|t]s)x?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
        loader: "url-loader",
      },
    ],
  },
  resolve: {
    // Enable webpack to find files without these extensions
    extensions: [".tsx", ".ts", ".jsx", ".js"],
    alias: {
      "react-dom": "@hot-loader/react-dom",
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "index.html"),
    }),
    new webpack.DefinePlugin({
      // This should match the hostname and port of webpack, if it doesn't, fix it!
      "process.env.REMOTE_DB_URL": JSON.stringify(
        "http://localhost:8080/couchdb/"
      ),
    }),
  ],
};
