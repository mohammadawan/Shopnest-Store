// controllers/orderController.js — Order Logic

const Order = require('../models/Order');
const Cart  = require('../models/Cart');
const Product = require('../models/Product');

// ── Place Order ─────────────────────────────
const placeOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod, notes } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty.' });
    }

    // Build order items
    const orderItems = cart.items.map((item) => ({
      product:  item.product._id,
      name:     item.product.name,
      image:    item.product.images[0]?.url || '',
      price:    item.price,
      quantity: item.quantity,
    }));

    const itemsPrice    = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const shippingPrice = itemsPrice > 2000 ? 0 : 150; // Free shipping over 2000 PKR
    const taxPrice      = Math.round(itemsPrice * 0.05); // 5% tax
    const totalPrice    = itemsPrice + shippingPrice + taxPrice;

    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'cod',
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      notes: notes || '',
    });

    // Reduce stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity },
      });
    }

    // Clear cart after order
    await Cart.findOneAndDelete({ user: req.user._id });

    res.status(201).json({ success: true, message: 'Order placed successfully!', order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Get My Orders ───────────────────────────
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort('-createdAt')
      .populate('orderItems.product', 'name images');

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Get Single Order ────────────────────────
const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

    // Only owner or admin can view
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Get All Orders (Admin) ──────────────────
const getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = status ? { orderStatus: status } : {};

    const [orders, total] = await Promise.all([
      Order.find(query)
        .sort('-createdAt')
        .populate('user', 'name email')
        .skip((page - 1) * limit)
        .limit(Number(limit)),
      Order.countDocuments(query),
    ]);

    // Revenue stats
    const revenue = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);

    res.json({
      success: true,
      orders,
      total,
      revenue: revenue[0]?.total || 0,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Update Order Status (Admin) ─────────────
const updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingNumber } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

    order.orderStatus = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (status === 'delivered') {
      order.deliveredAt = new Date();
      order.paymentStatus = 'paid';
    }

    await order.save();
    res.json({ success: true, message: 'Order status updated.', order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { placeOrder, getMyOrders, getOrder, getAllOrders, updateOrderStatus };
