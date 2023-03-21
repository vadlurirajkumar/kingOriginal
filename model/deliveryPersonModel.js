const mongoose = require("mongoose");

const deliveryPersonSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
    },
    mobile: {
      type: Number,
      unique: true,
    },
    password: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active", // Set the default value for the status field to "active"
    },
    area: {
      type: String,
    },
  },
  { timestamps: true }
);

deliveryPersonSchema.methods.comparePassword = function (password) {
    return password === this.password;
  };

const DeliveryPerson = new mongoose.model("DeliveryPerson", deliveryPersonSchema);

module.exports = DeliveryPerson;
