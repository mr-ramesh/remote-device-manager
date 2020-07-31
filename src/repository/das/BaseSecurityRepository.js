const fs = require("fs");
const privateKEY = fs.readFileSync("./environment/private.key", "utf8");
const publicKEY = fs.readFileSync("./environment/public.key", "utf8");

const jwt = require("jsonwebtoken");

const UserModel = require("../model/User");
const responseConstants = require("../../constants/response");

class BaseSecurityRepository {
  constructor() {
    this.user = new UserModel();
  }

  signup(email, password) {
    return new Promise((resolve, reject) => {
      try {
        if (!this.getUser(email)) {
          this.user.user_id = Math.random() * 10;
          this.user.email = email;
          this.user.password = password;
          this.user.registeredDate = new Date();
          this.user.save();
          console.info("User created successfully!");
          resolve(responseConstants.SUCCESS);
        }
        reject(responseConstants.USER_EXISTS);
      } catch (error) {
        console.error("Unable to create user: ", error);
        reject(responseConstants.SERVER_ERROR);
      }
    });
  }

  login(email, password) {
    //change to get only username pass
    return new Promise(async (resolve, reject) => {
      let user = await this.getUser(email);
      if (user.password === password) {
        delete user.password;
        this.generateToken(user)
          .then((res) => resolve(res))
          .catch((err) => reject(err));
      } else {
        reject(responseConstants.UN_AUTHORIZED);
      }
    });
  }

  getUser(email) {
    return new Promise((resolve, reject) => {
      UserModel.findOne({ email: email }, (err, user) => {
        if (err) reject(null);
        user = user.toJSON({ getters: true });
        resolve(user);
      });
    });
  }

  generateToken(user) {
    return new Promise((resolve, reject) => {
      try {
        this.token = jwt.sign(user, privateKEY);
        console.info("User loggedin successfully!");
        resolve(responseConstants.SUCCESS);
      } catch (error) {
        console.error("Unable to generate the token: ", error);
        reject(responseConstants.SERVER_ERROR);
      }
    });
  }

  validateToken(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, publicKEY, (err, user) => {
        if (err) reject(responseConstants.UN_AUTHORIZED);
        resolve(responseConstants.SUCCESS);
      });
    });
  }
}

module.exports = BaseSecurityRepository;
