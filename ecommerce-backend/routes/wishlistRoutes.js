// routes/wishlistRoutes.js
const express = require('express');
const router = express.Router();
const { getWishlist, addToWishlist, removeFromWishlist } = require('../controllers/wishlistController');
const { protect } = require('../middlewares/auth');

router.route('/')
  .get(protect, getWishlist)
  .post(protect, addToWishlist);

router.delete('/:id', protect, removeFromWishlist);

module.exports = router;