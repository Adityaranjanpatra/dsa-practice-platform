const redisClient = require("../config/redis");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

const adminMiddleware = async (req, res, next) => {
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
    const result = await User.findById(_id);

    if (!result) {
      throw new Error("User not found");
    }
    if (result.role !== "admin") {
      throw new Error("Access denied. Admin privileges required.");
    }
    const isBlocked = await redisClient.exists(`token:${token}`);

    if (isBlocked) {
      throw new Error("User is blocked");
    }
    req.result = result;
    next();
  } catch (err) {
    res.status(401).json({
      message: err.message
    });
  }
};

module.exports = adminMiddleware;
