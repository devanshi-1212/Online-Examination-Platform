const bcrypt = require("bcryptjs");
const UserModel = require("../models/UserModel");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (user) {
      return res.status(409).json({
        message: "User already exists. Kindly Login.",
        success: false,
      });
    }

    const userModel = new UserModel({ name, email, password });

    userModel.password = await bcrypt.hash(password, 10);
    await userModel.save();
    res.status(201).json({ message: "Signup Successful.", success: true });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(403).json({
        message: "Auth failed. Email or password wrong.",
        success: false,
      });
    }

    const isPassEqual = await bcrypt.compare(password, user.password);

    if (!isPassEqual) {
      return res.status(403).json({
        message: "Auth failed. Email or password wrong.",
        success: false,
      });
    }

    const jwtToken = jwt.sign(
      { email: user.email, _id: user._id },
      'secret-1234',
      { expiresIn: "24h" }
    );

    res.status(200).json({
      message: "Login Successfully.",
      success: true,
      jwtToken,
      email,
      name: user.name,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

module.exports = { signup, login };
