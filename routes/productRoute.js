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
  deleteProduct,
  toggleProductStatus,
  addToExclusiveDish, removeFromExclusiveDish,getExclusiveDishes,getExclusiveVegDishes,getExclusiveNonVegDishes
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

//update status
productRoute.patch("/single-product/toggleStatus/:id", isAdminAuth, toggleProductStatus)

//delete a product
productRoute.delete("/delete-product/:id", isAdminAuth, deleteProduct)

// add exclusive status to product
productRoute.patch("/add-to-exclusive/:id", isAdminAuth, addToExclusiveDish)

// remove exclusive status
productRoute.patch("/remove-from-exclusive/:id", isAdminAuth, removeFromExclusiveDish)

// get exclusive dishes
productRoute.get("/get-exclusiveDishes", getExclusiveDishes)

// get exclusive dishes only veg
productRoute.get("/get-exclusiveDishes/veg", getExclusiveVegDishes)

// get exclusive dishes only non-veg
productRoute.get("/get-exclusiveDishes/non-veg", getExclusiveNonVegDishes)

module.exports = productRoute;
