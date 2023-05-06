const express = require("express");
const adminRouter = express.Router();
const {adminLogin, totalUsers, totalDeliveryBoys, updateUserStatus, updateDeliveryboyStatus, deleteUser, deleteDeliveryBoy, getdeliveryBoysOnduty, assignDeliveryBoy, getCartFromAllUsers, sendNotification} = require("../controllers/adminController")
const isAdminAuth = require("../middleware/adminAuth");

// routes
adminRouter.post("/login", adminLogin);
adminRouter.get("/allusers", isAdminAuth, totalUsers);
adminRouter.get('/allDeliveryBoys', isAdminAuth, totalDeliveryBoys)
adminRouter.put('/user/toggleStatus/:id', isAdminAuth, updateUserStatus);
adminRouter.patch("/deliveryBoy/toggleStatus/:id", isAdminAuth, updateDeliveryboyStatus)
adminRouter.delete("/user/:id", isAdminAuth, deleteUser);
adminRouter.delete("/deliveryBoy/:id", isAdminAuth, deleteDeliveryBoy)
adminRouter.get("/onDutyBoys", isAdminAuth, getdeliveryBoysOnduty)
adminRouter.post("/assignDb/:id", isAdminAuth, assignDeliveryBoy)
adminRouter.post("/getParticularCart/:id", isAdminAuth, getCartFromAllUsers)
adminRouter.post("/send-notification",isAdminAuth, sendNotification)

module.exports =  adminRouter;