const mongoose = require('mongoose');
const Admin = require("../model/adminModel");
const User = require("../model/usermodel");
const cloudinary = require("cloudinary");
const DeliveryPerson = require("../model/deliveryPersonModel");

// admin Login
const adminLogin = async (req, res) => {
  try {
    const { userId, password } = req.body;
    if (!userId || !password) {
      return res.status(400).json({
        status: false,
        message: "please enter all fields",
        response: [],
      });
    }

    // * Checking if Admin has registered or not
    let user = await Admin.findOne({ userId });
    if (!user) {
      return res.status(400).json({
        status: false,
        message: "invalid userId",
        response: [],
      });
    }
    if (user.password !== password) {
      return res.status(400).json({
        status: false,
        message: "invalid password",
        response: [],
      });
    }
    const token = user.generateToken();
    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token: token,
      data: user,
    });
  } catch (error) {
    return res.json({ status: false, message: error.message, response: [] });
  }
};

// Find Total Users
const totalUsers = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
      return res.json({
        status: false,
        message: "Admin not authorised",
        response: [],
      });
    }
    const users = await User.find({})
      .populate({
        path: "completedCart",
        populate: {
          path: "products",
          select: "-_id name price quantity",
        },
      })
      .populate({
        path: "pendingCart",
        populate: {
          path: "products",
          select: "-_id name price quantity",
        },
      });

    if (users.length <= 0) {
      return res.json({
        status: false,
        message: "Users not found",
        response: [],
      });
    }
    return res.json({
      status: true,
      message: "users fetch success",
      response: users,
    });
  } catch (error) {
    return res.json({ status: false, message: error.message, response: [] });
  }
};

// find total delivery boys
const totalDeliveryBoys = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
      return res.json({
        status: false,
        message: "Admin not authorised",
        response: [],
      });
    }
    const delBoy = await DeliveryPerson.find({});
    if (delBoy.length <= 0) {
      return res.json({
        status: false,
        message: "No Delivery Persons Found",
        response: [],
      });
    }
    return res.json({
      status: true,
      message: "delivery boys data fetch successful",
      response: [delBoy],
    });
  } catch (error) {
    return res.json({ status: false, message: error.message, response: [] });
  }
};

// get delivery boys whose onDuty
const getdeliveryBoysOnduty = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
      return res.json({
        status: false,
        message: "Admin not authorised",
        response: [],
      });
    }
    const delBoy = await DeliveryPerson.find({
      onDuty: "on",
      status: "active",
    });
    if (delBoy.length <= 0) {
      return res.json({
        status: false,
        message: "No Delivery Persons Found",
        response: [],
      });
    }
    return res.json({
      status: true,
      message: "delivery boys data fetch successful",
      response: [delBoy],
    });
  } catch (error) {
    return res.json({ status: false, message: error.message, response: [] });
  }
};

//Update user status
const updateUserStatus = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send({
        status: false,
        message: "User not found",
      });
    }

    const newStatus = user.status === "active" ? "inactive" : "active";
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { status: newStatus } },
      { new: true }
    );

    const response = {
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      status: updatedUser.status,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };

    res.status(200).send({
      status: true,
      message: "User status updated successfully",
      response: [response],
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      message: "Error in updating user status",
      error,
    });
  }
};

//delivery person status update
const updateDeliveryboyStatus = async (req, res) => {
  try {
    const delBoyId = req.params.id;
    const delBoy = await DeliveryPerson.findById(delBoyId);

    if (!delBoy) {
      return res.status(404).send({
        status: false,
        message: "deliverBoy not found",
      });
    }

    const newStatus = delBoy.status === "active" ? "inactive" : "active";
    const updatedDelBoy = await DeliveryPerson.findByIdAndUpdate(
      delBoyId,
      { $set: { status: newStatus } },
      { new: true }
    );

    const response = {
      id: updatedDelBoy._id,
      fullname: updatedDelBoy.fullname,
      area: updatedDelBoy.area,
      mobile: updatedDelBoy.mobile,
      password: updatedDelBoy.password,
      status: updatedDelBoy.status,
      createdAt: updatedDelBoy.createdAt,
      updatedAt: updatedDelBoy.updatedAt,
    };

    res.status(200).send({
      status: true,
      message: "delivery boy status updated successfully",
      response: [response],
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      message: "Error in updating deliveryBoy status",
      error,
    });
  }
};

