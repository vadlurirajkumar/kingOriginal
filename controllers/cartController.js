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
        const cartStatus = existingCart.products[existingProductIndex].cartStatus;
      } else {
        // if the product doesn't exist in the cart, add it
        existingCart.products.push({
          cartId:existingCart.cartId,
          productId: productId,
          productName: product.productName,
          quantity: 1,
          price: product.price,
          productImage: product.avatar.url,
          foodType: product.foodType,
          cartStatus:product.cartStatus
        });
      }
      // Recalculate the total amount for the cart
      existingCart.totalAmount = existingCart.products.reduce(
        (total, p) => total + p.price * p.quantity,
        0
      );
      await user.save();

      return res.status(200).json({
        status: true,
        message: "Product added to cart",
        response: {
          ...existingCart.toObject(),
        },
      });
    } else {
      // if there is no existing cart with status inCart, create a new one
      const newCart = {
        buyer: userId,
        status: "inCart",
        totalAmount: product.price,
        createdAt: new Date(),
        cartId: mongoose.Types.ObjectId(),
        products: [
          {
            productId: productId,
            productName: product.productName,
            quantity: 1,
            price: product.price,
            productImage: product.avatar.url,
            foodType: product.foodType,
            cartStatus: 1
          },
        ],
      };

      user.pendingCart.push(newCart);
      await user.save();
      return res.status(200).json({
        status: true,
        message: "Product added to cart",
        response: {
          ...newCart,
        },
      });
    }
    return res.status(200).json({
      status: true,
      message: "Product added to cart",
      response: {
        ...existingCart.toObject(),
      },
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

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        status: false,
        message: "User not found",
      });
    }

    let existingCart = user.pendingCart.find((c) => c.status === "inCart");
    if (!existingCart) {
      return res.status(400).json({
        status: false,
        message: "Cart not found",
      });
    }

    const existingProductIndex = existingCart.products.findIndex(
      (p) => p.productId.toString() === productId
    );
    if (existingProductIndex === -1) {
      return res.status(404).json({
        status: false,
        message: "Product not found in cart",
        response: [],
      });
    }

    const existingProduct = existingCart.products[existingProductIndex];

    if (existingProduct.quantity > 1) {
      existingProduct.quantity -= 1;
      existingProduct.cartStatus = 1;
    } else {
      existingCart.products.splice(existingProductIndex, 1);
      existingProduct.cartStatus = 0;
    }

    existingCart.totalAmount = existingCart.products.reduce(
      (total, p) => total + p.price * p.quantity,
      0
    );

    if (existingCart.products.length === 0) {
      user.pendingCart = user.pendingCart.filter(
        (c) => c.status !== "inCart"
      );
      await user.save();
      return res.status(200).json({
        status: true,
        message: "No products found in cart",
        response: [],
      });
    }

    await user.save();

    return res.status(200).json({
      status: true,
      message: "Product removed from cart",
      response: existingCart,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      response: [],
    });
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
      existingCart.DeliveryCharge = 50;
      existingCart.GovtTaxes = 20;
      existingCart.GrandTotal =
        Number(existingCart.totalAmount) +
        Number(existingCart.DeliveryCharge) +
        Number(existingCart.GovtTaxes);
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
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
      response: error.message,
    });
  }
};
// order self-pickup
// const ChangeToSelfPickup = async (req, res) => {
//   try {
//     const userId = req.data._id;

