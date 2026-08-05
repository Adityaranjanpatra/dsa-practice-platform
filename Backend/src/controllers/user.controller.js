const redisClient = require("../config/redis");
const Submission = require("../models/submission.model");
const User = require("../models/user.model");
const Problem = require("../models/problem.model");
const validate = require("../utils/validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    validate(req.body);
    const { firstName, emailId, password } = req.body;
    if (await User.exists({ emailId })) {
      throw new Error("User already exists");
    }
    req.body.password = await bcrypt.hash(password, 10);
    req.body.role = "user";
    const user = await User.create(req.body);
    const token = jwt.sign(
      { _id: user._id, emailId: emailId },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );
    res.cookie("token", token, { maxAge: 60 * 60 * 1000 });
    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        firstName: user.firstName,
        emailId: user.emailId,
      },
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!emailId) {
      throw new Error("Invalid Credentials");
    }
    if (!password) throw new Error("Invalid Credentials");

    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new Error("Invalid Credentials");
    }
    const token = jwt.sign(
      { _id: user._id, emailId: emailId },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );
    res.cookie("token", token, { maxAge: 60 * 60 * 1000 });
    res.status(200).json({
      message: `Welcome back, ${user.firstName}!`,
      user: {
        _id: user._id,
        firstName: user.firstName,
        emailId: user.emailId,
      },
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

const logout = async (req, res) => {
  try {
    const { token } = req.cookies;
    const payload = jwt.decode(token);

    await redisClient.set(`token:${token}`, "Blocked");
    await redisClient.expireAt(`token:${token}`, payload.exp);
    res.clearCookie("token");
    res.send("Logged out successfully");
  } catch (err) {
    res.status(503).json({
      message: err.message,
    });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const { _id } = req.result;
    await req.result.deleteOne();
    await Submission.deleteMany({ userId: _id });
    res.clearCookie("token");
    res.status(200).json({
      message: "Account deleted successfully",
    });
  } catch (err) {
    res.status(503).json({
      message: err.message,
    });
  }
};

const getSolvedProblems = async (req, res) => {
  try {
    const Solved = await req.result.populate({
      path: "problemSolved",
      select: "_id title difficulty tags",
    });
    res.status(200).json({
      Solved: Solved.problemSolved,
    });
  } catch (err) {
    res.status(503).json({
      message: err.message,
    });
  }
};

module.exports = { register, login, logout, deleteAccount, getSolvedProblems };
