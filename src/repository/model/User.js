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
  },
  lastLogin: {
    type: Date,
  }
});

mongoose.model('User', UserSchema);
