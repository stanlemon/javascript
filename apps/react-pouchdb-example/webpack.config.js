import config from "@stanlemon/webdev/webpack.config.js";

export default {
  ...config,
  devServer: {
    ...config.devServer,
    proxy: [
      {
        context: ["/couchdb"],
        target: "http://localhost:5984/",
        pathRewrite: {
          "^/couchdb": "",
        },
      },
    ],
  },
};
