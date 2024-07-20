const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION);
    console.log("MongoDB Connected.");
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = connectDB;
