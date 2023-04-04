const moment = require('moment');
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
        cartId:String,
        DeliveryCharge:String,
        GovtTaxes:String,
        GrandTotal:String,
        createdAt: {
          type: Date,
          get: function(createdAt) {
            return moment(createdAt).format('D MMMM YYYY h:mm:ss a');
          }
        },
        products: [
          {
            productId: {
              type: mongoose.ObjectId,
              ref: "Products",
            },
            productName: {
              type: String,
              required: true,
            },
            quantity: {
              type: Number,
              required: true,
            },
            price: {
              type: Number,
              required: true,
            },
            productImage: {
              type: String,
            },
            foodType: {
              type: String,
              enum: ["veg", "non-veg"],
            },
          },
        ],
      },
    ],
    completedCart: [
      {
        buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        totalAmount: String,
        transactionId:String,
        cartId:String,
        cookingInstructions:String,
        ReceivedAmount:String,
        DeliveryCharge:String,
        GovtTaxes:String,
        GrandTotal:String,
        createdAt: {
          type: Date,
          get: function(createdAt) {
            return moment(createdAt).format('D MMMM YYYY h:mm:ss a');
          }
        },
        status: String,
        products: [
          {
            productId: {
              type: mongoose.ObjectId,
              ref: "Products",
            },
            productName: {
              type: String,
              required: true,
            },
            quantity: {
              type: Number,
              required: true,
            },
            price: {
              type: Number,
              required: true,
            },
            productImage: {
              type: String,
            },
            foodType: {
              type: String,
              enum: ["veg", "non-veg"],
            },
          },
        ],
      },
    ],
    canceledCart: [
      {
        buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        totalAmount: String,
        cookingInstructions:String,
        ReceivedAmount:String,
        cartId:String,
        DeliveryCharge:String,
        GovtTaxes:String,
        GrandTotal:String,
        createdAt: {
          type: Date,
          get: function(createdAt) {
            return moment(createdAt).format('D MMMM YYYY h:mm:ss a');
          }
        },
        transactionId:String,
        status: String,
        products: [
          {
            productId: {
              type: mongoose.ObjectId,
              ref: "Products",
            },
            productName: {
              type: String,
              required: true,
            },
            quantity: {
              type: Number,
              required: true,
            },
            price: {
              type: Number,
              required: true,
            },
            productImage: {
              type: String,
            },
            foodType: {
              type: String,
              enum: ["veg", "non-veg"],
            },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

userSchema.index({ otp_expiry: 1 }, { expireAfterSeconds: 0 });
userSchema.set('toJSON', { getters: true });

const User = new mongoose.model("User", userSchema);

module.exports = User;
