const mongoose = require("mongoose");
const Cart = require("../model/orderModel");
const Product = require("../model/productModel");
const User = require("../model/usermodel");

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
        respone: [],
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
          productName: product.name,
          quantity: 1,
          price: product.price,
          productImage:product.productImage
        });
      }
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
            productName: product.name,
            quantity: 1,
            price: product.price,
            productImage:product.productImage
          },
        ],
      };
      user.pendingCart.push(newCart);
      await user.save();
    }

    return res.status(200).json({
      status: true,
      message: "Product added to cart",
      respone:existingCart
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



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

    return res.status(200).json({
      status: true,
      message: "Product quantity updated",
      response: existingCart,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
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

    return res.status(200).json({
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
    // Retrieve userId from JWT token
    const userId = req.data.id;

    // Find pending cart for user
    const user = await User.findById(userId);
    const pendingCartIndex = user.pendingCart.findIndex(
      (p) => p.status === "inCart"
    );
    if (pendingCartIndex === -1) {
      return res.status(404).json({ message: "Pending cart not found" });
    }

    const { transactionId, status } = req.body;

    if (status === "ordered") {
      // Move pending cart data to completed cart and empty pending cart
      const completedCart = user.completedCart || [];
      const cartToMove = user.pendingCart[pendingCartIndex];
      cartToMove.status = status;
      cartToMove.transactionId = transactionId;
      completedCart.push(cartToMove);
      user.completedCart = completedCart;
      user.pendingCart.splice(pendingCartIndex, 1);
      await user.save();

      res.json({
        message: "Cart updated successfully",
        response: { transactionId, status, completedCart },
      });
    } else {
      res.status(400).json({ message: "Invalid status" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// const addToCart = async (req, res) => {
//   try {
//     const userId = req.data.id;
//     const productId = req.body.productId;

//     // Find product by id
//     const product = await Product.findById(productId);
   
//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     // Find the user
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Check if user has an existing pending cart
//     let cart = user.pendingCart.find((cart) => cart.status === "inCart");
//     if (cart) {
//       // Check if the product is already in the cart
//       const existingProduct = cart.products.find(
//         (p) => p && p.productName === product.productName

//       );
//       if  (existingProduct) {
//         // If product is already in the cart, increase its quantity
//         existingProduct.quantity++;

//         // Recalculate the total amount for the cart
//         cart.totalAmount = cart.products.reduce(
//           (total, p) => total + p.price * p.quantity,
//           0
//         );
//       } else {
//         // Add the new product to the cart
//         cart.products.push({
//           product: product.product_Id,
//           productName: product.productName,
//           quantity: 1,
//           productImage:product.productImage || product.avatar.url,
//           price: parseFloat(product.price),
//         });
//       }
//     } else {
//       // If the user doesn't have an existing pending cart, create one
//       cart = {
//         buyer: userId,
//         totalAmount: parseFloat(product.price),
//         status: "inCart",
//         products: [
//           {
//             product: product.product_Id,
//           productName: product.productName,
//           quantity: 1,
//           productImage:product.productImage || product.avatar.url,
//           price: parseFloat(product.price),
//         },
//         ],
//       };
//       user.pendingCart.push(cart);
//     }

//     // Recalculate the total amount for the cart
//     cart.totalAmount = cart.products.reduce(
//       (total, p) => total + p.price * p.quantity,
//       0
//     );

//     // Save the changes to the user document
//     await user.save();

//     // Send the updated cart back to the client
//     res.json({
//       status: true,
//       message: "Product added to cart",
//       response: cart,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// const addToCart = async(req,res)=> {
// try {
//     const userId = req.data._id;
//     const productId = req.body.productId;

//     // find product
//     const product = await Product.findById(productId);
//     if(!product){
//       return res.status(404).json({
//         status:false,
//         message:"Product not found",
//         respone:[]
//       })
//     }
//     //find user
//     const user = await User.findById(userId)
//     if(!user){
//       return res.status(400).json({
//         status:false,
//         message:"user not found"
//       })
//     }
//     // checking cart
//     let cart = await user.pendingCart.find((c)=>c.status === "inCart")
//     if(cart){
//       const existingProductIndex = cart.products.findIndex(
//         (p) => p.product.toString() === productId
//       )
//       if(existingProductIndex !== -1){
//         await cart.addQuantity(productId)
//       }
//       else{
//         cart.products.push({
//           product:productId,
//           quantity:1,
//           price:product.price,
//           productImage:product.productImage
//         })
//         await cart.save();
//       }
//     } else {
//       // create new cart
//       const pendingCart = new User({
//         buyer:userId,
//         products:[{product:productId,quantity:1,productImage:product.productImage,price:product.price}]
//       })
//       cart = await pendingCart.save();
//     }
//     return res.status(200).json({
//       status:true,
//       message:"product added to cart",
//       response:cart
//     })
// } catch (error) {
//   console.error(error);
//   return res.status(500).json({ message: 'Internal Server Error' });
// }
// }

// const addToCart = async(req,res)=> {
//   try {
//     const userId = req.data._id;
//     const productId = req.body.productId;

//     // find product
//     const product = await Product.findById(productId);
//     if(!product){
//       return res.status(404).json({
//         status:false,
//         message:"Product not found",
//         respone:[]
//       })
//     }
//     //find user
//     const user = await User.findById(userId)
//     if(!user){
//       return res.status(400).json({
//         status:false,
//         message:"user not found"
//       })
//     }
//     // checking cart
//     let cart = await user.pendingCart.find((c)=>c.status === "inCart")
//     if(cart){
//       const existingProductIndex = cart.products.findIndex(
//         (p) => p.product.toString() === productId
//       )
//       if(existingProductIndex !== -1){
//         await cart.addQuantity(productId)
//       }
//       else{
//         cart.products.push({
//           product:productId,
//           quantity:1,
//           price:product.price,
//           productImage:product.productImage
//         })
//         await cart.save();
//       }
//     } else {
//       // create new cart
//       const pendingCart = new Cart({
//         buyer: userId,
//         products: [
//           {
//             product: productId,
//             quantity: 1,
//             productImage: product.productImage,
//             price: product.price,
//           },
//         ],
//       });
//       await pendingCart.save();
//     }
//     return res.status(200).json({
//       status:true,
//       message:"product added to cart",
//       response:cart
//     })
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: 'Internal Server Error' });
//   }
// }


module.exports = {
  addToCart,
  getCart,
  addQuantity,
  removeQuantity,
  updateCartStatus,
};
