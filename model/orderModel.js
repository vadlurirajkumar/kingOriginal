const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      price: {
        type: Number,
      },
      quantity: {
        type: Number,
        default: 1
      }
    }
  ],
  status: {
    type: String,
    enum: ['InCart', 'Processing', 'Shipped', 'Delivered'],
    default: 'InCart'
  }
});

module.exports = mongoose.model('Order', orderSchema);
