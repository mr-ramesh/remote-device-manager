const express = require("express");
const router = express.Router();
const DeviceRepository = require("../repository/das/DeviceRepository");
const repository = new DeviceRepository();

const response = require("../constants/response");
const common = require("../constants/common");

let errMessage = "";

router.get("/poll", (req, res) => {
  res.send("Device is up and running");
});

router.get(["/manager", "/manager/*"], (req, res) => {
  res.render(req.url.substring(1));
});

router.post("/create", async (req, res) => {
  let allDevices = getValidDevices(req.body.devices);
  if (allDevices.validDevices.length > 0) {
    await repository
      .createDevice(req.user, allDevices)
      .then((resp) => res.status(200).json(resp))
      .catch((err) =>res.status(err.code).json(err));
  } else {
    let resp = response.BAD_REQUEST;
    resp.message = errMessage;
    res.status(resp.code).json(resp);
  }
});

router.post("/share", async (req, res) => {
  let { userId: userId, deviceId: deviceId } = req.body;
  let device = req.user.devices.filter((dev) => dev.device_id === deviceId)[0];
  if (device) {
    await repository
      .shareDevice(userId, device)
      .then((resp) => res.status(200).json(resp))
      .catch((err) =>res.status(err.code).json(err));
  } else {
    res.status(401).json(response.UN_AUTHORIZED);
  }
});

router.get("/read", async (req, res) => {
  let requestData = {};
  if (req.query.deviceName) requestData.name = req.query.deviceName;
  if (req.query.type) requestData.devType = req.query.type;
  if (req.query.state) requestData.currentState = +req.query.state;
  if (req.query.id) requestData.device_id = req.query.id;
  await repository
    .getDevices(req.user, requestData)
    .then((resp) => {
      res.status(200).json(resp);
    })
    .catch((err) =>res.status(err.code).json(err));
});

router.put("/edit", async (req, res) => {
  let requestData = {};
  if (req.query.deviceName) requestData.name = req.query.deviceName;
  if (req.query.deviceId) requestData.device_id = req.query.id;
  let device = validateDevice(device);
  if (device) {
    await repository
      .update(requestData, req.body)
      .then((resp) => res.status(200).json(resp))
      .catch((err) =>res.status(err.code).json(err));
  } else {
    let resp = response.BAD_REQUEST;
    resp.message = "Invalid device data!";
    res.status(resp.code).json(resp);
  }
});

router.put("/currentState", async (req, res) => {
  let requestData = {};
  let deviceName = req.query.deviceName;
  let deviceId = req.query.id;
  let deviceStatus = +req.query.state;
  if (deviceName) requestData.name = deviceName;
  if (deviceId) requestData.device_id = deviceId;
  let userHavesPermission = req.user.devices.includes(deviceId);
  if (!userHavesPermission) {
    res.status(401).json(response.UN_AUTHORIZED);
  } else {
    await repository
      .updateDevice(requestData, { currentState: deviceStatus })
      .then((resp) => res.status(200).json(resp))
      .catch((err) =>res.status(err.code).json(err));
  }
});

router.delete("/delete", async (req, res) => {
  let deviceId = req.query.id;
  if (deviceId) {
    let currentDevice = req.user.devices.filter((dev) => dev.device_id === deviceId)[0];
    if (currentDevice) {
      await repository
        .delete(deviceId)
        .then((resp) => res.status(200).json(resp))
        .catch((err) => res.status(err.code).json(err));
    } else {
      res.status(401).json(response.UN_AUTHORIZED);
    }
  } else {
    let resp = response.BAD_REQUEST;
    resp.message = "Device id required!";
    res.status(resp.code).json(resp);
  }
});

router.get("*", (req, res) => {
  res.render("error");
});

function getValidDevices(devices) {
  let response = {};
  let validDevices = [];
  let validDeviceIds = [];
  let invalidDevices = [];

  devices.forEach((device) => {
    let currentDevice = validateDevice(device);
    if (currentDevice) {
      validDevices.push(currentDevice);
      validDeviceIds.push(currentDevice.device_id);
    } else {
      invalidDevices.push(device);
    }
  });

  response.validDevices = validDevices;
  response.validDeviceIds = validDeviceIds;
  response.invalidDevices = invalidDevices;
  return response;
}

function validateDevice(device) {
  let currentDevice = {};
  let dName = device.name;
  let dState = +device.currentState;
  let dType = device.devType ? device.devType.toUpperCase() : null;

  let valid = true;

  if (!dName) {
    valid = false;
    errMessage = common.INVALID_DEVICE_NAME;
  }
  if (!(dState === 0 || dState === 1)) {
    valid = false;
    errMessage = common.INVALID_DEVICE_STATE;
  }
  if (!common.AVIALABLE_DEVICE_TYPES.includes(dType)) {
    valid = false;
    errMessage = common.INVALID_DEVICE_TYPE;
  }
  if (valid) {
    currentDevice.device_id = Math.random().toString(36).substring(2);
    currentDevice.name = dName;
    currentDevice.devType = dType;
    currentDevice.currentState = dState;
    currentDevice.lastUpdated = new Date();
    return currentDevice;
  }
  return valid;
}

module.exports = router;
