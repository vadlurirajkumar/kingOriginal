const productModel = require("../model/productModel");
const categoryModel = require("../model/categoryModel")
const cloudinary = require("cloudinary");
const User = require("../model/usermodel");

// create a product
const createProduct = async (req, res) => {
  try {
    const { productName, description, price, categoryId, foodType } = req.body;
    console.log(productName, description, price, categoryId, foodType);
    if (!productName || !description || !price || !categoryId || !foodType) {
      const response = {
        status: false,
        message: "All fields are required",
      };
      return res.status(401).send(response);
    }
    const existingProduct = await productModel.findOne({ productName });
    if (existingProduct) {
      const response = {
        status: false,
        message: "Product already exists",
      };
      return res.status(200).send(response);
    }
    const result = await cloudinary.v2.uploader.upload(req.file.path);
    if (!result) {
      const response = {
        status: false,
        message: "Error while uploading image",
      };
      return res.status(500).json(response);
    }
    const product = await new productModel({
      productName,
      description,
      price,
      categoryId,
      status: "active",
      foodType,
      avatar: {
        public_id: result.public_id,
        url: result.secure_url,
      },
    }).save();
    await categoryModel.findByIdAndUpdate(
      categoryId,
      {
        $push: { products: product },
      },
      { new: true }
    );
    const { avatar, ...rest } = product._doc;

    const response = {
      status: true,
      message: "Product created successfully",
      product: {
        categoryId,
        productImage:product.avatar.url,
        ...rest,
      },
    };
    res.status(201).send(response);
  } catch (error) {
    console.log(error);
    const response = {
      status: false,
      error,
      message: "Error in creating product",
    };
    res.status(500).send(response);
  }
};

// get all products
const getAllProducts = async (req, res) => {
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
      const products = await productModel.find();
      res.status(200).send({
        status: true,
        message: "All Products List",
        products: products.map((product) => {
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
            productImage: avatar?.url || null,
            cartStatus: cartProductStatus,
          };
        }),
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      error,
      message: "Error while getting all products",
    });
  }
};

//get all products for admin
const getAllProductsForAdmin = async (req, res) => {
  try {
      const products = await productModel.find();
      res.status(200).send({
        status: true,
        message: "All Products List",
        products: products.map((product) => {
          const { avatar, ...rest } = product._doc;
          return {
            ...rest,
            productImage: avatar?.url || null,
          };
        }),
      });
    }
   catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      error,
      message: "Error while getting all products",
    });
  }
};

//get single product
const getSingleProduct = async (req, res) => {
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
      const product = await productModel.findById(req.params.id);
      const name = product.productName;
      let cartProductStatus = 0;
      if (user.pendingCart.length > 0) {
        user.pendingCart[0].products.forEach((p) => {
          if (p.productId.toString() === product._id.toString()) {
            cartProductStatus = 1;
          }
        });
      }
      if (product && product.status === "active") {
        const response = {
          id: product._id,
          cartStatus: cartProductStatus,
          productName: product.productName,
          description: product.description,
          price: product.price,
          categoryId: product.categoryId,
          status: product.status,
          foodType: product.foodType,
          productImage: product.avatar?.url || null,
        };
        return res.status(200).send({
          status: true,
          message: "Get Single product successfully",
          product: response,
        });
      } else if (product && product.status === "inactive") {
        return res.status(200).send({
          status: false,
          message: `product - ${name} is inactive, please contact admin to activate it`,
        });
      } else {
        return res.status(404).send({
          status: false,
          message: "product not found",
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      error,
      message: "Error while getting Single product",
    });
  }
};

//get single product for admin
const getSingleProductForAdmin = async (req, res) => {
  try {
      const product = await productModel.findById(req.params.id);
      const name = product.productName;
        const response = {
          id: product._id,
          productName: product.productName,
          description: product.description,
          price: product.price,
          categoryId: product.categoryId,
          status: product.status,
          exclusiveStatus:product.exclusiveStatus,
          foodType: product.foodType,
          productImage: product.avatar?.url || null,
        };
        return res.status(200).send({
          status: true,
          message: "Get Single product successfully",
          product: response,
        });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      error,
      message: "Error while getting Single product",
    });
  }
};
//get all veg products
const getAllVegProducts = async (req, res) => {
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
      const products = await productModel.find({ foodType: "veg" });
      res.status(200).send({
        status: true,
        message: "All Veg Products List",
        products: products.map((product) => {
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
            productImage: avatar?.url || null,
            cartStatus: cartProductStatus,
          };
        }),
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      error,
      message: "Error while getting all veg products",
    });
  }
};

//get all non-veg products
const getAllNonVegProducts = async (req, res) => {
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
      const products = await productModel.find({ foodType: "non-veg" });
      res.status(200).send({
        status: true,
        message: "All Veg Products List",
        products: products.map((product) => {
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
            productImage: avatar?.url || null,
            cartStatus: cartProductStatus,
          };
        }),
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      error,
      message: "Error while getting all non-veg products",
    });
  }
};

