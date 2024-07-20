const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    retuired: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },
});

const userModel = mongoose.model("Users", userSchema);
module.exports = userModel;
