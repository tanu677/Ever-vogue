const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');

// Get user orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate('items.product', 'name price');
    
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create order from cart
exports.createOrder = async (req, res) => {
  try {
    // Find user's cart
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }
    
    // Calculate total price
    let totalPrice = 0;
    const orderItems = cart.items.map(item => {
      totalPrice += item.product.price * item.quantity;
      
      return {
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price
      };
    });
    
    // Create order
    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      totalPrice
    });
    
    // Clear cart
    cart.items = [];
    await cart.save();
    
    await order.populate('items.product', 'name price');
    
    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single order
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product', 'name price');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Check if order belongs to user
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }
    
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};