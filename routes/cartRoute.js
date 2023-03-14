const express = require("express");
const cartRoute = express.Router();

const addToCart = require("../controllers/cartController")


// Route to add a product to cart
cartRoute.post("/add", addToCart);

module.exports = cartRoute