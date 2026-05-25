// server/controllers/adminController.js — Admin Analytics

const User    = require('../models/User');
const Product = require('../models/Product');
const Order   = require('../models/Order');

// GET /api/admin/stats
const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      revenueData,
      recentOrders,
      lowStockProducts,
      ordersByStatus,
      monthlySales,
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Product.countDocuments(),
      Order.countDocuments(),

      // Total revenue from non-cancelled orders
      Order.aggregate([
        { $match: { orderStatus: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } },
      ]),

      // Last 5 orders
      Order.find().sort('-createdAt').limit(5).populate('user', 'name email'),

      // Low stock products (≤ 5)
      Product.find({ stock: { $lte: 5 } }).select('name stock images').limit(10),

      // Orders grouped by status
      Order.aggregate([
        { $group: { _id: '$orderStatus', count: { $sum: 1 } } },
      ]),

      // Monthly sales last 6 months
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000) },
            orderStatus: { $ne: 'cancelled' },
          },
        },
        {
          $group: {
            _id: {
              year:  { $year:  '$createdAt' },
              month: { $month: '$createdAt' },
            },
            revenue: { $sum: '$totalPrice' },
            orders:  { $sum: 1 },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]),
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue: revenueData[0]?.total || 0,
      },
      recentOrders,
      lowStockProducts,
      ordersByStatus,
      monthlySales,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDashboardStats };
