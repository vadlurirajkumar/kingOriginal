const categoryModel = require("../model/categoryModel");
const cloudinary = require("cloudinary");
const User = require("../model/usermodel");
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
      id: category._id,
      categoryName: category.categoryName,
      status: category.status,
      categoryImage: category.avatar.url,
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
// const updateCategory = async (req, res) => {
//   try {
//     const categoryId = await categoryModel.findById(req.params.id);
//     const { categoryName, status, avatar } = req.body;

//     const updatedFields = {};
//     if (categoryName) updatedFields.categoryName = categoryName;
//     if (status) updatedFields.status = status;
//     if (avatar) {
//       const result = await cloudinary.v2.uploader.upload(req.file.path);
//       if (!result) {
//         return res.status(500).json({
//           status: false,
//           message: "Error while uploading image",
//         });
//       }
//       updatedFields.avatar = {
//         public_id: result.public_id,
//         url: result.secure_url,
//       };
//     }
//     const updatedCategory = await categoryModel.findByIdAndUpdate(
//       categoryId,
//       { $set: updatedFields },
//       { new: true }
//     );

//     // const response = {
//     //   id: updatedCategory._id,
//     //   categoryName: updatedCategory.categoryName,
//     //   status: updatedCategory.status,
//     //   categoryImage: updatedCategory.avatar.url,
//     //   products: updatedCategory.products,
//     // };

//     res.status(200).send({
//       status: true,
//       message: "Category updated successfully",
//       response: updatedCategory,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       status: false,
//       error,
//       message: "Error in updating category",
//     });
//   }
// };
const updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { categoryName, status } = req.body;

    let updatedFields = { categoryName, status };

    if (req.file) {
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

//updateStatus
const toggleCategoryStatus = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await categoryModel.findById(categoryId);
    if (!category) {
      return res.status(404).send({
        status: false,
        message: "Category not found",
      });
    }
    const newStatus = category.status === "active" ? "inactive" : "active";
    const updatedCategory = await categoryModel.findByIdAndUpdate(
      categoryId,
      { $set: { status: newStatus } },
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
      message: "Category status updated successfully",
      response: [response],
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      error,
      message: "Error in updating category status",
    });
  }
};

// get all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryModel.find();

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

const getAllCategoriesForUser = async (req, res) => {
  try {
    const userId = req.data._id;
    let user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        status: false,
        message: "User not found",
        response: [],
      });
    } else {
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
    }
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
    const categories = await categoryModel.find().populate("products");

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
            status: product.status,
            foodType: product.foodType,
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

const getAllCategoriesWithProductsForUser = async (req, res) => {
  try {
    const userId = req.data._id;
    let user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        status: false,
        message: "User not found",
        response: [],
      });
    } else {
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
            const { avatar, ...rest } = product._doc;
            let cartProductStatus = 0;
            if (user.pendingCart.length > 0) {
              user.pendingCart[0].products.forEach((p) => {
                if (p.productId.toString() === product._id.toString()) {
                  cartProductStatus = 1;
                }
              });
            }

            return {
              ...rest,
              id: product._id,
              cartStatus: cartProductStatus,
              productName: product.name,
              price: product.price,
              description: product.description,
              productImage: avatar?.url || null,
              status: product.status,
              foodType: product.foodType,
            };
          }),
        };
      });

      res.status(200).send({
        status: true,
        message: "All Categories List",
        response,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      error,
      message: "Error while getting all categories",
    });
  }
};

// const getAllCategoriesWithProductsForUser = async (req, res) => {
//   try {
//     const categories = await categoryModel.find({status:"active"}).populate("products");

//     const response = categories.map((category) => {
//       return {
//         id: category._id,
//         categoryName: category.categoryName,
//         status: category.status,
//         categoryImage: category.avatar.url,
//         products: category.products.map((product) => {
//           return {
//             id: product._id,
//             cartStatus:product.cartStatus,
//             productName: product.name,
//             price: product.price,
//             description: product.description,
//             productImage: product.avatar.url,
//             status: product.status,
//             foodType: product.foodType,
//           };
//         }),
//       };
//     });

//     res.status(200).send({
//       status: true,
//       message: "All Categories List",
//       response,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       status: false,
//       error,
//       message: "Error while getting all categories",
//     });
//   }
// };
// const getAllCategoriesWithProductsForUser = async (req, res) => {
//   try {
//     // Get the user ID from the request object
//     const userId = req.user.id;

//     // Find all categories that are active and have at least one product
//     const categories = await categoryModel
//       .find({ status: "active", products: { $exists: true, $not: { $size: 0 } } })
//       .populate({
//         path: "products",
//         // Filter the products to show only those that the user has added to their cart
//         match: { cart: { $elemMatch: { user: userId } } },
//       });

//     const response = categories.map((category) => {
//       return {
//         id: category._id,
//         categoryName: category.categoryName,
//         status: category.status,
//         categoryImage: category.avatar.url,
//         products: category.products.map((product) => {
//           // Find the cart item for the user and product
//           const cartItem = product.cart.find((item) => item.user === userId);

//           return {
//             id: product._id,
//             cartStatus: cartItem ? cartItem.status : null,
//             productName: product.name,
//             price: product.price,
//             description: product.description,
//             productImage: product.avatar.url,
//             status: product.status,
//             foodType: product.foodType,
//           };
//         }),
//       };
//     });

