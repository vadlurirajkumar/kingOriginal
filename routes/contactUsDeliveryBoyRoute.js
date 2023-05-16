const express = require("express")
const ContactUsDeliveryBoy = express.Router()
const {addContactUsForDeliveryBoy, getAllContactUsForDeliveryBoy} = require("../controllers/contactUsDeliveryBoyController")


//add route
ContactUsDeliveryBoy.post("/add", addContactUsForDeliveryBoy)

//get route
ContactUsDeliveryBoy.get("/get", getAllContactUsForDeliveryBoy)

module.exports = ContactUsDeliveryBoy