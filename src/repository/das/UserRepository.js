const UserModel = require("../model/User");
const responseConstants = require("../../constants/response");
const BaseCURDRepository = require("./BaseCURDRepository");

class UserRepository {
  constructor() {
    this.curdRepository = new BaseCURDRepository(UserModel);
  }

  getUser(filter) {
    return new Promise(async (resolve, reject) => {
      await this.curdRepository
        .read(filter)
        .then((resp) => resolve(resp))
        .catch((err) => reject(err));
    });
  }

  getDevice(filterField, filterData) {
    return new Promise(async (resolve, reject) => {
      let query = {};
      query[filterField] = {"$elemMatch": filterData};
      await this.curdRepository
        .read(query)
        .then((resp) => resolve(resp))
        .catch((err) => reject(err));
    });
  }

  updateUser(filter, dataToBeUpdated) {
    let updateData = { $addToSet: dataToBeUpdated };
    return new Promise(async (resolve, reject) => {
      await this.curdRepository
        .update(filter, updateData)
        .then((resp) => resolve(resp))
        .catch((err) => reject(err));
    });
  }

  deleteUser(id) {
    return new Promise(async (resolve, reject) => {
      await this.curdRepository
        .delete({ device_id: id })
        .then((resp) => resolve(resp))
        .catch((err) => reject(err));
    });
  }
}

module.exports = UserRepository;
