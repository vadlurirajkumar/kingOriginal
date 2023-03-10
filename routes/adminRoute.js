const express = require("express");
const adminRouter = express.Router();
const {adminLogin, totalUsers, updateUserStatus, deleteUser} = require("../controllers/adminController")
const isAdminAuth = require("../middleware/adminAuth");

// routes
adminRouter.post("/login", adminLogin);
adminRouter.get("/allusers", isAdminAuth, totalUsers);
adminRouter.put('/:id', isAdminAuth, updateUserStatus);
adminRouter.delete("/user/:id", isAdminAuth, deleteUser);


module.exports =  adminRouter;