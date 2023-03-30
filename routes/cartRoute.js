const express = require("express");
const cartRoute = express.Router();
const isOtpAuth = require("../middleware/otpAuth")
const {addToCart,getCartForUser, updateCartStatus, removeFromCart, getRecentOrder, cancelLastOrder} = require("../controllers/cartController")


// Route to add a product to cart
cartRoute.post("/add", isOtpAuth, addToCart);

// get cart details for user
cartRoute.get("/get", isOtpAuth, getCartForUser)

// get recent order for user
cartRoute.get("/getRecentOrder", isOtpAuth, getRecentOrder)

// cancel lastOrder for user
cartRoute.post("/cancelLastOrder", isOtpAuth, cancelLastOrder)

//removeQuantity for product
cartRoute.patch("/removeFromCart", isOtpAuth, removeFromCart)

//update cart
cartRoute.patch("/cartUpdate", isOtpAuth, updateCartStatus)

module.exports = cartRoute