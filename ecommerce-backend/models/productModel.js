const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  category: {
    type: String,
    default: 'General'
  },
  price: {
    type: Number,
    required: [true, 'Please add a price']
  },
  oldPrice: {
    type: Number,
    default: 0
  },
  image: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: ''
  },
  stock: {
    type: Number,
    required: [true, 'Please add stock quantity'],
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);
