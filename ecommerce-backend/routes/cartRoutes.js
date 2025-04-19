const express = require('express');
const router = express.Router();
const { getCart, addToCart, removeFromCart } = require('../controllers/cartController');
const { protect } = require('../middlewares/auth');

router.route('/')
  .get(protect, getCart)
  .post(protect, addToCart);

router.delete('/:id', protect, removeFromCart);

module.exports = router;