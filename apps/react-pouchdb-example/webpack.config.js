const config = require("@stanlemon/webdev/webpack.config.js");

config.devServer.proxy = {
  "/couchdb": {
    target: "http://localhost:5984/",
    pathRewrite: {
      "^/couchdb": "",
    },
  },
};

module.exports = config;
