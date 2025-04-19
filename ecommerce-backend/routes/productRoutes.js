const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect } = require('../middlewares/auth');

// Product routes
router.get('/', productController.getProducts);
router.get('/:id', productController.getProduct);
router.post('/', protect, productController.createProduct);
router.put('/:id', protect, productController.updateProduct);
router.delete('/:id', protect, productController.deleteProduct);

module.exports = router;
