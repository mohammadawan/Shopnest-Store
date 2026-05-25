// config/db.js — MongoDB Connection

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Connection options for better reliability
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`\n✅ MongoDB Connected Successfully!`);
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
    console.log(`   Connection State: ${conn.connection.readyState === 1 ? 'Connected' : 'Disconnected'}\n`);

    // Connection event listeners
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB Disconnected');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB Connection Error:', err.message);
    });

    return conn;
  } catch (error) {
    console.error(`\n❌ MongoDB Connection Failed!`);
    console.error(`   Error: ${error.message}`);
    console.error(`   URI: ${process.env.MONGODB_URI}\n`);
    process.exit(1);
  }
};

module.exports = connectDB;
