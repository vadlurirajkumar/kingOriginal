const express = require("express")
const router = express.Router()
const {signupUser, verify,login,resendOtp , updateLocation, editProfile, getSingleUser} = require("../controllers/userController")
const isOtpAuth = require("../middleware/otpAuth")

// routes
router.post("/signup",signupUser)
router.post("/verify",isOtpAuth,verify)
router.post("/login",login)
router.post("/resendotp",resendOtp)
router.patch('/location', isOtpAuth, updateLocation)
router.patch("/update", isOtpAuth, editProfile)
router.get("/getuser", isOtpAuth, getSingleUser)



module.exports = router

