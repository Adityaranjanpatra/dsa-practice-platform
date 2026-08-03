const redisClient = require("../config/redis");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

const userMiddleware = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Token is not Present");
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = payload;
    if (!_id) {
      throw new Error("Invalid Token");
    }
    const isBlocked = await redisClient.exists(`token:${token}`);

    if (isBlocked) {
      throw new Error("User is blocked");
    }
    const result = await User.findById(_id);
    if (!result) {
      throw new Error("User not found");
    }
    req.result = result;
    next();
  } catch (err) {
    res.status(401).send("Error: " + err.message);
  }
};

module.exports = userMiddleware;
