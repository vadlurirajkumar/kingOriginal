const mongoose = require('mongoose');
const Order = require("../model/orderModel");
const Product = require("../model/productModel");

// add a product to cart
// const addToCart =  async (req, res) => {
//   try {
//     const { userId, productId } = req.body;

//     // Get the product details
//     const product = await Product.findById(productId);

//     // Create the cart item object
//     const cartItem = {
//       product: mongoose.Types.ObjectId(productId),
//       price: product.price,
//     };

//     // Find the order for this user with status InCart
//     let order = await Order.findOne({ buyer: userId, status: "InCart" });

//     // If no order found, create a new one
//     if (!order) {
//       order = await Order.create({
//         products: [cartItem],
//         buyer: userId,
//       });
//     } else {
//       // Check if the product already exists in the cart
//       const existingProductIndex = order.products.findIndex(
//         (item) => item.product.toString() === productId
//       );

//       if (existingProductIndex !== -1) {
//         // If product already exists in cart, update the quantity
//         order.products[existingProductIndex].quantity += 1;
//       } else {
//         // If product does not exist in cart, add it
//         order.products.push(cartItem);
//       }

//       // Update the order with the new cart items
//       order = await order.save();
//     }

//     res.status(201).json(order);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server Error" });
//   }
// };

// add a product to cart
const addToCart = async (req, res) => {
    try {
      const { userId, productId } = req.body;
  
      // Get the product details
      const product = await Product.findById(productId);
  
      // Create the cart item object
      const cartItem = {
        product: mongoose.Types.ObjectId(productId),
        price: product.price,
      };
  
      // Find the order for this user with status InCart
      let order = await Order.findOne({ buyer: userId, status: "InCart" });
  
      if (!order) {
        // If no order found, create a new one with a single cart item
        order = await Order.create({
          products: [cartItem], // Use an array with a single cart item
          buyer: userId,
        });
      } else {
        // Check if the product already exists in the cart
        const existingProductIndex = order.products.findIndex(
          (item) => item.product.toString() === productId
        );
  
        if (existingProductIndex !== -1) {
          // If product already exists in cart, update the quantity
          order.products[existingProductIndex].quantity += 1;
        } else {
          // If product does not exist in cart, add it
          order.products.push(cartItem);
        }
  
        // Update the order with the new cart items
        order = await order.save();
      }
  
      res.status(201).json(order);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  };
  
  

module.exports = addToCart;
