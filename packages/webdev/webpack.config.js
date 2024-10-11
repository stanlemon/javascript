import path from "path";
import { existsSync } from "fs";
import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import { config } from "dotenv";
import babelOptions from "./.babelrc.json" assert { type: "json" };

config();

function getWebdevEntry() {
  if (process.env.WEBDEV_ENTRY) {
    return process.env.WEBDEV_ENTRY;
  } else if (existsSync("./src/index.tsx")) {
    return "./src/index.tsx";
  } else if (existsSync("./src/index.ts")) {
    return "./src/index.ts";
  } else {
    return "./src/index.js";
  }
}

// Entry points, which can be separated by a semi-colon
const WEBDEV_ENTRY = getWebdevEntry();
// HTML pages to create, which can be separated by a semi-colon
// If you prefix a page with a ! it will disable script injection
// The filename from the supplied path is used as the filename of the resulting file
const WEBDEV_HTML = process.env.WEBDEV_HTML ?? "./index.html";
// Proxy path's can be designated as path@host, separated by semi-colons
// For example /api@http://localhost:3000;/auth@http://localhost:4000
const WEBDEV_PROXY = process.env.WEBDEV_PROXY ?? "";
const WEBPACK_PUBLIC_PATH = process.env.WEBPACK_PUBLIC_PATH ?? "/";
const NODE_ENV = process.env.NODE_ENV ?? "development";

const proxy = WEBDEV_PROXY.split(";")
  .map((entry) => {
    if (entry.indexOf("@") === -1) {
      return null;
    }
    const path = entry.substring(0, entry.indexOf("@"));
    const host = entry.substring(entry.indexOf("@") + 1);

    return { context: [path], target: host };
  })
  // Remove any nulls
  .filter((e) => e !== null);

const isDevelopment = NODE_ENV !== "production";

export default {
  mode: isDevelopment ? "development" : "production",
  entry: WEBDEV_ENTRY.split(";"),
  output: {
    clean: true,
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
      ...WEBDEV_HTML.split(";").map((html) => {
        let inject = true;
        if (html.substring(0, 1) === "!") {
          html = html.substring(1);
          inject = false;
        }

        return new HtmlWebpackPlugin({
          filename: path.basename(html),
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
  ],
};
