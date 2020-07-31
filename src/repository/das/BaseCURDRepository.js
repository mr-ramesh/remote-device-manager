const DeviceModel = require("../model/Device");
const responseConstants = require("../../constants/response");

class BaseCURDRepository {
  constructor() {
    this.model = new DeviceModel();
  }

  create(data) {
    return new Promise((resolve, reject) => {
      try {
        this.model.device_id = Math.random() * 10;
        this.model.name = data.name;
        this.model.devType = data.devType;
        this.model.currentState = data.currentState;
        this.model.lastUpdated = new Date();
        this.model.save();
        resolve(responseConstants.SUCCESS);
      } catch (error) {
        console.error("Unable to create device: ", error);
        reject(responseConstants.SERVER_ERROR);
      }
    });
  }

  share(userId, deviceId) {
    return new Promise((resolve, reject) => {});
  }

  read(dataFlag) {
    return new Promise((resolve, reject) => {
        DeviceModel.find(dataFlag, (err, devices) => {
            if(err) reject(responseConstants.SERVER_ERROR);
            this.devices = devices.toJSON({ getters: true });
            resolve(responseConstants.SUCCESS);
        })
    });
  }

  update(dataFlag, dataToBeUpdated) {
    return new Promise((resolve, reject) => {});
  }

  updateDeviceState(dataFlag, newState) {
    return new Promise((resolve, reject) => {});
  }

  delete(id) {
    return new Promise((resolve, reject) => {});
  }
}

module.exports = BaseCURDRepository;
