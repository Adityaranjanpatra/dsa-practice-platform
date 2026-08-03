const { Router } = require("express");
const userMiddleware = require("../middleware/user.middleware");
const { submitCode, runCode } = require("../controllers/submission.controller");

const SubmitRouter=Router();

SubmitRouter.post("/submit/:id",userMiddleware,submitCode);
SubmitRouter.post("/run/:id",userMiddleware,runCode)

module.exports=SubmitRouter;
