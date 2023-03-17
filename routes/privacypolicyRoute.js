const express = require("express")
const privacyPolicyRoute = express.Router();
const {addPrivacy, updatePrivacy, deletePrivacy, getPrivacy} = require("../controllers/privacyController")
const isAdminAuth = require("../middleware/adminAuth")

// routes
privacyPolicyRoute.get("/get-policy" , getPrivacy) // get privacy-policy
privacyPolicyRoute.post("/add", isAdminAuth, addPrivacy)  // adding privacy policy
privacyPolicyRoute.patch("/update", isAdminAuth, updatePrivacy)  // updating privacy policy
privacyPolicyRoute.post("/delete", isAdminAuth, deletePrivacy)  // deleting privacy policy

module.exports = privacyPolicyRoute