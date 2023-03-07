const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required:true,
    unique:true
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
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Products',
      
    },
  ],
  
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