// delete a user
const deleteUser = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
      return res.json({
        status: false,
        message: "Admin not authorised",
        response: [],
      });
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.json({
        status: false,
        message: "User not found",
        response: [],
      });
    }
    return res.json({
      status: true,
      message: "User deleted successfully",
      response: user,
    });
  } catch (error) {
    return res.json({ status: false, message: error.message, response: [] });
  }
};
//get cart with cartId
const getCartFromAllUsers = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
      return res.json({
        status: false,
        message: "Admin not authorised",
        response: [],
      });
    }

    const cartId = req.params.id;
    console.log(cartId);
    const cartObjectId = mongoose.Types.ObjectId(cartId);
    const users = await User.find({
      $or: [{ completedCart: cartId }, { pendingCart: cartId }],
    })
      .populate({
        path: "completedCart",
        populate: {
          path: "products",
          select: "-_id name price quantity",
        },
      })
      .populate({
        path: "pendingCart",
        populate: {
          path: "products",
          select: "-_id name price quantity",
        },
      });
    console.log("users = " + users);
    if (users.length <= 0) {
      return res.json({
        status: false,
        message: "Users not found with this cartId",
        response: [],
      });
    }

    const usersWithCart = users.map((user) => {
      let cart;
      if (user.completedCart && user.completedCart.toString() === cartId) {
        cart = user.completedCart;
      } else if (user.pendingCart && user.pendingCart.toString() === cartId) {
        cart = user.pendingCart;
      }
      return {
        _id: user._id,
        email: user.email,
        cart: cart,
      };
    });

    return res.json({
      status: true,
      message: "Users with cartId fetch success",
      response: usersWithCart,
    });
  } catch (error) {
    return res.json({ status: false, message: error.message, response: [] });
  }
};

// delete delivery boy
const deleteDeliveryBoy = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
      return res.json({
        status: false,
        message: "Admin not authorised",
        response: [],
      });
    }
    const delBoy = await DeliveryPerson.findByIdAndDelete(req.params.id);
    if (!delBoy) {
      return res.json({
        status: false,
        message: "Delivery Boy not found",
        response: [],
      });
    }
    return res.json({
      status: true,
      message: "Delivery Boy deleted successfully",
      response: delBoy,
    });
  } catch (error) {
    return res.json({ status: false, message: error.message, response: [] });
  }
};

// assign db
// const assignDeliveryBoy = async (req, res) => {
//   try {
//     const admin = await Admin.findById(req.admin.id);
//     if (!admin) {
//       return res.status(401).json({
//         status: false,
//         message: "Admin not authorized",
//         response: [],
//       });
//     }
//     const cartId = req.params.id;
//     const cart = await User.findOne({ _id: cartId });
//     if (!cart) {
//       return res.status(400).json({
//         status: false,
//         message: "Cart not found",
//         response: [],
//       });
//     }

//     const user = await User.findById(cart.buyer);
//     if (!user) {
//       return res.status(400).json({
//         status: false,
//         message: "User not found",
//         response: [],
//       });
//     }

//     const deliveryBoyId = req.body.deliveryBoyId;
//     const deliveryBoy = await DeliveryPerson.findById(deliveryBoyId);
//     if (!deliveryBoy) {
//       return res.status(400).json({
//         status: false,
//         message: "Delivery Boy not found",
//         response: [],
//       });
//     }

//     // Update the cart with the assigned delivery boy
//     cart.deliveryPerson = deliveryBoyId;
//     await cart.save();

//     res.status(200).json({
//       status: true,
//       message: "Delivery Boy assigned successfully",
//       response: {
//         cartId: cartId,
//         buyer: user,
//         deliveryPerson: deliveryBoy,
//       },
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       status: false,
//       message: "Internal Server Error",
//       response: error.message,
//     });
//   }
// };
// const assignDeliveryBoy = async (req, res) => {
//   try {
//     const admin = await Admin.findById(req.admin.id);
//     if (!admin) {
//       return res.status(401).json({
//         status: false,
//         message: "Admin not authorized",
//         response: [],
//       });
//     }

//     const cartId = req.params.id;

//     const users = await totalUsers(req, res);

//     const user = users.find(user => user.completedCart._id === cartId || user.pendingCart._id === cartId);
//     if (!user) {
//       return res.status(400).json({
//         status: false,
//         message: "Cart not found",
//         response: [],
//       });
//     }

//     const deliveryBoyId = req.body.deliveryBoyId;
//     const deliveryBoy = await DeliveryPerson.findById(deliveryBoyId);
//     if (!deliveryBoy) {
//       return res.status(400).json({
//         status: false,
//         message: "Delivery Boy not found",
//         response: [],
//       });
//     }

