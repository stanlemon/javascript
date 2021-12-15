import path from "path";
import { readFileSync } from "fs";
import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import { CleanWebpackPlugin } from "clean-webpack-plugin";

const babelOptions = JSON.parse(
  readFileSync(new URL("./.babelrc.json", import.meta.url))
);

const ENV = process.env.NODE_ENV ?? "development";

const isDevelopment = ENV !== "production";

export default {
  mode: isDevelopment ? "development" : "production",
  entry: ["./src/index.tsx"],
  output: {
    filename: "[name].[contenthash].js",
    path: path.resolve("./", "dist"),
  },
  devtool: isDevelopment ? "eval-source-map" : "source-map",
  devServer: {
    hot: true,
    historyApiFallback: true,
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
          filename: "react.[contenthash].js",
          priority: 1,
          maxInitialRequests: 2,
          minChunks: 1,
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
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
        loader: "url-loader",
      },
    ],
  },
  resolve: {
    // Enable webpack to find files without these extensions
    extensions: [".tsx", ".ts", ".jsx", ".js"],
  },
  plugins: [
    ...[
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: path.resolve("./", "index.html"),
      }),
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(ENV),
      }),
    ],
    ...[!isDevelopment && new BundleAnalyzerPlugin()].filter(Boolean),
    ...[isDevelopment && new ReactRefreshWebpackPlugin()].filter(Boolean),
  ],
};
