const express = require("express")
const deliveryBoy = express.Router()
const adminAuth = require("../middleware/adminAuth")
const {createDeliveryBoy,loginDeliveryBoy} = require("../controllers/deliveryPersonController")


//signup route
deliveryBoy.post("/signup", adminAuth, createDeliveryBoy)

//login
deliveryBoy.post("/login",loginDeliveryBoy)

module.exports = deliveryBoy