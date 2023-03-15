const express = require("express");
const cartRoute = express.Router();
const isOtpAuth = require("../middleware/otpAuth")
const {addToCart,getCart, addQuantity,removeQuantity} = require("../controllers/cartController")


// Route to add a product to cart
cartRoute.post("/add", isOtpAuth, addToCart);

// get cart details for user
cartRoute.get("/get", isOtpAuth, getCart)

// addQuantity for product
cartRoute.patch("/addQuantity", isOtpAuth, addQuantity)

//removeQuantity for product
cartRoute.patch("/removeQuantity", isOtpAuth, removeQuantity)

module.exports = cartRoute