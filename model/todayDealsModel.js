const mongoose = require("mongoose");
const Product = require("../model/productModel")
const Category = require("../model/categoryModel")
const dealsSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      unique:true
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

dealsSchema.pre('save', async function(next) {
  const product = new Product({
    productName: this.productName,
    categoryId: this.categoryId,
    description: this.description,
    price: this.price,
    foodType:this.foodType,
    avatar: this.avatar
  });

  // Save the product first, and then add the new product ID to the category
  await product.save();
  await Category.findByIdAndUpdate(this.categoryId, { $push: { products: product._id } });

  next();
});

const Deals = mongoose.model("Deals", dealsSchema);

module.exports = Deals;