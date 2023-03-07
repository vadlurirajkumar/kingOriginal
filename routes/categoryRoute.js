const express = require("express");
const categoryRoute = express.Router();
const isAdminAuth = require("../middleware/adminAuth");
const {
  getAllCategories,
  getAllCategoriesWithProducts,
  createCategoryWithImage,
  deleteCategory,
  getSingleCategory,
  updateCategory
} = require("./../controllers/categoryController");
const uploadImage = require("../utils/multer");

//routes

// create category
categoryRoute.post(
  "/create-category",
  isAdminAuth,
  uploadImage.single("avatar"),
  createCategoryWithImage
);

//update category
categoryRoute.patch(
  "/update-category/:id",
  isAdminAuth,
  uploadImage.single("avatar"),
  updateCategory
);

//getALl category
categoryRoute.get("/get-category", getAllCategories);

//get all categories with products
categoryRoute.get("/get-category-with-products", getAllCategoriesWithProducts);

//single category
categoryRoute.get("/single-category/:id", getSingleCategory);

//delete category
categoryRoute.delete("/delete-category/:id", isAdminAuth, deleteCategory);

module.exports = categoryRoute;
