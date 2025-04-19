// controllers/wishlistController.js
const Wishlist = require('../models/wishlistModel');
const Product = require('../models/productModel');

// Get user wishlist
exports.getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user.id }).populate('items.product');
    
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user.id });
    }
    
    res.status(200).json({
      success: true,
      data: wishlist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Add item to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    let wishlist = await Wishlist.findOne({ user: req.user.id });
    
    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user.id,
        items: [{ product: productId }]
      });
    } else {
      // Check if product is in wishlist
      const itemExists = wishlist.items.find(
        item => item.product.toString() === productId
      );
      
      if (itemExists) {
        return res.status(400).json({
          success: false,
          message: 'Item already in wishlist'
        });
      }
      
      // Add new item
      wishlist.items.push({ product: productId });
      await wishlist.save();
    }
    
    await wishlist.populate('items.product');
    
    res.status(200).json({
      success: true,
      data: wishlist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Remove item from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const productId = req.params.id;
    
    let wishlist = await Wishlist.findOne({ user: req.user.id });
    
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found'
      });
    }
    
    wishlist.items = wishlist.items.filter(
      item => item.product.toString() !== productId
    );
    
    await wishlist.save();
    await wishlist.populate('items.product');
    
    res.status(200).json({
      success: true,
      data: wishlist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};