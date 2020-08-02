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
      await this.userRepository
        .updateUser({ user_id: userId }, { devices: [device] })
        .then((resp) => resolve(responseConstants.SUCCESS))
        .catch((err) => reject(err));
    });
  }

  getDevices(userId, deviceData) {
    return new Promise(async (resolve, reject) => {
      await this.userRepository.getDevice("devices",  deviceData)
        .then((devices) => {
          let device = {};
          if (devices && devices.length > 0) {
            device = user.devices.filter((dev) => (dev.device_id = deviceId));
          }
          resolve(device);
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
