const mongoose = require("mongoose");
const Cart = require("../model/orderModel");
const Product = require("../model/productModel");
const User = require("../model/usermodel");

const getCart = async (req, res) => {
  try {
    // Extract user ID from decoded JWT token
    const userId = req.data.id;

    const cart = await Cart.findOne({ buyer: userId })
      .populate({
        path: "products.product",
        select: "productName price foodType avatar.url",
        populate: { path: "categoryId", select: "categoryName" },
        options: { lean: true },
      })
      .lean();

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Transform cart data to desired response format
    const response = {
      cartId: cart._id,
      buyer: cart.buyer,
      status: cart.status,
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

    // Check if transactionId and amount fields exist in cart
    if (cart.transactionId && cart.amount) {
      response.transactionId = cart.transactionId;
      response.amount = cart.amount;
    }

    return res.status(200).json({
      status: true,
      message: "Cart details",
      response,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const addQuantity = async (req, res) => {
  try {
    // Retrieve userId from JWT token
    const userId = req.data._id;
    const productId = req.body.productId;

    // Check if cart already exists for user
    let existingCart = await Cart.findOne({ buyer: userId });
    if (!existingCart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Check if product already exists in cart
    const existingProductIndex = existingCart.products.findIndex(
      (p) => p.product.toString() === productId
    );
    if (existingProductIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }
    // Increment quantity of existing product in cart
    existingCart.products[existingProductIndex].quantity += 1;

    await existingCart.save();

    return res
      .status(200)
      .json({
        status: true,
        message: "Product quantity updated",
        response: existingCart,
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// const addToCart = async (req, res) => {
//   try {
//     // Retrieve userId from JWT token
//     const userId = req.data.id;
//     const productId = req.body.productId;

//     // Find product by id
//     const product = await Product.findById(productId);
//     if (!product) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     // Check if cart already exists for user
//     let cart = await Cart.findOne({ buyer: userId, status: 'inCart' });
//     if (cart) {
//       // Check if product already exists in cart
//       const existingProductIndex = cart.products.findIndex(
//         (p) => p.product.toString() === productId
//       );
//       if (existingProductIndex !== -1) {
//         // Increment quantity of existing product in cart
//         cart.products[existingProductIndex].quantity++;
//         cart.totalAmount += parseFloat(product.price);
//       } else {
//         // Add new product to cart with a quantity of 1
//         cart.products.push({
//           product: productId,
//           quantity: 1,
//           price: parseFloat(product.price),
//         });
//         cart.totalAmount += parseFloat(product.price);
//       }
//       await cart.save();
//     } else {
//       // Create new cart object with a new product and a quantity of 1
//       cart = new Cart({
//         buyer: userId,
//         status: "inCart",
//         products: [{ product: productId, quantity: 1, price: parseFloat(product.price) }],
//         totalAmount: parseFloat(product.price),
//       });
//       await cart.save();
//     }

//     // Find user by id and update pendingCart array
//     const user = await User.findById(userId);
//     // let pendingCart = user.pendingCart.filter(c => c.status === 'inCart');
//     // if (pendingCart.length > 0) {
//     //   // Update existing pending cart
//     //   pendingCart[0].products = cart.products;
//     //   pendingCart[0].totalAmount = cart.totalAmount;
//     // } else {
//     //   // Add new pending cart
//     //   pendingCart.push({
//     //     buyer: userId,
//     //     totalAmount: cart.totalAmount,
//     //     status: "inCart",
//     //     products: cart.products,
//     //   });
//     // }
//     let pendingCart = user.pendingCart.filter(c => c.status === 'inCart').pop();
// if (pendingCart) {
//   // Update existing pending cart
//   pendingCart.products = cart.products;
//   pendingCart.totalAmount = cart.totalAmount;
// } else {
//   // Add new pending cart
//   pendingCart = {
//     buyer: userId,
//     totalAmount: cart.totalAmount,
//     status: "inCart",
//     products: cart.products,
//   };
//   user.pendingCart.push(pendingCart);
// }

//     user.pendingCart = pendingCart;
//     await user.save();

//     return res.status(200).json({ status: true, message: 'Product added to cart', response: cart });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: 'Internal Server Error' });
//   }
// };


// const addToCart = async (req, res) => {
//   try {
//     // Retrieve userId from JWT token
//     const userId = req.data.id;
//     const productId = req.body.productId;

//     // Find product by id
//     const product = await Product.findById(productId);
//     if (!product) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     // Check if cart already exists for user
//     let cart = await Cart.findOne({ buyer: userId, status: 'inCart' });
//     if (cart) {
//       // Check if product already exists in cart
//       const existingProductIndex = cart.products.findIndex(
//         (p) => p.product.toString() === productId
//       );
//       if (existingProductIndex !== -1) {
//         // Increment quantity of existing product in cart
//         cart.products[existingProductIndex].quantity++;
//         cart.totalAmount += parseFloat(product.price);
//       } else {
//         // Add new product to cart with a quantity of 1
//         cart.products.push({
//           product: productId,
//           quantity: 1,
//           price: parseFloat(product.price),
//         });
//         cart.totalAmount += parseFloat(product.price);
//       }
//       await cart.save();
//     } else {
//       // Create new cart object with a new product and a quantity of 1
//       cart = new Cart({
//         buyer: userId,
//         status: "inCart",
//         products: [{ product: productId, quantity: 1, price: parseFloat(product.price) }],
//         totalAmount: parseFloat(product.price),
//       });
//       await cart.save();
//     }

//     // Find user by id and update pendingCart array
//     const user = await User.findById(userId);
//     let pendingCart = user.pendingCart.filter(c => c.status === 'inCart');
//     if (pendingCart.length > 0) {
//       // Update existing pending cart
//       pendingCart[0].products = cart.products;
//       pendingCart[0].totalAmount = cart.totalAmount;
//     } else {
//       // Add new pending cart
//       pendingCart.push({
//         buyer: userId,
//         totalAmount: cart.totalAmount,
//         status: "inCart",
//         products: cart.products,
//       });
//     }
//     user.pendingCart = pendingCart;
//     await user.save();

//     return res.status(200).json({ status: true, message: 'Product added to cart', response: cart });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: 'Internal Server Error' });
//   }
// };
// const addToCart = async (req, res) => {
//   try {
//     const { productId } = req.body;

//     let cart = await Cart.findOne({ buyer: req.user.id, status: "pending" });
//     if (!cart) {
//       cart = new Cart({ buyer: req.user.id });
//     }

//     let cartProducts = cart.products;
//     let productExists = false;

//     // check if product already exists in cart
//     for (let i = 0; i < cartProducts.length; i++) {
//       if (cartProducts[i].product.equals(productId)) {
//         cartProducts[i].quantity++;
//         productExists = true;
//         break;
//       }
//     }

//     // if product does not exist in cart, add it
//     if (!productExists) {
//       const product = await Product.findById(productId);
//       if (!product) {
//         return res.status(404).json({ message: "Product not found" });
//       }
//       cartProducts.push({ product: productId, quantity: 1, price: product.price });
//     }

//     cart.totalAmount = cartProducts.reduce((total, product) => total + product.quantity * product.price, 0);
//     cart.products = cartProducts;

//     await cart.save();

//     res.json({ status: true, message: "Product added to cart", response: cart });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server Error" });
//   }
// };
const addToCart = async (req, res) => {
  try {
    // Retrieve userId from JWT token
    const userId = req.data.id;
    const productId = req.body.productId;

    // Find product by id
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if cart already exists for user
    let cart = await Cart.findOne({ buyer: userId, status: 'inCart' });
    if (cart) {
      // Check if product already exists in cart
      const existingProductIndex = cart.products.findIndex(
        (p) => p.product.toString() === productId
      );
      if (existingProductIndex !== -1) {
        // Increment quantity of existing product in cart
        cart.products[existingProductIndex].quantity++;
        cart.totalAmount += parseFloat(product.price);
      } else {
        // Add new product to cart with a quantity of 1
        cart.products.push({
          product: productId,
          quantity: 1,
          price: parseFloat(product.price),
        });
        cart.totalAmount += parseFloat(product.price);
      }
      await cart.save();
    } else {
      // Create new cart object with a new product and a quantity of 1
      cart = new Cart({
        buyer: userId,
        status: "inCart",
        products: [{ product: productId, quantity: 1, price: parseFloat(product.price) }],
        totalAmount: parseFloat(product.price),
      });
      await cart.save();
    }

    // Find user by id and update pendingCart array
    const user = await User.findById(userId);
    let pendingCart = user.pendingCart.filter(c => c.status === 'inCart');
    if (pendingCart.length > 0) {
      // Update existing pending cart
      if (pendingCart[0].products.length === 0) {
        pendingCart[0].products.push({
          product: productId,
          quantity: 1,
          price: parseFloat(product.price),
        });
        pendingCart[0].totalAmount += parseFloat(product.price);
      } else {
        const existingProductIndex = pendingCart[0].products.findIndex(
          (p) => p.product.toString() === productId
        );
        if (existingProductIndex !== -1) {
          // Increment quantity of existing product in cart
          pendingCart[0].products[existingProductIndex].quantity++;
          pendingCart[0].totalAmount += parseFloat(product.price);
        } else {
          // Add new product to cart with a quantity of 1
          pendingCart[0].products.push({
            product: productId,
            quantity: 1,
            price: parseFloat(product.price),
          });
          pendingCart[0].totalAmount += parseFloat(product.price);
        }
      }
    } else {
      // Add new pending cart
      pendingCart.push({
        buyer: userId,
        totalAmount: parseFloat(product.price),
        status: "inCart",
        products: [{ product: productId, quantity: 1, price: parseFloat(product.price) }],
      });
    }
    user.pendingCart = pendingCart;
    await user.save();

    return res.status(200).json({ status: true, message: 'Product added to cart', response: cart });
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
      return res.status(404).json({ message: "Cart not found" });
    }

    // Check if product already exists in cart
    const existingProductIndex = existingCart.products.findIndex(
      (p) => p.product.toString() === productId
    );
    if (existingProductIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
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

    return res
      .status(200)
      .json({
        status: true,
        message: "Product quantity removed from cart",
        response: existingCart,
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateCartStatus = async (req, res) => {
  try {
    const userId = req.data.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        status: false,
        message: "User not found",
        response: [],
      });
    }

    if (user.pendingCart.length === 0) {
      return res.status(400).json({
        status: false,
        message: "Cart not found",
        response: [],
      });
    }

    const newStatus = req.body.status;
    const amount = req.body.amount;
    const transactionId = req.body.transactionId;

    // Update status of all items in pendingCart array
    user.pendingCart.forEach((item) => {
      item.status = "ordered";
    });

    // Move items from pendingCart to completedCart array
    const completedCartItems = user.pendingCart;
    user.completedCart.push(...completedCartItems);
    user.pendingCart = [];

    // Add new transaction to completedCart array
    const newTransactionProducts = completedCartItems
      .filter((item) => {
        return item.productId !== undefined;
      })
      .map((item) => {
        return {
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        };
      });

    if (newTransactionProducts.length > 0) {
      const newTransaction = {
        transactionId,
        amount,
        status: newStatus,
        products: newTransactionProducts,
        totalAmount: amount,
      };

      user.completedCart.push(newTransaction);
    }

    await user.save();

    // Filter completedCart array to only include items with total amount and products
    const filteredCompletedCart = user.completedCart.filter((item) => {
      return item.totalAmount !== undefined && item.products.length > 0;
    });

    return res.status(200).json({
      status: true,
      message: "Cart updated successfully",
      response: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        mobile: user.mobile,
        status: user.status,
        otp: user.otp,
        otp_expiry: user.otp_expiry,
        pendingCart: user.pendingCart,
        completedCart: filteredCompletedCart,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        __v: user.__v,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Error updating cart status",
      response: [],
    });
  }
};

module.exports = {
  addToCart,
  getCart,
  addQuantity,
  removeQuantity,
  updateCartStatus,
};
