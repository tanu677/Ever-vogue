const express = require('express');
const router = express.Router();
const { getOrders, createOrder, getOrder } = require('../controllers/orderController');
const { protect } = require('../middlewares/auth');

router.route('/')
  .get(protect, getOrders)
  .post(protect, createOrder);

router.get('/:id', protect, getOrder);

module.exports = router;