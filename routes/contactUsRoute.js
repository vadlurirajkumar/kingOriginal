const express = require("express")
const ContactUsRoute = express.Router()
const {addContactUs, getAllContactUs} = require("../controllers/contactUsController")
const isOtpAuth = require("../middleware/otpAuth")


//add route
ContactUsRoute.post("/add", isOtpAuth, addContactUs)

//get route
ContactUsRoute.get("/get", getAllContactUs)

module.exports = ContactUsRoute