const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    mobile: {
      type: Number,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active", // Set the default value for the status field to "active"
    },
    location: {
      type: String,
      required: false,
    },
    otp: {
      type: String,
    },
    otp_expiry: {
      type: Date,
    },
    login_otp: {
      type: String,
    },
    login_otp_expiry: {
      type: Date,
    },
    pendingCart: [
      {
        buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        totalAmount: { type: Number, required: true },
        status: String,
        products: [
          {
            productId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Product",
            },
            productName: String,
            quantity: Number,
            price: Number,
          },
        ],
      },
    ],
    completedCart: [
      {
        buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        totalAmount: String,
        status: String,
        products: [
          {
            productId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Product",
            },
            productName: String,
            quantity: Number,
            price: Number,
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

userSchema.index({ otp_expiry: 1 }, { expireAfterSeconds: 0 });

const User = new mongoose.model("User", userSchema);

module.exports = User;
