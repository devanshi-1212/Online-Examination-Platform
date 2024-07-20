const express = require("express");
const connectDB = require("./db.js");
const TestModel = require("./models/TestModel.js");
const bodyParser = require("body-parser");
const cors = require("cors");
const {
  signupValidation,
  loginValidation,
} = require("./middlewares/AuthValidation.js");
const { signup, login } = require("./controllers/AuthController.js");
const path = require("path");

require("dotenv").config();

const app = express();

const _dirname = path.dirname("");
const buildpath = path.join(_dirname, "../client/build");
app.use(express.static(buildpath));

// cors is used to accept requests coming from other ports.
// backend is at port 500 but frontend 3000 se requrest bhejra,
// uske lie we need cors
app.use(express.json());
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

connectDB();

app.post("/login", loginValidation, login);
app.post("/signup", signupValidation, signup);

app.post("/createtest", (req, res) => {
  TestModel.create(req.body)
    .then((test) => {
      res.json(test);
      console.log(test);
      alert("Test created successfully!!");
    })
    .catch((err) => console.log(err));
});

app.get("/taketest", async (req, res) => {
  const code = req.query.code;

  try {
    const test = await TestModel.findOne({ testID: code });
    if (test) {
      console.log("Test found.");
      res.json(test);
    } else {
      console.log("Test not found.");
      res.status(404).json({ message: "Test not found" });
    }
  } catch (error) {
    console.error("Error fetching test:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/findcreatedtests", async (req, res) => {
  const user = req.query.user;

  try {
    const test = await TestModel.find({ createdBy: user });
    if (test) {
      console.log("Created tests found.");
      res.json(test);
    } else {
      console.log("No tests created by user.");
      res.status(404).json({ message: "No tests created by user." });
    }
  } catch (error) {
    console.error("Error fetching test:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/findtakentests", async (req, res) => {
  const user = req.query.user;

  try {
    const takenTests = await TestModel.find({
      tookBy: { $elemMatch: { $regex: new RegExp(`^${user}/`) } },
    });

    if (!takenTests.length) {
      return res.json({ message: "No tests taken by this user." });
    }

    console.log("Taken tests found.");
    res.json(takenTests);
  } catch (error) {
    console.error("Error fetching test:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/submittest", async (req, res) => {
  const code = req.query.code;

  try {
    const test = await TestModel.findOne({ testID: code });
    res.json(test.anskey);
  } catch (error) {
    console.error("Error fetching test:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/submittest", async (req, res) => {
  try {
    const testid = req.body.testid;
    const user = req.body.val;

    const testEntry = await TestModel.findOne({ testID: testid });

    testEntry.tookBy.push(user);
    await testEntry.save();

    console.log("Test entry updated successfully!");
    res.json("Taken user inserted.");
  } catch (err) {
    console.log(err);
  }
});

app.listen(5000, () => {
  console.log("Connected to backend on port 5000.");
});
