const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://devanshi:g3Qtb3Homq7FEe3o@cluster0.qqctptx.mongodb.net/testdb?retryWrites=true&w=majority&appName=Cluster0");
    console.log("MongoDB Connected.");
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = connectDB;
