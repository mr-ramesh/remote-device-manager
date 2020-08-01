const express = require("express");
const app = express();
const expressHandleBars = require("express-handlebars");
const cookieParser = require('cookie-parser');
module.exports = {
  init(config) {
    this.config = config;
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    this.startServer();
    app.get("/", (req, res) => {
      res.render("home");
    });
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
    if (routePath) app.use(routePath, routes);
    else app.use(routes);
  },

  addView(path) {
    app.set("views", path);
    app.engine(
      "hbs",
      expressHandleBars({
        extname: "hbs",
      })
    );
    app.set("view engine", "hbs");
  },

  finalizeServer() {
    app.get("*", (req, res) => {
      res.render("error");
    });
  },
};