//     // find user
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(400).json({
//         status: false,
//         message: "User not found",
//       });
//     }

//     // check if there is an existing cart with status inCart
//     let existingCart = user.pendingCart.find((c) => c.status === "inCart");
//     const { transactionId, cookingInstructions, ReceivedAmount } =
//       req.body;
//     if (existingCart) {
//       // update the existing cart status to "Self-pickup"
//       existingCart.status = "Self-pickup";

//       // remove the existing cart from the pendingCart array
//       user.pendingCart.splice(user.pendingCart.indexOf(existingCart), 1);

//       // Recalculate the total amount for the cart
//       existingCart.totalAmount = existingCart.products.reduce(
//         (total, p) => total + p.price * p.quantity,
//         0
//       );
//       existingCart.DeliveryCharge = 0;
//       existingCart.GovtTaxes = 20;
//       existingCart.GrandTotal =
//         Number(existingCart.totalAmount) +
//         Number(existingCart.DeliveryCharge) +
//         Number(existingCart.GovtTaxes);
//       existingCart.transactionId = transactionId;
//       existingCart.cookingInstructions = cookingInstructions;
//       existingCart.ReceivedAmount = ReceivedAmount;

//       // Convert cart object to plain object to avoid issues with Mongoose
//       const cartToSave = { ...existingCart.toObject(), ...req.body, status: existingCart.status };
//       delete cartToSave._id;

//       // Add cart to selfPickupCart array
//       user.selfPickupCart.push({
//         ...cartToSave,
//         createdAt: new Date(),
//       });

//       // Save the changes to the database
//       await Promise.all([
//         user.save(),
//         Cart.findOneAndUpdate({ _id: existingCart._id }, existingCart, {
//           upsert: true,
//         }),
//       ]);

//       return res.status(200).json({
//         status: true,
//         message: "Cart updated successfully",
//         response: [existingCart],
//       });
//     } else {
//       return res.status(404).json({
//         status: false,
//         message: "Cart not found",
//         response: [],
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       status: false,
//       message: "Internal Server Error",
//       response: error.message,
//     });
//   }
// };
const ChangeToSelfPickup = async (req, res) => {
  try {
    // Retrieve userId from JWT token
    const userId = req.data.id;

    // Find pending cart for user
    const user = await User.findById(userId);
    const pendingCartIndex = user.pendingCart.findIndex(
      (p) => p.status === "inCart"
    );
    if (pendingCartIndex === -1) {
      pendingCartIndex.createdAt = new Date();
      return res
        .status(404)
        .json({ status: false, message: "Pending cart not found" });
    }

    const { transactionId, status, cookingInstructions, ReceivedAmount } =
      req.body;

    if (status === "Self-pickup") {
      // Move pending cart data to completed cart and empty pending cart
      const selfPickupCart = user.selfPickupCart || [];
      const cartToMove = user.pendingCart[pendingCartIndex];

      // Recalculate the total amount for the cart
      cartToMove.totalAmount = cartToMove.products.reduce(
        (total, p) => total + p.price * p.quantity,
        0
      );
      cartToMove.DeliveryCharge = 0;
      cartToMove.GovtTaxes = 20;
      cartToMove.GrandTotal =
        Number(cartToMove.totalAmount) +
        Number(cartToMove.DeliveryCharge) +
        Number(cartToMove.GovtTaxes);

      cartToMove.status = status;
      cartToMove.transactionId = transactionId;
      cartToMove.cookingInstructions = cookingInstructions;
      cartToMove.ReceivedAmount = ReceivedAmount;

      selfPickupCart.push({
        ...cartToMove.toObject(),
        transactionId,
        status,
        cookingInstructions,
        ReceivedAmount,
      });

      user.selfPickupCart = selfPickupCart;
      user.pendingCart.splice(pendingCartIndex, 1);

      // Save the user object to the database
      await user.save();

      res.status(200).json({
        status: true,
        message: "Cart updated successfully",
        response: selfPickupCart,
      });
    } else {
      res.status(400).json({ status: false, message: "Invalid status" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: false,
      message: "Internal server error",
      response: err.message,
    });
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
      pendingCartIndex.createdAt = new Date();
      return res
        .status(404)
        .json({ status: false, message: "Pending cart not found" });
    }

    const { transactionId, status, cookingInstructions, ReceivedAmount } =
      req.body;

    if (status === "ordered") {
      // Move pending cart data to completed cart and empty pending cart
      const completedCart = user.completedCart || [];
      const cartToMove = user.pendingCart[pendingCartIndex];

      // Recalculate the total amount for the cart
      cartToMove.totalAmount = cartToMove.products.reduce(
        (total, p) => total + p.price * p.quantity,
        0
      );
      cartToMove.DeliveryCharge = 50;
      cartToMove.GovtTaxes = 20;
      cartToMove.GrandTotal =
        Number(cartToMove.totalAmount) +
        Number(cartToMove.DeliveryCharge) +
        Number(cartToMove.GovtTaxes);

      cartToMove.status = status;
      cartToMove.transactionId = transactionId;
      cartToMove.cookingInstructions = cookingInstructions;
      cartToMove.ReceivedAmount = ReceivedAmount;

      completedCart.push({
        ...cartToMove.toObject(),
        transactionId,
        status,
        cookingInstructions,
        ReceivedAmount,
      });

      user.completedCart = completedCart;
      user.pendingCart.splice(pendingCartIndex, 1);

      // Save the user object to the database
      await user.save();

      res.status(200).json({
        status: true,
        message: "Cart updated successfully",
        response: completedCart,
      });
    } else {
      res.status(400).json({ status: false, message: "Invalid status" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: false,
      message: "Internal server error",
      response: err.message,
    });
  }
};
// recent order of user
// const getRecentOrder = async (req, res) => {
//   try {
//     const userId = req.data._id;

//     // find user
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(400).json({
//         status: false,
//         message: "User not found",
//       });
//     }

//     // get the most recent order from completedCart
//     const completedCart = user.completedCart;
//     if (completedCart.length === 0) {
//       return res.status(404).json({
//         status: false,
//         message: "No completed orders found",
//         response: [],
//       });
//     }

//     const recentOrder = completedCart[completedCart.length - 1];
//     const recentProduct = recentOrder.products[recentOrder.products.length - 1];

//     return res.status(200).json({
//       status: true,
//       message: "Recent order retrieved",
//       response: recentOrder,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       status: false,
//       message: "Internal Server Error",
//       response: error.message,
//     });
//   }
// };
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

    // get the most recent order from completedCart, selfPickupCart, canceledCart
    let recentOrder;
    const completedCart = user.completedCart;
    const selfPickupCart = user.selfPickupCart;
    const canceledCart = user.canceledCart;
    const allCarts = [...completedCart, ...selfPickupCart, ...canceledCart];

    if (allCarts.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No completed orders found",
        response: [],
      });
    }

    // get the most recent order from all carts
    recentOrder = allCarts.reduce((prev, current) => {
      if (new Date(prev.orderDate) < new Date(current.orderDate)) {
        return current;
      } else {
        return prev;
      }
    });

    // check if any products in recentOrder are also in pendingCart and mark them with cartStatus 1
    const pendingCart = user.pendingCart;
    if (pendingCart.length > 0) {
      for (let i = 0; i < recentOrder.products.length; i++) {
        const product = recentOrder.products[i];
        const productInPendingCart = pendingCart.find((item) => item.productId === product.productId.toString());
        if (productInPendingCart) {
          const productDetails = await Product.findById(product.productId);
          if (productDetails) {
            product.cartStatus = productDetails.cartStatus;
          }
        }
      }
    }

    return res.status(200).json({
      status: true,
      message: "Recent order retrieved",
      response: recentOrder,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
      response: error.message,
    });
  }
};


// recent order products only veg
const getRecentOrderVegProducts = async (req, res) => {
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
    const vegProducts = recentOrder.products.filter(
      (product) => product.foodType === "veg"
    );

    return res.status(200).json({
      status: true,
      message: "Recent vegetarian products retrieved",
      response: vegProducts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
      response: error.message,
    });
  }
};
// recent order products only veg
const getRecentOrderNonVegProducts = async (req, res) => {
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
    const vegProducts = recentOrder.products.filter(
      (product) => product.foodType === "non-veg"
    );

    return res.status(200).json({
      status: true,
      message: "Recent vegetarian products retrieved",
      response: vegProducts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
      response: error.message,
    });
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

    // combine completedCart and selfPickupCart arrays
    const allOrders = user.completedCart.concat(user.selfPickupCart);

    // sort the combined array by createdAt field in descending order
    allOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // get the most recent order from the combined array
    const recentOrder = allOrders[0];

    if (!recentOrder) {
      return res.status(404).json({
        status: false,
        message: "No completed or self-pickup orders found",
        response: [],
      });
    }

    // update the status of the most recent order to "canceled"
    recentOrder.status = "canceled";

    // move the most recent order from its original array to canceledCart
    const canceledCart = user.canceledCart || [];
    if (recentOrder.deliveryMethod === "Delivery") {
      user.completedCart = user.completedCart.filter(
        (cart) => cart._id.toString() !== recentOrder._id.toString()
      );
    } else {
      user.selfPickupCart = user.selfPickupCart.filter(
        (cart) => cart._id.toString() !== recentOrder._id.toString()
      );
    }
    canceledCart.push(recentOrder);
    user.canceledCart = canceledCart;

    // save the user object with the updated canceledCart and original arrays
    await user.save();

    return res.status(200).json({
      status: true,
      message: "Last order canceled",
      response: canceledCart,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
      response: error.message,
    });
  }
};
// get orderHistory
const orderHistory = async (req, res) => {
  try {
    const userId = req.data._id;
    let user = await User.findById(userId);
    if (!user) {
      res.status(400).json({
        status: false,
        message: "user not found",
      });
    } else {
      const history = user.completedCart
        .concat(user.canceledCart)
        .concat(user.selfPickupCart);
      const seenIds = new Set();
      const filteredHistory = history.filter((item) => {
        if (seenIds.has(item.cartId)) {
          return false;
        }
        seenIds.add(item.cartId);
        return true;
      });
      filteredHistory.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      res.status(200).json({
        status: true,
        message: "user history fetched successfully",
        response: filteredHistory,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
      response: error.message,
    });
  }
};
// get particular order
const getOrderDetails = async (req, res) => {
  try {
    const userId = req.data._id;
    const cartId = req.params.id;
    let user = await User.findById(userId);
    if (!user) {
      res.status(400).json({
        status: false,
        message: "user not found",
      });
    } else {
      const cart =
        user.completedCart.find((cart) => cart.cartId === cartId) ||
        user.canceledCart.find((cart) => cart.cartId === cartId) ||
        user.selfPickupCart.find((cart) => cart.cartId === cartId);
      if (!cart) {
        res.status(400).json({
          status: false,
          message: "cart not found",
        });
      } else {
        const response = {
          cartId: cartId,
          buyer: cart.buyer,
          transactionId: cart.transactionId,
          status: cart.status,
          totalAmount: cart.totalAmount,
          cookingInstructions: cart.cookingInstructions,
          ReceivedAmount: cart.ReceivedAmount,
          createdAt: cart.createdAt,
          DeliveryCharge: cart.DeliveryCharge,
          GovtTaxes: cart.GovtTaxes,
          GrandTotal: cart.GrandTotal,
          products: cart.products,
        };
        res.status(200).json({
          status: true,
          message: "order details fetched successfully",
          response: response,
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
      response: error.message,
    });
  }
};

module.exports = {
  addToCart,
  getCartForUser,
  updateCartStatus,
  removeFromCart,
  getRecentOrder,
  getRecentOrderVegProducts,
  getRecentOrderNonVegProducts,
  cancelLastOrder,
  orderHistory,
  getOrderDetails,
  ChangeToSelfPickup,
};
