const DeviceModel = require("../model/Device");
const responseConstants = require("../../constants/response");
const BaseCURDRepository = require("./BaseCURDRepository");
const BaseSecurityRepository = require("./BaseSecurityRepository");

class DeviceRepository {
  constructor() {
    this.curdRepository = new BaseCURDRepository(DeviceModel);
  }

  createDevice(devices) {
    return new Promise(async (resolve, reject) => {
      try {
        let deviceModels = [];
        devices.forEach((device) => {
          let deviceModel = new DeviceModel();
          deviceModel.device_id = Math.random().toString(36).substring(2);
          deviceModel.name = device.name;
          deviceModel.devType = device.devType;
          deviceModel.currentState = device.currentState;
          deviceModel.lastUpdated = new Date();
          deviceModels.push(deviceModel);
        });
        await this.curdRepository.create(deviceModels).then((resp) => {
          resp.message = "Device Created Successfully!";
          resolve(resp);
        });
      } catch (error) {
        let errResponse = responseConstants.SERVER_ERROR;
        errResponse.message = "Unable to create device!";
        console.error(errResponse.message, error);
        reject(errResponse);
      }
    });
  }

  shareDevice(userId, deviceId) {
    return new Promise(async (resolve, reject) => {
      await this.curdRepository
        .update({ user_id: userId }, { devices: [deviceId] })
        .then((resp) => resolve(resp))
        .catch((err) => reject(err));
    });
  }

  getDevices(filter) {
    return new Promise(async (resolve, reject) => {
      await this.curdRepository
        .read(filter)
        .then((resp) => resolve(resp))
        .catch((err) => reject(err));
    });
  }

  updateDevice(filter, dataToBeUpdated) {
    return new Promise(async (resolve, reject) => {
      await this.curdRepository
        .update(filter, dataToBeUpdated)
        .then((resp) => resolve(resp))
        .catch((err) => reject(err));
    });
  }

  delete(id) {
    return new Promise(async (resolve, reject) => {
      await this.curdRepository
        .delete({device_id: id})
        .then((resp) => resolve(resp))
        .catch((err) => reject(err));
    });
  }
}

module.exports = DeviceRepository;
