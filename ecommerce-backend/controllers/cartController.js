const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

// Get user cart
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    console.log('Cart fetched for user:', req.user.id, 'Cart:', cart);
    
    if (!cart) {
      cart = await Cart.create({ user: req.user.id });
      console.log('New cart created for user:', req.user.id);
    }
    
    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    console.error('Error in getCart:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Add item to cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    let cart = await Cart.findOne({ user: req.user.id });
    console.log('Cart before add/update:', cart);
    
    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: [{ product: productId, quantity }]
      });
      console.log('New cart created:', cart);
    } else {
      // Check if product is in cart
      const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
      
      if (itemIndex > -1) {
        // Update quantity
        cart.items[itemIndex].quantity = quantity;
      } else {
        // Add new item
        cart.items.push({ product: productId, quantity });
      }
      
      await cart.save();
      console.log('Cart after add/update:', cart);
    }
    
    await cart.populate('items.product', 'name price');
    
    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    console.error('Error in addToCart:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const productId = req.params.id;
    
    let cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }
    
    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    
    await cart.save();
    await cart.populate('items.product', 'name price');
    
    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};