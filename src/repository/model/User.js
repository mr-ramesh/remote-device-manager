const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  devices: {
    type: Array,
  },
  registeredDate: {
    type: Date,
    required: true
  },
  lastLogin: {
    type: Date,
  }
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;