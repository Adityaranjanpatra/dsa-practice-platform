const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validate = require("../utils/validator");
const User = require("../models/user.model");
const Submission = require("../models/submission.model");


const adminRegister = async (req, res) => {
  try {
    validate(req.body);
    const { firstName, emailId, password, role } = req.body;

    if (!firstName || !emailId || !password || !role) {
      throw new Error("Missing required fields");
    }
    if (await User.exists({ emailId })) {
      throw new Error("User already exists");
    }
    req.body.password = await bcrypt.hash(password, 10);

    const user = await User.create(req.body);
    res.status(201).send(`${role} registered successfully`);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
};

const adminLogin = async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!emailId) {
      throw new Error("Invalid Credentials");
    }
    if (!password) throw new Error("Invalid Credentials");

    const user = await User.findOne({ emailId });
    if(!user || user.role !== "admin") {
      throw new Error("Invalid Credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new Error("Invalid Credentials");
    }
    const token = jwt.sign(
      { _id: user._id, emailId: emailId, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );
    res.cookie("token", token, { maxAge: 60 * 60 * 1000 });
    res.status(200).send(`${user.role} logged in successfully`);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
};



module.exports = {
  adminRegister,
  adminLogin,
};