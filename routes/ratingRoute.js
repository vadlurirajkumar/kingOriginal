const express = require("express")
const ratingRoute = express.Router()
const {addRateUs, getRateUs} = require("../controllers/rateUsController")
const isOtpAuth = require("../middleware/otpAuth")

//routes
ratingRoute.post("/add-rating", isOtpAuth, addRateUs)  //adding rateUs Route
ratingRoute.get("/get-rating", isOtpAuth, getRateUs)    //get rating route

module.exports = ratingRoute