const categoryModel = require("../model/categoryModel");
const cloudinary = require("cloudinary");

// create category
const createCategoryWithImage = async (req, res) => {
  try {
    const { categoryName } = req.body;
    if (!categoryName) {
      return res.status(401).send({ message: "categoryName is required" });
    }
    const existingCategory = await categoryModel.findOne({ categoryName });
    if (existingCategory) {
      return res.status(200).send({
        status: false,
        message: "Category already exists",
      });
    }
    const result = await cloudinary.v2.uploader.upload(req.file.path);
    if (!result) {
      return res.status(500).json({
        status: false,
        message: "Error while uploading image",
      });
    }
    const category = await new categoryModel({
      categoryName,
      status: "active",
      avatar: {
        public_id: result.public_id,
        url: result.secure_url,
      },
    }).save();
    const response = {
      id:category._id,
      categoryName: category.categoryName,
      status: category.status,
      categoryImage:category.avatar.url,
      products: category.products,
    };
    res.status(201).send({
      status: true,
      message: "New category created successfully",
      response: [response],
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      error,
      message: "Error in Category",
    });
  }
};

//update category
const updateCategory = async (req, res) => {
  try {
    const categoryId = await categoryModel.findById(req.params.id);
    const { categoryName, status, avatar } = req.body;

    const updatedFields = {};
    if (categoryName) updatedFields.categoryName = categoryName;
    if (status) updatedFields.status = status;
    if (avatar) {
      const result = await cloudinary.v2.uploader.upload(req.file.path);
      if (!result) {
        return res.status(500).json({
          status: false,
          message: "Error while uploading image",
        });
      }
      updatedFields.avatar = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }
    const updatedCategory = await categoryModel.findByIdAndUpdate(
      categoryId,
      { $set: updatedFields },
      { new: true }
    );

    const response = {
      id: updatedCategory._id,
      categoryName: updatedCategory.categoryName,
      status: updatedCategory.status,
      categoryImage: updatedCategory.avatar.url,
      products: updatedCategory.products,
    };

    res.status(200).send({
      status: true,
      message: "Category updated successfully",
      response: [response],
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      error,
      message: "Error in updating category",
    });
  }
};

// get all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryModel.find({ status: "active" });

    const response = categories.map((category) => {
      return {
        id: category._id,
        categoryName: category.categoryName,
        status: category.status,
        categoryImage: category.avatar.url,
        products: category.products,
      };
    });

    res.status(200).send({
      status: true,
      message: "All Categories List",
      response,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      error,
      message: "Error while getting all categories",
    });
  }
};

// get all categories with products
const getAllCategoriesWithProducts = async (req, res) => {
  try {
    const categories = await categoryModel
      .find({ status: "active" })
      .populate("products");

    const response = categories.map((category) => {
      return {
        id: category._id,
        categoryName: category.categoryName,
        status: category.status,
        categoryImage: category.avatar.url,
        products: category.products.map((product) => {
          return {
            id: product._id,
            productName: product.name,
            price: product.price,
            description: product.description,
            productImage: product.avatar.url,
            status:product.status,
            foodType:product.foodType
        };
        }),
      };
    });

    res.status(200).send({
      status: true,
      message: "All Categories List",
      response,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      error,
      message: "Error while getting all categories",
    });
  }
};

// single category
const getSingleCategory = async (req, res) => {
  try {
    const category = await categoryModel.findById(req.params.id);
    const name = category.categoryName;
    if (category && category.status === "active") {
      const response = {
        id: category._id,
        categoryName: category.categoryName,
        status: category.status,
        categoryImage: category.avatar.url,
        products: category.products.map((product) => {
          return {
            id: product._id,
            productName: product.name,
            price: product.price,
            description: product.description,
            productImage: product.avatar,
            status:product.status,
            foodType:product.foodType
        };
        }),
            };
      return res.status(200).send({
        status: true,
        message: "Get Single Category successfully",
        response: [response],
      });
    } else if (category && category.status === "inactive") {
      return res.status(200).send({
        status: false,
        message: `Category - ${name} is inactive, please contact admin to activate it`,
      });
    } else {
      return res.status(404).send({
        status: false,
        message: "Category not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      error,
      message: "Error while getting Single Category",
    });
  }
};

//delete category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await categoryModel.findByIdAndDelete(id);
    res.status(200).send({
      status: true,
      message: "Categry Deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      message: "error while deleting category",
      error,
    });
  }
};

module.exports = {
  createCategoryWithImage,
  updateCategory,
  getAllCategories,
  getAllCategoriesWithProducts,
  getSingleCategory,
  deleteCategory,
};
