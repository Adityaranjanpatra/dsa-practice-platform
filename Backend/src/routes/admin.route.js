const { Router } = require("express");
const adminMiddleware = require("../middleware/admin.middleware");
const { adminRegister,  adminLogin } = require("../controllers/admin.controller");
const { logout } = require("../controllers/user.controller");


const adminRouter=Router();

adminRouter.post("/register", adminMiddleware, adminRegister);
adminRouter.post("/login", adminLogin);
adminRouter.post("/logout", adminMiddleware, logout);


module.exports=adminRouter;