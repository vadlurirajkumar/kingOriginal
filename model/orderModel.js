const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        type: mongoose.ObjectId,
        ref: "Products",
      },
    ],
    payment: {},
    buyer: {
      type: mongoose.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      default: "InCart",
      enum: ["InCart", "Confirmed", "PickedUp", "OnTheWay", "Delivered"],
    },
  },
  { timestamps: true }
);


const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
