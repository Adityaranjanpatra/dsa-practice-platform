const { Router } = require("express");
const adminMiddleware = require("../middleware/admin.middleware");
const { adminRegister } = require("../controllers/admin.controller");
const { logout } = require("../controllers/user.controller");


const adminRouter=Router();

adminRouter.post("/register", adminMiddleware, adminRegister);


module.exports=adminRouter;