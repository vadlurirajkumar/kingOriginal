const express = require("express");
const productRoute = express.Router();
const isAdminAuth = require("../middleware/adminAuth");
const isOtpAuth = require("../middleware/otpAuth")
const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  getAllVegProducts,
  getAllNonVegProducts,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
  addToExclusiveDish,
  removeFromExclusiveDish,
  getExclusiveDishes,
  getExclusiveVegDishes,
  getExclusiveNonVegDishes,
} = require("./../controllers/productController");
const uploadImage = require("../utils/multer");

//routes

// create category
productRoute.post(
  "/create-product",
  isAdminAuth,
  uploadImage.single("avatar"),
  createProduct
);

// get all products
productRoute.post("/all-products",isOtpAuth, getAllProducts);

// get single product
productRoute.post("/single-product/:id",isOtpAuth, getSingleProduct);

// get all veg products
productRoute.post("/veg-products",isOtpAuth, getAllVegProducts);

// get all non-veg products
productRoute.post("/non-veg-products",isOtpAuth, getAllNonVegProducts);

// update a product
productRoute.patch(
  "/update-product/:id",
  isAdminAuth,
  uploadImage.single("avatar"),
  updateProduct
);

//update status
productRoute.patch(
  "/single-product/toggleStatus/:id",
  isAdminAuth,
  toggleProductStatus
);

//delete a product
productRoute.delete("/delete-product/:id", isAdminAuth, deleteProduct);

// add exclusive status to product
productRoute.patch("/add-to-exclusive/:id", isAdminAuth, addToExclusiveDish);

// remove exclusive status
productRoute.patch(
  "/remove-from-exclusive/:id",
  isAdminAuth,
  removeFromExclusiveDish
);

// get exclusive dishes
productRoute.post("/get-exclusiveDishes",isOtpAuth, getExclusiveDishes);

// get exclusive dishes only veg
productRoute.post("/get-exclusiveDishes/veg",isOtpAuth, getExclusiveVegDishes);

// get exclusive dishes only non-veg
productRoute.post("/get-exclusiveDishes/non-veg",isOtpAuth, getExclusiveNonVegDishes);

module.exports = productRoute;
