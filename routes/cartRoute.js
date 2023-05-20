const express = require("express");
const cartRoute = express.Router();
const isOtpAuth = require("../middleware/otpAuth")
const {addToCart,getCartForUser, updateCartStatus,updateCartStatusWithSingleResponse,updateToSelfPickup, removeFromCart, getRecentOrder,getRecentOrderVegProducts,getRecentOrderNonVegProducts, cancelLastOrder, orderHistory, getOrderDetails, ChangeToSelfPickup} = require("../controllers/cartController")


// Route to add a product to cart
cartRoute.post("/add", isOtpAuth, addToCart);

// get cart details for user
cartRoute.get("/get", isOtpAuth, getCartForUser)

// get recent order for user
cartRoute.get("/getRecentOrder", isOtpAuth, getRecentOrder)

// get only veg products from recent order 
cartRoute.get("/getRecentOrder/veg", isOtpAuth, getRecentOrderVegProducts)

// get only non veg products from recent order
cartRoute.get("/getRecentOrder/non-veg", isOtpAuth, getRecentOrderNonVegProducts)

// cancel lastOrder for user
cartRoute.post("/cancelLastOrder", isOtpAuth, cancelLastOrder)

//removeQuantity for product
cartRoute.patch("/removeFromCart", isOtpAuth, removeFromCart)

//update cart
// cartRoute.patch("/cartUpdate", isOtpAuth, updateCartStatus)

//update with single response
cartRoute.put("/cartUpdate", isOtpAuth, updateCartStatusWithSingleResponse) // newly added for prashanth

// order history
cartRoute.get("/order-history", isOtpAuth, orderHistory)

// particular order from order-history
cartRoute.get("/single-orderDetails/:id", isOtpAuth, getOrderDetails)

// change for self-pickup
cartRoute.patch("/self-pickup", isOtpAuth, ChangeToSelfPickup)

// update for self-pickup
cartRoute.put("/updateToSelfPickup", isOtpAuth, updateToSelfPickup) // newly added for prashanth

module.exports = cartRoute