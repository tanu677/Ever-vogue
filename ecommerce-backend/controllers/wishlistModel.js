// models/wishlistModel.js
const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      }
    }
  ],
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Wishlist', wishlistSchema);