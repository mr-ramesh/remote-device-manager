const express = require("express");
const router = express.Router();
const DeviceRepository = require("../repository/das/DeviceRepository");
const repository = new DeviceRepository();

const RDCException = require("../exception/RDCException");

router.get("/poll", (req, res) => {
  res.send("Device is up and running");
});

router.get(["/manager", "/manager/*"], (req, res) => {
  console.log("Call came here !")
  res.render(req.url.substring(1));
});

router.post("/create", async (req, res) => {
  await repository
    .createDevice(req.body)
    .then((resp) => (req.moduleResponse = resp))
    .catch((err) => {
      throw new RDCException(err);
    });
});

router.post("/share", (req, res) => {
  let { userId: userId, deviceId: deviceId } = req.body;
  deviceId = req.user.devices.filter((id) => id === deviceId)[0];
  if (deviceId) {
    repository
      .share(userId, deviceId)
      .then((resp) => (req.moduleResponse = resp))
      .catch((err) => {
        throw new RDCException(err);
      });
  }
});

router.get("/read", (req, res) => {
  let requestData = {};
  if (req.param.deviceName) requestData.name = req.param.deviceName;
  if (req.param.deviceType) requestData.devType = req.param.deviceName;
  if (req.param.deviceState) requestData.currentState = req.param.deviceName;
  repository
    .read(requestData)
    .then((resp) => {
      resp.data = repository.devices;
      req.moduleResponse = resp;
    })
    .catch((err) => {
      throw new RDCException(err);
    });
});

router.put("/edit", (req, res) => {
  let requestData = {};
  if (req.param.deviceName) requestData.name = req.param.deviceName;
  if (req.param.deviceId) requestData.device_id = req.param.deviceId;
  repository
    .update(requestData, req.body)
    .then((resp) => (req.moduleResponse = resp))
    .catch((err) => {
      throw new RDCException(err);
    });
});

router.put("/currentState", (req, res) => {
  let requestData = {};
  if (req.param.deviceName) requestData.name = req.param.deviceName;
  if (req.param.deviceId) requestData.device_id = req.param.deviceId;
  repository
    .updateDeviceState(requestData, req.deviceStatus)
    .then((resp) => (req.moduleResponse = resp))
    .catch((err) => {
      throw new RDCException(err);
    });
});

router.delete("/delete", async (req, res) => {
  let deviceId = req.param.deviceId;
  repository
    .delete(deviceId)
    .then((resp) => (req.moduleResponse = resp))
    .catch((err) => {
      throw new RDCException(err);
    });
});

router.get("*", (req, res) => {
  res.render("error");
});

module.exports = router;
