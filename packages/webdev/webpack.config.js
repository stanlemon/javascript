const path = require("path");
const { existsSync } = require("fs");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { config } = require("dotenv");

config();

const babelOptions = require("./.babelrc.json");

// Entry points, which can be separated by a semi-colon
const WEBDEV_ENTRY = process.env.WEBDEV_ENTRY ?? "./src/index.tsx";
// HTML pages to create, which can be separated by a semi-colon
// If you prefix a page with a ! it will disable script injection
// The filename from the supplied path is used as the filename of the resulting file
const WEBDEV_HTML = process.env.WEBDEV_HTML ?? "./index.html";
// Proxy path's can be designated as path@host, separated by semi-colons
// For example /api@http://localhost:3000;/auth@http://localhost:4000
const WEBDEV_PROXY = process.env.WEBDEV_PROXY ?? "";
const WEBPACK_PUBLIC_PATH = process.env.WEBPACK_PUBLIC_PATH ?? "/";
const NODE_ENV = process.env.NODE_ENV ?? "development";

const proxy = {};
WEBDEV_PROXY.split(";").forEach((entry) => {
  if (entry.indexOf("@") === -1) {
    return;
  }
  const path = entry.substring(0, entry.indexOf("@"));
  const host = entry.substring(entry.indexOf("@") + 1);
  proxy[path] = host;
});

const isDevelopment = NODE_ENV !== "production";

module.exports = {
  mode: isDevelopment ? "development" : "production",
  entry: WEBDEV_ENTRY.split(";"),
  output: {
    filename: "static/[name].[contenthash].js",
    path: path.resolve("./", "dist"),
    publicPath: WEBPACK_PUBLIC_PATH,
  },
  devtool: isDevelopment ? "eval-source-map" : "source-map",
  devServer: {
    hot: true,
    historyApiFallback: true,
    proxy,
  },
  optimization: {
    moduleIds: "deterministic",
    runtimeChunk: "single",
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        react: {
          test(module) {
            // `module.resource` contains the absolute path of the file on disk.
            return (
              module.resource && module.resource.includes("node_modules/react")
            );
          },
          chunks: "initial",
          filename: "static/react.[contenthash].js",
          priority: 1,
          maxInitialRequests: 2,
          minChunks: 1,
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
          filename: "static/vendors.[contenthash].js",
        },
      },
    },
  },
  performance: {
    hints: isDevelopment ? false : "warning",
  },
  module: {
    rules: [
      {
        test: /\.([j|t]s)x?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            ...babelOptions,
            plugins: [isDevelopment && "react-refresh/babel"].filter(Boolean),
          },
        },
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "less-loader"],
      },
      {
        test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
        type: "asset/resource",
      },
    ],
  },
  resolve: {
    // Enable webpack to find files without these extensions
    extensions: [".tsx", ".ts", ".jsx", ".js"],
    fullySpecified: false,
  },
  plugins: [
    ...[
      new CleanWebpackPlugin(),
      ...WEBDEV_HTML.split(";").map((html) => {
        let inject = true;
        if (html.substring(0, 1) === "!") {
          html = html.substring(1);
          inject = false;
        }

        return new HtmlWebpackPlugin({
          filename: path.resolve("./", "dist", html),
          inject,
          ...(existsSync(html) ? { template: html } : {}),
        });
      }),
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(NODE_ENV),
      }),
    ],
    ...[
      isDevelopment &&
        new BundleAnalyzerPlugin({
          analyzerMode: "static",
          openAnalyzer: false,
        }),
    ].filter(Boolean),
    ...[isDevelopment && new ReactRefreshWebpackPlugin()].filter(Boolean),
  ],
};
