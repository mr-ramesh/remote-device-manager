const responseConstants = require("../../constants/response");
const UserRepository = require("./UserRepository");

class DeviceRepository {
  constructor() {
    this.userRepository = new UserRepository();
  }

  createDevice(user, devices) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.userRepository
          .updateUser(
            { user_id: user.user_id },
            { devices: devices.validDevices }
          )
          .then((resp) => {
            resp.message = "Device Created Successfully!";
            resolve(resp);
          })
          .catch((err) => reject(err));
      } catch (error) {
        let errResponse = responseConstants.SERVER_ERROR;
        errResponse.message = "Unable to create device!";
        console.error(errResponse.message, error);
        reject(errResponse);
      }
    });
  }

  shareDevice(userId, device) {
    return new Promise(async (resolve, reject) => {
      let userFilter = { user_id: userId };
      let newUser = await this.userRepository.getUser(userFilter);
      console.log("new USer : ", newUser);
      if(newUser.length > 0) {
        await this.userRepository
        .updateUser(userFilter, { devices: [device] })
        .then((resp) => resolve(responseConstants.SUCCESS))
        .catch((err) => reject(err));
      } else{
        let resp = responseConstants.FORBIDDEN;
        resp.message = "User not exists!";
        reject(resp);
      }
      
    });
  }

  getDevices(user, deviceData) {
    return new Promise(async (resolve, reject) => {
      await this.userRepository
        .getDevice(user.user_id)
        .then((users) => {
          if (users && users.length > 0) {
            let resultDevices = [];
            users[0].devices.forEach(device => {
              let flag = true;
              Object.keys(deviceData).forEach(field => {
                if(device[field] != deviceData[field]) {
                  flag = false;
                }
              });
              if(flag) resultDevices.push(device);
            });
            resolve(resultDevices);
          } else {
            let resp = responseConstants.SUCCESS;
            resp.message = "No device found!"
            resolve(resp);
          }
        })
        .catch((err) => reject(err));
    });
  }

  getAllDevices(filter) {
    return new Promise(async (resolve, reject) => {
      await this.userRepository
        .getUser({ user_id: userId })
        .then((user) => {
          if (user && user.devices) {
            resolve(user.devices);
          }
        })
        .catch((err) => reject(err));
    });
  }

  updateDevice(filter, dataToBeUpdated) {
    return new Promise(async (resolve, reject) => {
      await this.userRepository
        .update(filter, dataToBeUpdated)
        .then((resp) => resolve(responseConstants.SUCCESS))
        .catch((err) => reject(err));
    });
  }

  delete(id) {
    return new Promise(async (resolve, reject) => {
      await this.userRepository
        .delete({ device_id: id })
        .then((resp) => resolve(responseConstants.SUCCESS))
        .catch((err) => reject(err));
    });
  }
}

module.exports = DeviceRepository;
