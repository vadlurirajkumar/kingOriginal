const express = require("express")
const aboutUsRoute = express.Router();
const {addAboutUs, updateAboutUs, deleteAboutUs, getAboutUs} = require("../controllers/aboutusController")
const isAdminAuth = require("../middleware/adminAuth")

// routes
aboutUsRoute.get("/get-aboutUs" , getAboutUs) // get about us data
aboutUsRoute.post("/add", isAdminAuth, addAboutUs)  // adding about us data
aboutUsRoute.patch("/update", isAdminAuth, updateAboutUs)  // updating about us data
aboutUsRoute.post("/delete", isAdminAuth, deleteAboutUs)  // deleting about us data

module.exports = aboutUsRoute