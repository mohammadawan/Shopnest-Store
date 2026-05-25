// ============================================
// server.js — ShopNest API Entry Point
// ============================================

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { verifyConnection, enableLogging } = require('./config/dbVerification');

// Load env vars
dotenv.config();

// ── Import All Models (to register them with Mongoose) ────────────
require('./models/User');
require('./models/Product');
require('./models/Category');
require('./models/Order');
require('./models/Cart');
require('./models/Review');

// Connect to MongoDB
connectDB();

// Verify connection in development
if (process.env.NODE_ENV === 'development') {
  setTimeout(() => verifyConnection(), 1000);
  enableLogging();
}

const app = express();

// ── Middleware ──────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Serve local uploads when Cloudinary isn't configured
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Routes ──────────────────────────────────
app.use('/api/auth',     require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/cart',     require('./routes/cartRoutes'));
app.use('/api/orders',   require('./routes/orderRoutes'));
app.use('/api/reviews',  require('./routes/reviewRoutes'));
app.use('/api/wishlist', require('./routes/wishlistRoutes'));
app.use('/api/users',    require('./routes/userRoutes'));
app.use('/api/upload',   require('./routes/uploadRoutes'));
app.use('/api/admin',    require('./routes/adminRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ShopNest API is running 🚀', timestamp: new Date() });
});

// ── Error Handling Middleware ────────────────
app.use(require('./middleware/errorMiddleware'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Start Server ────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 ShopNest Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 API: http://localhost:${PORT}/api\n`);
});
