const mongoose = require('mongoose');
const Cart = require("../model/orderModel");
const Product = require("../model/productModel");

const addToCart = async (req, res) => {
  try {
    // Retrieve userId from JWT token
    const userId = req.data._id;
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
        await existingCart.addQuantity(productId);
      } else {
        // Add new product to cart with a quantity of 1
        existingCart.products.push({
          product: productId,
          quantity: 1,
          price: product.price,
        });
        await existingCart.save();
      }
    } else {
      // Create new cart object with a new product and a quantity of 1
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

// const getCart = async (req, res) => {
//   try {
//     // Extract user ID from decoded JWT token
//     const userId = req.data.id;

//     const cart = await Cart.findOne({ buyer: userId }).populate({
//       path: 'products.product',
//       select: 'productName price foodType avatar.url',
//       populate: { path: 'categoryId', select: 'categoryName' },
//       options: { lean: true },
//     }).lean();
//     if (!cart) {
//       return res.status(404).json({ message: 'Cart not found' });
//     }

//     // Calculate total amount of products in cart
//     let totalAmount = 0;
//     cart.products.forEach((product) => {
//       totalAmount += product.product.price * product.quantity;
//       product.productImage = product.product.avatar.url;
//       delete product.product.avatar;
//     });

//     return res.status(200).json({ status: true, message: 'Cart details', response: { cart, totalAmount } });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: 'Internal Server Error' });
//   }
// };

const getCart = async (req, res) => {
  try {
    // Extract user ID from decoded JWT token
    const userId = req.data.id;

    const cart = await Cart.findOne({ buyer: userId })
      .populate({
        path: 'products.product',
        select: 'productName price foodType avatar.url',
        populate: { path: 'categoryId', select: 'categoryName' },
        options: { lean: true },
      })
      .lean();

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Transform cart data to desired response format
    const response = {
      _id: cart._id,
      buyer: cart.buyer,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
      __v: cart.__v,
      products: [],
    };

    let totalAmount = 0;

    cart.products.forEach((cartProduct) => {
      const { product } = cartProduct;
      const formattedProduct = {
        _id: product._id,
        productName: product.productName,
        price: product.price,
        foodType: product.foodType,
        quantity: cartProduct.quantity,
        productImage: product.avatar.url,
      };

      totalAmount += product.price * cartProduct.quantity;
      response.products.push(formattedProduct);
    });

    response.totalAmount = totalAmount;

    return res.status(200).json({
      status: true,
      message: 'Cart details',
      response,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const addQuantity = async (req, res) => {
  try {
    // Retrieve userId from JWT token
    const userId = req.data._id;
    const productId = req.body.productId;

    // Check if cart already exists for user
    let existingCart = await Cart.findOne({ buyer: userId })
    if (!existingCart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Check if product already exists in cart
    const existingProductIndex = existingCart.products.findIndex(
      (p) => p.product.toString() === productId
    );
    if (existingProductIndex === -1) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }
    // Increment quantity of existing product in cart
    existingCart.products[existingProductIndex].quantity += 1;
 
    await existingCart.save();

    return res.status(200).json({ status: true, message: 'Product quantity updated', response: existingCart });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const removeQuantity = async (req, res) => {
  try {
    // Retrieve userId from JWT token
    const userId = req.data._id;
    const productId = req.body.productId;

    // Check if cart already exists for user
    let existingCart = await Cart.findOne({ buyer: userId });
    if (!existingCart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Check if product already exists in cart
    const existingProductIndex = existingCart.products.findIndex(
      (p) => p.product.toString() === productId
    );
    if (existingProductIndex === -1) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    // Get the product object from the cart
    const existingProduct = existingCart.products[existingProductIndex];

    // Decrement quantity of existing product in cart
    if (existingProduct.quantity > 1) {
      existingProduct.quantity -= 1;
    } else {
      // Remove product from cart if quantity is 1
      existingCart.products.splice(existingProductIndex, 1);
    }

    // Save changes to cart in database
    existingCart = await existingCart.save();

    return res.status(200).json({ status: true, message: 'Product quantity removed from cart', response: existingCart });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};


module.exports = {addToCart , getCart, addQuantity, removeQuantity};

