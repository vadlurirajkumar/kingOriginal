const express = require("express");
const productRoute = express.Router();
const isAdminAuth = require("../middleware/adminAuth");
const isOtpAuth = require("../middleware/otpAuth")
const {
  createProduct,
  getAllProducts,
  getAllProductsForAdmin,
  getSingleProduct,
  getSingleProductForAdmin,
  getAllVegProducts,
  getAllNonVegProducts,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
  addToExclusiveDish,
  removeFromExclusiveDish,
  getExclusiveDishes,
  getExclusiveDishesForAdmin,
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
productRoute.get("/all-products",isOtpAuth, getAllProducts);

// get all products for admin
productRoute.get("/get-all-products", getAllProductsForAdmin)

// get single product
productRoute.get("/single-product/:id",isOtpAuth, getSingleProduct);

//get single product for admin
productRoute.get("/get-single-product/:id",getSingleProductForAdmin)

// get all veg products
productRoute.get("/veg-products",isOtpAuth, getAllVegProducts);

// get all non-veg products
productRoute.get("/non-veg-products",isOtpAuth, getAllNonVegProducts);

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
productRoute.get("/get-exclusiveDishes",isOtpAuth, getExclusiveDishes);

//get exclusive dishes for admin
productRoute.get("/exclusive-dishes", getExclusiveDishesForAdmin)

// get exclusive dishes only veg
productRoute.get("/get-exclusiveDishes/veg",isOtpAuth, getExclusiveVegDishes);

// get exclusive dishes only non-veg
productRoute.get("/get-exclusiveDishes/non-veg",isOtpAuth, getExclusiveNonVegDishes);

module.exports = productRoute;
