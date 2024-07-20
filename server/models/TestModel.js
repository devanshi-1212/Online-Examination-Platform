const mongoose = require("mongoose");

const testSchema = new mongoose.Schema({
  testID: {
    type: String,
    required: true,
  },

  createdBy: {
    type: String,
    required: true,
  },

  testName: {
    type: String,
    required: true,
  },

  testDuration: {
    type: String,
    required: true,
  },

  questions: {
    type: [Object],
    required: true,
  },

  anskey: {
    type: String,
    required: true,
  },

  tookBy: {
    type: [String],
    required: true,
  },

  security: {
    type: [Boolean],
    required: true,
  },
});

const testModel = mongoose.model("Test", testSchema);
module.exports = testModel;
