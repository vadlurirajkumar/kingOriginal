const mongoose = require('mongoose');
const Cart = require("../model/orderModel");
const Product = require("../model/productModel");

const addToCart = async (req, res) => {
  try {
    const userId = req.body.userId;
    const productId = req.body.productId;

    // Find product by id
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if cart already exists for user
    let existingCart = await Cart.findOne({ buyer: userId });
    if (existingCart) {
      // Check if product already exists in cart
      const existingProduct = existingCart.products.find(
        (p) => p.product.toString() === productId
      );
      if (existingProduct) {
        // Increase quantity of existing product in cart
        existingProduct.quantity += 1;
      } else {
        // Add new product to cart
        existingCart.products.push({
          product: productId,
          quantity: 1,
          price: product.price,
        });
      }
    } else {
      // Create new cart object
      const cart = new Cart({
        buyer: userId,
        products: [{ product: productId, quantity: 1, price: product.price }],
      });
      existingCart = await cart.save();
    }

    return res.status(200).json({ status: true, message: 'Product added to cart', response: existingCart });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = addToCart;


