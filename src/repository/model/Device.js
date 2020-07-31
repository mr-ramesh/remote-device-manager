const mongoose = require("mongoose");
const DeviceSchema = new mongoose.Schema({
  device_id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  devType: {
    type: String,
    required: true,
  },
  currentState: {
    type: Boolean,
    required: true,
  },
  lastUpdated: {
    type: Date,
    required: true,
  },
});

const DeviceModel = mongoose.model("Device", DeviceSchema);

module.exports = DeviceModel;
