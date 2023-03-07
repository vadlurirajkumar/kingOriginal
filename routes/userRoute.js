const express = require("express")
const router = express.Router()
const {signupUser, verify,login,resendOtp , updateLocation, } = require("../controllers/userController")
const isOtpAuth = require("../middleware/otpAuth")

// routes
router.post("/signup",signupUser)
router.post("/verify",isOtpAuth,verify)
router.post("/login",login)
router.post("/resendotp",resendOtp)
router.put('/:id/location', updateLocation)



module.exports = router