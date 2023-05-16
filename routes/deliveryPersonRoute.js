const express = require("express")
const deliveryBoy = express.Router()
const adminAuth = require("../middleware/adminAuth")
const {createDeliveryBoy, loginDeliveryBoy,changePassword, dbOnDuty, getOrders, getSingleOrderDetails, updateStatusToPickup, getLocationDetails, updateStatusToDelivery, viewOrderHistory,pendingHistory,deliveredHistory, addFeedback, getNotificationsForDeliveryBoy, sortHistoryByDate} = require("../controllers/deliveryPersonController")


//signup route
deliveryBoy.post("/signup", adminAuth, createDeliveryBoy)

//login
deliveryBoy.post("/login",loginDeliveryBoy)

// edit details like change password
deliveryBoy.post("/edit-details", changePassword)

//onduty toggle
deliveryBoy.patch("/dutyToggle/:id", dbOnDuty)

//get orders
deliveryBoy.get("/get-orders/:id",getOrders)

//get single order details
deliveryBoy.get("/get-single-order/:id/details/:cartId", getSingleOrderDetails)

//updateStatus
deliveryBoy.patch("/change-status-pickup/:id/details/:cartId", updateStatusToPickup)

//get user location
deliveryBoy.get("/get-location/:id/details/:cartId", getLocationDetails)

//update status to delivered
deliveryBoy.patch("/change-status-delivered/:id/details/:cartId", updateStatusToDelivery)

// order -history
deliveryBoy.get("/get-order-history/:id",viewOrderHistory)

//order - pending -history
deliveryBoy.get("/get-pending-history/:id", pendingHistory)

//order -delivered/completed history
deliveryBoy.get("/get-completed-orders/:id", deliveredHistory)

// add feedback
deliveryBoy.post("/add-feedback", addFeedback)

// get notifications
deliveryBoy.get("/get-notification-deliveryBoy/:id", getNotificationsForDeliveryBoy)

// sort orders of today
deliveryBoy.get("/get-today-orders/:id",sortHistoryByDate)

module.exports = deliveryBoy