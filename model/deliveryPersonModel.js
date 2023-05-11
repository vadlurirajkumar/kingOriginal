const mongoose = require("mongoose");

const deliveryPersonSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
    },
    mobile: {
      type: Number,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active", // Set the default value for the status field to "active"
    },
    area: {
      type: String,
    },
    onDuty: {
      type: String,
      enum: ["on", "off"],
      default: "off",
    },
    feedback:[
      {
        feedback: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
      }
    ],
    device_token:String,
    notifications:[
      {
        deliveryBoyId:String,
        title:String,
        message:String,
        createdAt:Date
      }
    ],
    
    completedOrders: [
      {
        buyer: String,
        deliveryPerson: String,
        // totalAmount: String,
        phone:Number,
        transactionId: String,
        cartId: String,
        cookingInstructions: String,
        ReceivedAmount: String,
        location:String,
        latitude:String,
        longitude:String,
        // DeliveryCharge: String,
        // GovtTaxes: String,
        // GrandTotal: String,
        status: String,
        updatedAt: {
          type: Date,
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
            cartStatus: {
              type: String,
              enum: ["1", "0"],
              default: "0",
            },
          },
        ],
      },
    ],
    pendingOrders: [
      {
        buyer: String,
        deliveryPerson: String,
        // totalAmount: String,
        phone:Number,
        transactionId: String,
        cartId: String,
        cookingInstructions: String,
        ReceivedAmount: String,
        location:String,
        latitude:String,
        longitude:String,
        // DeliveryCharge: String,
        // GovtTaxes: String,
        // GrandTotal: String,
        status: String,
        updatedAt: {
          type: Date,
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
            cartStatus: {
              type: String,
              enum: ["1", "0"],
              default: "0",
            },
          },
        ],
      },
    ],
  },


  { timestamps: true }
);

deliveryPersonSchema.methods.comparePassword = function (password) {
  return password === this.password;
};

const DeliveryPerson = new mongoose.model(
  "DeliveryPerson",
  deliveryPersonSchema
);

module.exports = DeliveryPerson;
