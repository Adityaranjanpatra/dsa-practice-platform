const express = require("express");
const {
  register,
  login,
  logout,
  deleteAccount,
  getSolvedProblems,
} = require("../controllers/user.controller");
const userMiddleware = require("../middleware/user.middleware");
const userRouter = express.Router();


userRouter.get('/checkauth', userMiddleware, (req, res) => {
  res.status(200).json({ user: {
    _id: req.result._id,
    firstName: req.result.firstName,
    emailId: req.result.emailId
  } });
});
userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.post("/logout", userMiddleware, logout);
userRouter.delete("/delete", userMiddleware, deleteAccount);
userRouter.get("/solvedProblems", userMiddleware, getSolvedProblems);

// authRouter.get('/getProfile',getProfile);

module.exports = userRouter;
