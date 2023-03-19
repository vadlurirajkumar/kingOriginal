const express = require("express");
const categoryRoute = express.Router();
const isAdminAuth = require("../middleware/adminAuth");
const {
  createCategoryWithImage,
  updateCategory,
  getAllCategories,
  getAllCategoriesWithProducts,
  deleteCategory,
  toggleCategoryStatus,
  getSingleCategoryWithProducts,
  getSingleCategoryWithVegProducts,
  getSingleCategoryWithNonVegProducts,
  getAllCategoriesForUser,
  getAllCategoriesWithProductsForUser,
  getSingleCategoryWithProductsForUser,
  getSingleCategoryWithVegProductsForUser,
  getSingleCategoryWithNonVegProductsForUser

} = require("./../controllers/categoryController");
const uploadImage = require("../utils/multer");

//routes

// create category
categoryRoute.post( "/create-category", isAdminAuth, uploadImage.single("avatar"), createCategoryWithImage); //admin

//update category
categoryRoute.patch("/update-category/:id", isAdminAuth, uploadImage.single("avatar"), updateCategory); //admin

//getALl category
categoryRoute.get("/get-category", getAllCategories); //admin

//get all category which are active only
categoryRoute.get("/get-category-active", getAllCategoriesForUser); //user

//get all categories with products
categoryRoute.get("/get-category-with-products", getAllCategoriesWithProducts); // admin 

//get all categories with products active only
categoryRoute.get("/get-category-with-products-active", getAllCategoriesWithProductsForUser); // user 

//updateStatus
categoryRoute.patch("/single-category/toggleStatus/:id", isAdminAuth, toggleCategoryStatus); //admin

//single category
categoryRoute.get("/single-category/:id", getSingleCategoryWithProducts); // admin

//single category active only
categoryRoute.get("/single-category-active/:id", getSingleCategoryWithProductsForUser); // user

// single category with veg products
categoryRoute.get("/single-category/veg/:id", getSingleCategoryWithVegProducts); // admin

// single category with veg products active only
categoryRoute.get("/single-category-active/veg/:id", getSingleCategoryWithVegProductsForUser); // user

// single category with non-veg products
categoryRoute.get("/single-category/non-veg/:id", getSingleCategoryWithNonVegProducts); // admin

// single category with non-veg products active only
categoryRoute.get("/single-category-active/non-veg/:id", getSingleCategoryWithNonVegProductsForUser); // user

//delete category
categoryRoute.delete("/delete-category/:id", isAdminAuth, deleteCategory); //admin

module.exports = categoryRoute;