//     // 
//     // Update the cart with the assigned delivery boy
//     let updatedCart;
//     if (user.completedCart && user.completedCart.toString() === cartId) {
//       user.completedCart.deliveryPerson = deliveryBoyId;
//       updatedCart = user.completedCart.toObject(); // convert to plain JS object
//     } else if (user.pendingCart && user.pendingCart.toString() === cartId) {
//       user.pendingCart.deliveryPerson = deliveryBoyId;
//       updatedCart = user.pendingCart.toObject(); // convert to plain JS object
//     }
//     await user.save();

//     res.status(200).json({
//       status: true,
//       message: "Delivery Boy assigned successfully",
//       response: {
//         cartId: cartId,
//         buyer: user._id,
//         deliveryPerson: deliveryBoy,
//         cart: {
//           _id: updatedCart._id,
//           products: updatedCart.products,
//           total: updatedCart.total,
//           deliveryPerson: updatedCart.deliveryPerson
//         }
//       },
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       status: false,
//       message: "Internal Server Error",
//       response: error.message,
//     });
//   }
// };
// const assignDeliveryBoy = async (req, res) => {
//   try {
//     const admin = await Admin.findById(req.admin.id);
//     if (!admin) {
//       return res.status(401).json({
//         status: false,
//         message: "Admin not authorized",
//         response: [],
//       });
//     }
//     const cartId = req.params.id;
//     const user = await User.findOne({ $or: [{ completedCart: cartId }, { pendingCart: cartId }] });
//     if (!user) {
//       return res.status(400).json({
//         status: false,
//         message: "Cart not found for any user",
//         response: [],
//       });
//     }

//     const deliveryBoyId = req.body.deliveryBoyId;
//     const deliveryBoy = await DeliveryPerson.findById(deliveryBoyId);
//     if (!deliveryBoy) {
//       return res.status(400).json({
//         status: false,
//         message: "Delivery Boy not found",
//         response: [],
//       });
//     }

//     // Update the cart with the assigned delivery boy
//     let updatedCart;
//     if (user.completedCart && user.completedCart.toString() === cartId) {
//       user.completedCart.deliveryPerson = deliveryBoyId;
//       updatedCart = user.completedCart.toObject(); // convert to plain JS object
//     } else if (user.pendingCart && user.pendingCart.toString() === cartId) {
//       user.pendingCart.deliveryPerson = deliveryBoyId;
//       updatedCart = user.pendingCart.toObject(); // convert to plain JS object
//     }
//     await user.save();

//     res.status(200).json({
//       status: true,
//       message: "Delivery Boy assigned successfully",
//       response: {
//         cartId: cartId,
//         buyer: user._id,
//         deliveryPerson: deliveryBoy,
//         cart: {
//           _id: updatedCart._id,
//           products: updatedCart.products,
//           total: updatedCart.total,
//           deliveryPerson: updatedCart.deliveryPerson
//         }
//       },
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       status: false,
//       message: "Internal Server Error",
//       response: error.message,
//     });
//   }
// };
const assignDeliveryBoy = async (req, res) => {
  try {
    // Validate admin authorization
    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
      return res.json({
        status: false,
        message: "Admin not authorised",
        response: [],
      });
    }

    // Extract the cart ID and delivery boy ID from the request
    const { cartId } = req.params;
    const { deliveryBoyId } = req.body;

    // Search for the user who owns the cart
    const user = await User.findOne({
      $or: [
        { "completedCart.cartId": cartId },
        { "selfPickupCart.cartId": cartId },
        { "canceledCart.cartId": cartId },
      ],
    });

    if (!user) {
      // Cart not found
      return res.status(404).json({
        status: false,
        message: "Cart not found",
        response: [],
      });
    }

    // Find the cart in the user's data
    let cart;
    if (user.completedCart.find((c) => c.cartId === cartId)) {
      cart = user.completedCart.find((c) => c.cartId === cartId);
    } else if (user.selfPickupCart.find((c) => c.cartId === cartId)) {
      cart = user.selfPickupCart.find((c) => c.cartId === cartId);
    } else if (user.canceledCart.find((c) => c.cartId === cartId)) {
      cart = user.canceledCart.find((c) => c.cartId === cartId);
    }

    // Update the cart with the delivery person ID
    cart.deliveryPerson = deliveryBoyId;

    // Save the updated user data
    await user.save();

    return res.json({
      status: true,
      message: "Delivery boy assigned successfully",
      response: [],
    });
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
  adminLogin,
  totalUsers,
  totalDeliveryBoys,
  updateUserStatus,
  updateDeliveryboyStatus,
  deleteUser,
  deleteDeliveryBoy,
  getdeliveryBoysOnduty,
  assignDeliveryBoy,
  getCartFromAllUsers
};
