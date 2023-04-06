const mongoose = require('mongoose');

const { Schema } = mongoose;

const productSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Products',
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
  },
  price: {
    type: Number,
    required: true,
  },
});

const cartSchema = new Schema(
  {
    buyer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    products: [productSchema],
    totalAmount:{
      type:Number
    },
    status: {
      type: String,
      enum: ["inCart", "ordered", "failed"],
      default: "inCart", // Set the default value for the status field to "active"
    },
  },

  { timestamps: true }
);

cartSchema.methods.addQuantity = async function (productId) {
  const productIndex = this.products.findIndex(
    (p) => p.product.toString() === productId
  );

  if (productIndex !== -1) {
    this.products[productIndex].quantity += 1;
    await this.save();
  }
};

cartSchema.methods.removeQuantity = async function (productId) {
  const productIndex = this.products.findIndex(
    (p) => p.product.toString() === productId
  );

  if (productIndex !== -1) {
    const product = this.products[productIndex];

    if (product.quantity > 1) {
      product.quantity -= 1;
      await this.save();
    } else {
      this.products.splice(productIndex, 1);
      await this.save();
    }
  }
};


const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
