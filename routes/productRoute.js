const express = require("express");
const productRoute = express.Router();
const isAdminAuth = require("../middleware/adminAuth");
const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  getAllVegProducts,
  getAllNonVegProducts,
  updateProduct,
  deleteProduct
} = require("./../controllers/productController");
const uploadImage = require("../utils/multer");

//routes

// create category
productRoute.post("/create-product", isAdminAuth, uploadImage.single("avatar"),createProduct);

// get all products
productRoute.get("/all-products", getAllProducts);

// get single product
productRoute.get("/single-product/:id", getSingleProduct)

// get all veg products
productRoute.get("/veg-products", getAllVegProducts)

// get all non-veg products
productRoute.get("/non-veg-products", getAllNonVegProducts)

// update a product
productRoute.patch("/update-product/:id", isAdminAuth, uploadImage.single("avatar"), updateProduct)

//delete a product
productRoute.delete("/delete-product/:id", isAdminAuth, deleteProduct)


module.exports = productRoute;
