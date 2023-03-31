const express = require("express");
const dealsRoute = express.Router();
const isAdminAuth = require("../middleware/adminAuth");
const {
  createDealProduct,
  getAllDealProducts,
  getSingleDealProduct,
  getAllVegDealProducts,
  getAllNonVegDealProducts,
  updateDealProduct,
  deleteDealProduct,
  toggleDealProductStatus,
} = require("./../controllers/dealsController");
const uploadImage = require("../utils/multer");

//routes

// create category
dealsRoute.post("/create-product", isAdminAuth, uploadImage.single("avatar"), createDealProduct);

// get all products
dealsRoute.get("/all-products", getAllDealProducts);

// get single product
dealsRoute.get("/single-product/:id", getSingleDealProduct)

// get all veg products
dealsRoute.get("/veg-products", getAllVegDealProducts)

// get all non-veg products
dealsRoute.get("/non-veg-products", getAllNonVegDealProducts)

// update a product
dealsRoute.patch("/update-product/:id", isAdminAuth, uploadImage.single("avatar"), updateDealProduct)

//update status
dealsRoute.patch("/single-product/toggleStatus/:id", isAdminAuth, toggleDealProductStatus)

//delete a product
dealsRoute.delete("/delete-product/:id", isAdminAuth, deleteDealProduct)


module.exports = dealsRoute;
