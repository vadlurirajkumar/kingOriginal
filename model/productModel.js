const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      unique:true
    },
    slug: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    categoryId: {
      type: mongoose.ObjectId,
      ref: "Category",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active", // Set the default value for the status field to "active"
    },
    avatar: {
      public_id: String,
      url: String,
    },
    foodType:{
        type: String,
        enum: ["veg", "non-veg"],
        required:true
    }
  },
  { timestamps: true }
);

const Products = mongoose.model("Products", productSchema);

module.exports = Products;