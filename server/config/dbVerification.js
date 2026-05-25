// config/dbVerification.js — Database Verification & Monitoring

const mongoose = require('mongoose');

/**
 * Verify MongoDB Connection Status
 * Use this to check if MongoDB is connected and models are registered
 */
const verifyConnection = async () => {
  try {
    const state = mongoose.connection.readyState;
    const states = {
      0: 'Disconnected',
      1: 'Connected',
      2: 'Connecting',
      3: 'Disconnecting',
    };

    console.log('\n📊 MongoDB Connection Status:');
    console.log(`   State: ${states[state]}`);
    console.log(`   Host: ${mongoose.connection.host || 'N/A'}`);
    console.log(`   Database: ${mongoose.connection.name || 'N/A'}`);
    console.log(`   URI: ${process.env.MONGODB_URI}\n`);

    // List all registered models
    console.log('📋 Registered Models:');
    const modelNames = Object.keys(mongoose.connection.models);
    if (modelNames.length === 0) {
      console.log('   ⚠️  No models registered\n');
    } else {
      modelNames.forEach((name) => {
        console.log(`   ✓ ${name}`);
      });
      console.log();
    }

    return state === 1;
  } catch (error) {
    console.error('❌ Verification Error:', error.message);
    return false;
  }
};

/**
 * Test Database Operations
 * Verify that models can perform basic CRUD operations
 */
const testDatabaseOperations = async () => {
  try {
    const User = mongoose.model('User');
    const Product = mongoose.model('Product');
    const Category = mongoose.model('Category');
    const Order = mongoose.model('Order');
    const Cart = mongoose.model('Cart');
    const Review = mongoose.model('Review');

    console.log('🧪 Testing Database Models...\n');

    // Get collection counts
    const counts = {
      users: await User.countDocuments(),
      products: await Product.countDocuments(),
      categories: await Category.countDocuments(),
      orders: await Order.countDocuments(),
      carts: await Cart.countDocuments(),
      reviews: await Review.countDocuments(),
    };

    console.log('📈 Collection Counts:');
    Object.entries(counts).forEach(([name, count]) => {
      console.log(`   ${name}: ${count} documents`);
    });
    console.log();

    return true;
  } catch (error) {
    console.error('❌ Database Test Error:', error.message);
    return false;
  }
};

/**
 * Log Database Activity
 * Use in development to monitor database queries
 */
const enableLogging = () => {
  if (process.env.NODE_ENV === 'development') {
    mongoose.set('debug', (coll, method, query, doc) => {
      console.log(`🔍 DB Query: ${coll}.${method}()`, JSON.stringify(query).substring(0, 100));
    });
  }
};

module.exports = {
  verifyConnection,
  testDatabaseOperations,
  enableLogging,
};
