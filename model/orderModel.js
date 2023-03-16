// const mongoose = require('mongoose');

// const orderSchema = new mongoose.Schema({
//   buyer: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   products: [
//     {
//       product: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Product',
//         required: true
//       },
//       price: {
//         type: Number,
//       },
//       quantity: {
//         type: Number,
//         default: 1
//       }
//     }
//   ],
//   status: {
//     type: String,
//     enum: ['InCart', 'Processing', 'Shipped', 'Delivered'],
//     default: 'InCart'
//   }
// });

// module.exports = mongoose.model('Order', orderSchema);


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
    default: 1,
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
      type:String
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
