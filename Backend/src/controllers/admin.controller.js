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





module.exports = {
  adminRegister
};