//     res.status(200).send({
//       status: true,
//       message: "All Categories List",
//       response,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       status: false,
//       error,
//       message: "Error while getting all categories",
//     });
//   }
// };

// single category with all products
const getSingleCategoryWithProducts = async (req, res) => {
  try {
    const categoryId = req.params.id;

    const category = await categoryModel
      .findById(categoryId)
      .populate("products");

    if (!category) {
      return res.status(404).send({
        status: false,
        message: "Category not found",
      });
    }

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
          productImage: product.avatar.url,
          status: product.status,
          foodType: product.foodType,
        };
      }),
    };

    res.status(200).send({
      status: true,
      message: "Category details",
      response,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      error,
      message: "Error while getting category details",
    });
  }
};

const getSingleCategoryWithProductsForUser = async (req, res) => {
  try {
    const categoryId = req.params.id;

    const category = await categoryModel
      .findById(categoryId, { status: "active" })
      .populate({
        path: "products",
        match: { status: "active" },
      });

    if (!category) {
      return res.status(404).send({
        status: false,
        message: "Category not found",
      });
    }

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
          productImage: product.avatar.url,
          status: product.status,
          foodType: product.foodType,
        };
      }),
    };

    res.status(200).send({
      status: true,
      message: "Category details",
      response,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      error,
      message: "Error while getting category details",
    });
  }
};

//  single category with veg products
const getSingleCategoryWithVegProducts = async (req, res) => {
  try {
    const categoryId = req.params.id;

    const category = await categoryModel.findById(categoryId).populate({
      path: "products",
      match: { foodType: "veg" },
    });

    if (!category) {
      return res.status(404).send({
        status: false,
        message: "Category not found",
      });
    }

    const response = {
      id: category._id,
      categoryName: category.categoryName,
      status: category.status,
      categoryImage: category.avatar ? category.avatar.url : "",
      products: category.products.map((product) => {
        return {
          id: product._id,
          productName: product.name,
          price: product.price,
          description: product.description,
          productImage: product.avatar ? product.avatar.url : "",
          status: product.status,
          foodType: product.foodType,
        };
      }),
    };

    res.status(200).send({
      status: true,
      message: "Category details",
      response,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      error,
      message: "Error while getting category details",
    });
  }
};

const getSingleCategoryWithVegProductsForUser = async (req, res) => {
  try {
    const categoryId = req.params.id;

    const category = await categoryModel
      .findById(categoryId, { status: "active" })
      .populate({
        path: "products",
        match: { status: "active", foodType: "veg" },
      });

    if (!category) {
      return res.status(404).send({
        status: false,
        message: "Category not found",
      });
    }

    const response = {
      id: category._id,
      categoryName: category.categoryName,
      status: category.status,
      categoryImage: category.avatar ? category.avatar.url : "",
      products: category.products.map((product) => {
        return {
          id: product._id,
          productName: product.name,
          price: product.price,
          description: product.description,
          productImage: product.avatar ? product.avatar.url : "",
          status: product.status,
          foodType: product.foodType,
        };
      }),
    };

    res.status(200).send({
      status: true,
      message: "Category details",
      response,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      error,
      message: "Error while getting category details",
    });
  }
};

// single category with non veg products
const getSingleCategoryWithNonVegProducts = async (req, res) => {
  try {
    const categoryId = req.params.id;

    const category = await categoryModel.findById(categoryId).populate({
      path: "products",
      match: { foodType: "non-veg" },
    });

    if (!category) {
      return res.status(404).send({
        status: false,
        message: "Category not found",
      });
    }

    const response = {
      id: category._id,
      categoryName: category.categoryName,
      status: category.status,
      categoryImage: category.avatar ? category.avatar.url : "",
      products: category.products.map((product) => {
        return {
          id: product._id,
          productName: product.name,
          price: product.price,
          description: product.description,
          productImage: product.avatar ? product.avatar.url : "",
          status: product.status,
          foodType: product.foodType,
        };
      }),
    };

    res.status(200).send({
      status: true,
      message: "Category details",
      response,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      error,
      message: "Error while getting category details",
    });
  }
};

const getSingleCategoryWithNonVegProductsForUser = async (req, res) => {
  try {
    const categoryId = req.params.id;

    const category = await categoryModel
      .findById(categoryId, { status: "active" })
      .populate({
        path: "products",
        match: { status: "active", foodType: "non-veg" },
      });

    if (!category) {
      return res.status(404).send({
        status: false,
        message: "Category not found",
      });
    }

    const response = {
      id: category._id,
      categoryName: category.categoryName,
      status: category.status,
      categoryImage: category.avatar ? category.avatar.url : "",
      products: category.products.map((product) => {
        return {
          id: product._id,
          productName: product.name,
          price: product.price,
          description: product.description,
          productImage: product.avatar ? product.avatar.url : "",
          status: product.status,
          foodType: product.foodType,
        };
      }),
    };

    res.status(200).send({
      status: true,
      message: "Category details",
      response,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      error,
      message: "Error while getting category details",
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
  deleteCategory,
  toggleCategoryStatus,
  getSingleCategoryWithProducts,
  getSingleCategoryWithVegProducts,
  getSingleCategoryWithNonVegProducts,
  getAllCategoriesForUser,
  getAllCategoriesWithProductsForUser,
  getSingleCategoryWithProductsForUser,
  getSingleCategoryWithVegProductsForUser,
  getSingleCategoryWithNonVegProductsForUser,
};
