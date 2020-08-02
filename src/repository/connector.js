const mongoose = require("mongoose");

class Connector {
  constructor({
    name: name = "admin",
    host: host = "localhost",
    port: port = 27017,
    user: user = "",
    pass: pass = "",
  } = config) {
    let cred = user && pass ? `${user}:${pass}@` : "";
    this.dbPath = `mongodb://${cred}${host}:${port}/${name}`;
  }

  getConnection() {
    this.connection = mongoose.connect(this.dbPath, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    mongoose.set("useFindAndModify", false);
    return this.connection;
  }
}

module.exports = Connector;
