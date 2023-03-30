const mongoose = require("mongoose");
const Cart = require("../model/orderModel");
const Product = require("../model/productModel");
const User = require("../model/usermodel");

// add to cart
const addToCart = async (req, res) => {
  try {
    const userId = req.data._id;
    const productId = req.body.productId;

    // find product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        status: false,
        message: "Product not found",
        response: [],
      });
    }

    // find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        status: false,
        message: "User not found",
      });
    }

    // check if there is an existing cart with status inCart
    let existingCart = user.pendingCart.find((c) => c.status === "inCart");

    if (existingCart) {
      // if the cart already exists, add the product to the cart
      const existingProductIndex = existingCart.products.findIndex(
        (p) => p.productId.toString() === productId
      );
      if (existingProductIndex !== -1) {
        // if the product already exists in the cart, increase its quantity
        existingCart.products[existingProductIndex].quantity += 1;
      } else {
        // if the product doesn't exist in the cart, add it
        existingCart.products.push({
          productId: productId,
          productName: product.productName,
          quantity: 1,
          price: product.price,
          productImage: product.avatar.url,
          foodType: product.foodType,
        });
      }
      // Recalculate the total amount for the cart
      existingCart.totalAmount = existingCart.products.reduce(
        (total, p) => total + p.price * p.quantity,
        0
      );
      await user.save();
    } else {
      // if there is no existing cart with status inCart, create a new one
      const newCart = {
        buyer: userId,
        status: "inCart",
        totalAmount: product.price,
        products: [
          {
            productId: productId,
            productName: product.productName,
            quantity: 1,
            price: product.price,
            productImage: product.avatar.url,
            foodType: product.foodType,
          },
        ],
      };

      user.pendingCart.push(newCart);
      await user.save();

      return res.status(200).json({
        status: true,
        message: "Product added to cart",
        response: newCart,
      });
    }

    return res.status(200).json({
      status: true,
      message: "Product added to cart",
      response: existingCart,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
// remove from cart
const removeFromCart = async (req, res) => {
  try {
    const userId = req.data._id;
    const productId = req.body.productId;

    // find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        status: false,
        message: "User not found",
      });
    }

    // check if there is an existing cart with status inCart
    let existingCart = user.pendingCart.find((c) => c.status === "inCart");

    if (existingCart) {
      // if the cart already exists, remove the product from the cart
      const existingProductIndex = existingCart.products.findIndex(
        (p) => p.productId.toString() === productId
      );
      if (existingProductIndex !== -1) {
        // if the product exists in the cart, decrease its quantity by 1
        if (existingCart.products[existingProductIndex].quantity > 1) {
          existingCart.products[existingProductIndex].quantity -= 1;
        } else {
          existingCart.products.splice(existingProductIndex, 1);
        }
        // Recalculate the total amount for the cart
        existingCart.totalAmount = existingCart.products.reduce(
          (total, p) => total + p.price * p.quantity,
          0
        );
        await user.save();

        return res.status(200).json({
          status: true,
          message: "Product removed from cart",
          response: existingCart,
        });
      } else {
        return res.status(404).json({
          status: false,
          message: "Product not found in cart",
          response: [],
        });
      }
    } else {
      return res.status(404).json({
        status: false,
        message: "Cart not found",
        response: [],
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({status:false, message: "Internal Server Error" , response:error.message});
  }
};
// get cart for single user
const getCartForUser = async (req, res) => {
  try {
    const userId = req.data._id;

    // find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        status: false,
        message: "User not found",
      });
    }

    // check if there is an existing cart with status inCart
    let existingCart = user.pendingCart.find((c) => c.status === "inCart");

    if (existingCart) {
      // Recalculate the total amount for the cart
      existingCart.totalAmount = existingCart.products.reduce(
        (total, p) => total + p.price * p.quantity,
        0
      );
      await user.save();

      return res.status(200).json({
        status: true,
        message: "Cart fetched successfully",
        response: existingCart,
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "Cart not found",
        response: [],
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({status:false, message: "Internal Server Error" , response:error.message});
  }
};
// update cart
const updateCartStatus = async (req, res) => {
  try {
    // Retrieve userId from JWT token
    const userId = req.data.id;

    // Find pending cart for user
    const user = await User.findById(userId);
    const pendingCartIndex = user.pendingCart.findIndex(
      (p) => p.status === "inCart"
    );
    if (pendingCartIndex === -1) {
      return res.status(404).json({ status:false, message: "Pending cart not found" });
    }

    const { transactionId, status } = req.body;

    if (status === "ordered") {
      // Move pending cart data to completed cart and empty pending cart
      const completedCart = user.completedCart || [];
      const cartToMove = user.pendingCart[pendingCartIndex];
      cartToMove.status = status;
      cartToMove.transactionId = transactionId;
      completedCart.push({
        ...cartToMove.toObject(),
        transactionId,
        status,
      });
      user.completedCart = completedCart;
      user.pendingCart.splice(pendingCartIndex, 1);

      // Save the user object to the database
      await user.save();

      res.status(200).json({
        status:true,
        message: "Cart updated successfully",
        response: completedCart,
      });
    } else {
      res.status(400).json({status:false, message: "Invalid status" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({status:false, message: "Internal server error", response:err.message });
  }
};
// recent order of user
const getRecentOrder = async (req, res) => {
  try {
    const userId = req.data._id;

    // find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        status: false,
        message: "User not found",
      });
    }

    // get the most recent order from completedCart
    const completedCart = user.completedCart;
    if (completedCart.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No completed orders found",
        response: [],
      });
    }

    const recentOrder = completedCart[completedCart.length - 1];
    const recentProduct = recentOrder.products[recentOrder.products.length - 1];

    return res.status(200).json({
      status: true,
      message: "Recent order retrieved",
      response: recentOrder
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({status:false, message: "Internal Server Error" , response:error.message});
  }
};
// cancel last order for user
const cancelLastOrder = async (req, res) => {
  try {
    const userId = req.data._id;

    // find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        status: false,
        message: "User not found",
      });
    }

    // get the most recent completed order from completedCart
    const completedCart = user.completedCart;
    if (completedCart.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No completed orders found",
        response: [],
      });
    }

    const recentOrder = completedCart[completedCart.length - 1];
    
    // update the status of the most recent completed order to "canceled"
    recentOrder.status = "canceled";
    
    // move the most recent completed order from completedCart to canceledCart
    const canceledCart = user.canceledCart || [];
    canceledCart.push(recentOrder);
    user.canceledCart = canceledCart;
    user.completedCart = completedCart.slice(0, completedCart.length - 1);
    await user.save();

    return res.status(200).json({
      status: true,
      message: "Last order canceled",
      response: canceledCart,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({status:false, message: "Internal Server Error", response:error.message });
  }
};

module.exports = {
  addToCart,
  getCartForUser,
  updateCartStatus,
  removeFromCart,
  getRecentOrder,
  cancelLastOrder
};
