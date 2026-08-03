const express=require('express')
const adminMiddleware = require('../middleware/admin.middleware');
const userMiddleware = require('../middleware/user.middleware');
const { createProblem, updateProblem, deleteProblem, fetchProblem, fetchAllProblem, fetchSubmissions } = require('../controllers/problem.controller');


const problemRouter=express.Router();

problemRouter.post("/create",adminMiddleware,createProblem);
problemRouter.patch("/:id",adminMiddleware,updateProblem);
problemRouter.delete("/:id",adminMiddleware,deleteProblem);



problemRouter.get("/:id",fetchProblem);
problemRouter.get("/:id/submissions",userMiddleware,fetchSubmissions);
problemRouter.get("/",fetchAllProblem);





module.exports=problemRouter;