// update a product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { productName, description, price, categoryId, foodType, status } = req.body;
    const fieldsToUpdate = {};
    if (productName) fieldsToUpdate.productName = productName;
    if (description) fieldsToUpdate.description = description;
    if (price) fieldsToUpdate.price = price;
    if (categoryId) fieldsToUpdate.categoryId = categoryId;
    if (foodType) fieldsToUpdate.foodType = foodType;
    if (req.file) {
      const result = await cloudinary.v2.uploader.upload(req.file.path);
      if (!result) {
        return res.status(500).json({
          status: false,
          message: "Error while uploading image",
        });
      }
      fieldsToUpdate.avatar = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }
    if (status) fieldsToUpdate.status = status;
    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      fieldsToUpdate,
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({
        status: false,
        message: "Product not found",
      });
    }
    const { avatar, ...rest } = updatedProduct._doc;
    return res.status(200).json({
      status: true,
      message: "Product updated successfully",
      product: {
        ...rest,
        productImage: avatar?.url || null
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      error,
      message: "Error in updating product",
    });
  }
};

//update status
const toggleProductStatus = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).send({
        status: false,
        message: "Product not found",
      });
    }
    const newStatus = product.status === "active" ? "inactive" : "active";
    const updatedProduct = await productModel.findByIdAndUpdate(
      productId,
      { $set: { status: newStatus } },
      { new: true }
    );
    const { avatar, ...rest } = updatedProduct._doc;
    const response = {
      id: updatedProduct._id,
      productName: updatedProduct.productName,
      description: updatedProduct.description,
      price: updatedProduct.price,
      categoryId: updatedProduct.categoryId,
      foodType: updatedProduct.foodType,
      status: updatedProduct.status,
      productImage: avatar?.url || null,
    };
    res.status(200).send({
      status: true,
      message: "Product status updated successfully",
      response: [response],
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      error,
      message: "Error in updating product status",
    });
  }
};

// delete a product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await productModel.findByIdAndDelete(id);
    res.status(200).send({
      status: true,
      message: "product Deleted sucessfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      message: "error while product category",
      error,
    });
  }
};

//add to exclusive dishes status
const addToExclusiveDish = async (req, res) => {
  try {
    const { id } = req.params;

    // check if product exists
    const product = await productModel.findByIdAndUpdate(id);
    if (!product) {
      const response = {
        status: false,
        message: "Product not found",
      };
      return res.status(404).send(response);
    }

    // update product exclusive status
    product.exclusiveStatus = "active";
    await product.save();

    const { avatar, ...rest } = product._doc;

    const response = {
      status: true,
      message: "Product added to exclusive dish",
      product: {
        ...rest,
        productImage: avatar?.url || null,
      },
    };
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    const response = {
      status: false,
      error,
      message: "Error while adding product to exclusive dish",
    };
    res.status(500).send(response);
  }
};

//remove from exclusive dishes 
const removeFromExclusiveDish = async (req, res) => {
  try {
    const { id } = req.params;

    // check if product exists
    const product = await productModel.findByIdAndUpdate(id);
    if (!product) {
      const response = {
        status: false,
        message: "Product not found",
      };
      return res.status(404).send(response);
    }

    // update product exclusive status
    product.exclusiveStatus = "inactive";
    await product.save();

    const { avatar, ...rest } = product._doc;

    const response = {
      status: true,
      message: "Product removed from exclusive dish",
      product: {
        ...rest,
        productImage: avatar?.url || null,
      },
    };
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    const response = {
      status: false,
      error,
      message: "Error while removing product to exclusive dish",
    };
    res.status(500).send(response);
  }
};

// get exclusive dishes 
const getExclusiveDishes = async (req, res) => {
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
      const products = await productModel.find({status:"active",exclusiveStatus:"active"});
      res.status(200).send({
        status: true,
        message: "Exclusive Dishes List",
        products: products.map((product) => {
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
            productImage: avatar?.url || null,
            cartStatus: cartProductStatus,
          };
        }),
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      error,
      message: "Error while getting exclusive dishes",
    });
  }
};

//get e-- dishes for admin
const getExclusiveDishesForAdmin = async (req, res) => {
  try {
      const products = await productModel.find({status:"active",exclusiveStatus:"active"});
      res.status(200).send({
        status: true,
        message: "Exclusive Dishes List",
        products: products.map((product) => {
          const { avatar, ...rest } = product._doc;
          return {
            ...rest,
            productImage: avatar?.url || null,
          };
        }),
      });
    }
   catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      error,
      message: "Error while getting exclusive dishes",
    });
  }
};

// get exclusive dishes only veg
const getExclusiveVegDishes = async (req, res) => {
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
      const products = await productModel.find({
        status: "active",
        exclusiveStatus: "active",
        foodType: "veg",
      });
      res.status(200).send({
        status: true,
        message: "All Products List",
        products: products.map((product) => {
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
            productImage: avatar?.url || null,
            cartStatus: cartProductStatus,
          };
        }),
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      error,
      message: "Error while getting all products",
    });
  }
};

// get exclusive dishes only non-veg
const getExclusiveNonVegDishes = async (req, res) => {
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
      const products = await productModel.find({
        status: "active",
        exclusiveStatus: "active",
        foodType: "non-veg",
      });
      res.status(200).send({
        status: true,
        message: "All Products List",
        products: products.map((product) => {
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
            productImage: avatar?.url || null,
            cartStatus: cartProductStatus,
          };
        }),
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      error,
      message: "Error while getting all products",
    });
  }
};




module.exports = {createProduct, getAllProducts,getAllProductsForAdmin, getSingleProduct,getSingleProductForAdmin, getAllVegProducts, getAllNonVegProducts, updateProduct, deleteProduct, toggleProductStatus, addToExclusiveDish, removeFromExclusiveDish,getExclusiveDishes,getExclusiveDishesForAdmin,getExclusiveVegDishes,getExclusiveNonVegDishes}