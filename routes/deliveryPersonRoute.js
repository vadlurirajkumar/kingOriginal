const express = require("express")
const deliveryBoy = express.Router()
const adminAuth = require("../middleware/adminAuth")
const {createDeliveryBoy, loginDeliveryBoy, dbOnDuty, getOrders, getSingleOrderDetails, updateStatusToPickup, getLocationDetails, updateStatusToDelivery, viewOrderHistory, addFeedback} = require("../controllers/deliveryPersonController")


//signup route
deliveryBoy.post("/signup", adminAuth, createDeliveryBoy)

//login
deliveryBoy.post("/login",loginDeliveryBoy)

//onduty toggle
deliveryBoy.patch("/dutyToggle/:id", dbOnDuty)

//get orders
deliveryBoy.get("/get-orders/:id",getOrders)

//get single order details
deliveryBoy.get("/get-single-order/:id", getSingleOrderDetails)

//updateStatus
deliveryBoy.patch("/change-status-pickup/:id", updateStatusToPickup)

//get user location
deliveryBoy.get("/get-location/:id", getLocationDetails)

//update status to delivered
deliveryBoy.patch("/change-status-delivered/:id", updateStatusToDelivery)

// order -history
deliveryBoy.get("/get-order-history/:id",viewOrderHistory)

// add feedback
deliveryBoy.post("/add-feedback/:id", addFeedback)

module.exports = deliveryBoy