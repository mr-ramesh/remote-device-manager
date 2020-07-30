const express = require("express");
const app = express();

module.exports = {
  init(config) {
    this.config = config;
    app.use(express.json());
    app.use(express.urlencoded({ extended: false}));
    this.startServer();
    return this;
  },

  startServer() {
    try {
      app.listen(this.config.server.port, () =>
        console.log(
          `Server started with port  ${this.config.server.port} up and running...`
        )
      );
    } catch (error) {
      console.error(`Unable to start the server, error: ${error}`);
    }
    return this;
  },

  addRoutes(routePath, routes) {
    if(routePath) app.use(routePath, routes);
    else app.use(routes);
  },
};
