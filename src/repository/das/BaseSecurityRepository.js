const jwt = require("jsonwebtoken");

const UserModel = require("../model/User");
const responseConstants = require("../../constants/response");
const commonConstants = require("../../constants/common");

class BaseSecurityRepository {
  constructor() {
    this.user = new UserModel();
  }

  signup(email, password) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!await this.getUser({ email: email })) {
          this.user.user_id = Math.random().toString(36).substring(2);;
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
      await this.getUser({ email: email })
        .then((user) => {
          if(user) {
            if (user.password === password) {
              delete user.password;
              this.generateToken(user)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
            } else {
              reject(responseConstants.UN_AUTHORIZED);
            }
          } else {
            resolve(null);
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  getUser(userData) {
    return new Promise((resolve, reject) => {
      UserModel.findOne(userData, (err, user) => {
        if(err) reject(responseConstants.SERVER_ERROR);
        if (user) {
          console.log("User : ", user);
          resolve(user.toJSON({ getters: true }));
        }
        resolve(null);
      });
    });
  }

  generateToken(user) {
    return new Promise((resolve, reject) => {
      try {
        this.token = jwt.sign(user, commonConstants.ENCRYPT_KEY);
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
      jwt.verify(token, commonConstants.ENCRYPT_KEY, (err, user) => {
        if (err) {
          console.error("Unable to process this token: ", err);
          reject(responseConstants.UN_AUTHORIZED);
        }
        resolve(user);
      });
    });
  }
}

module.exports = BaseSecurityRepository;
