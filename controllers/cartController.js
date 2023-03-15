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
      const existingProductIndex = existingCart.products.findIndex(
        (p) => p.product.toString() === productId
      );
      if (existingProductIndex !== -1) {
        // Increment quantity of existing product in cart
        existingCart.products[existingProductIndex].quantity += 1;
      } else {
        // Add new product to cart with a quantity of 1
        existingCart.products.push({
          product: productId,
          quantity: 1,
          price: product.price,
        });
      }
    } else {
      // Create new cart object with a new product and a quantity of 1
      const cart = new Cart({
        buyer: userId,
        products: [{ product: productId, quantity: 1, price: product.price }],
      });
      existingCart = await cart.save();
    }

    // Save changes to cart in database
    existingCart = await existingCart.save();

    return res.status(200).json({ status: true, message: 'Product added to cart', response: existingCart });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = addToCart;
