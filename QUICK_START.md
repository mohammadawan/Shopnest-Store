# 🚀 MongoDB Connection - Quick Start

## ✅ What's Done

Your ShopNest backend is now fully connected to MongoDB with all models properly configured!

### 🔄 Files Created/Updated:
- ✅ `server/models/index.js` - Centralized model imports
- ✅ `server/.env.example` - Environment variables template
- ✅ `server/config/dbVerification.js` - Database verification utilities
- ✅ `server/models/README.md` - Complete model usage guide
- ✅ `server/config/db.js` - Enhanced connection configuration
- ✅ `server/server.js` - Model imports & verification
- ✅ `MONGODB_SETUP.md` - Comprehensive setup guide

---

## 🎯 Next Steps

### 1️⃣ Start MongoDB
```bash
# Windows: Make sure MongoDB Service is running in Services
# Or start it with:
net start MongoDB

# Docker: If using Docker
docker run -d -p 27017:27017 --name shopnest-mongo mongo:latest
```

### 2️⃣ Update Environment Variables
```bash
cd server
# .env file should have:
MONGODB_URI=mongodb://127.0.0.1:27017/shopnest
```

### 3️⃣ Install & Run Server
```bash
# Install dependencies (if not done)
npm install

# Run development server
npm run dev
```

### 4️⃣ Expected Output
```
✅ MongoDB Connected Successfully!
   Host: 127.0.0.1
   Database: shopnest
   Connection State: Connected

📋 Registered Models:
   ✓ User
   ✓ Product
   ✓ Category
   ✓ Order
   ✓ Cart
   ✓ Review

🚀 ShopNest Server running on port 5000
```

---

## 📚 Database Models

| Model | Description |
|-------|-------------|
| **User** | User accounts & authentication |
| **Product** | Product catalog & inventory |
| **Category** | Product categories |
| **Order** | Order history & tracking |
| **Cart** | Shopping cart items |
| **Review** | Product reviews & ratings |

---

## 📖 Detailed Guides

- **[MONGODB_SETUP.md](./MONGODB_SETUP.md)** - Full installation & troubleshooting guide
- **[server/models/README.md](./server/models/README.md)** - Complete model reference with examples

---

## 🧪 Test the Connection

```bash
# Test API health
curl http://localhost:5000/api/health

# Expected response:
# {"status":"ShopNest API is running 🚀","timestamp":"..."}
```

---

## 📋 Model Relationships

```
User
├── wishlist[] → Product
├── orders[] → Order
└── addresses[] (embedded)

Product
├── category → Category
├── seller → User
└── reviews[] → Review

Order
├── user → User
├── orderItems[] → Product
└── shippingAddress (embedded)

Cart
├── user → User
└── items[] → Product

Review
├── user → User
├── product → Product
└── images[] (embedded)

Category
└── parent → Category (subcategories)
```

---

## 🔧 Troubleshooting

### MongoDB Not Running?
```bash
# Check if MongoDB service is running
# Windows Services > MongoDB Server should show "Running"

# Or restart it:
net stop MongoDB
net start MongoDB
```

### Connection Error?
- Check `.env` has correct `MONGODB_URI`
- Verify MongoDB is listening on port 27017
- Check firewall isn't blocking port 27017

### Models Not Loaded?
- Server.js now imports all models automatically
- If you get model errors, check logs for initialization issues

---

## 💡 Usage Examples

### In Your Controllers:

```javascript
// Option 1: Direct import
const User = require('../models/User');

// Option 2: Use centralized index
const { User, Product, Order } = require('../models');

// Create user
const user = await User.create({ name, email, password });

// Find product with category
const product = await Product.findById(id).populate('category');

// Get user's orders
const orders = await Order.find({ user: userId });
```

For more examples, see [server/models/README.md](./server/models/README.md)

---

## ✨ Features Included

✅ Mongoose ODM integration
✅ Connection pooling for performance
✅ Automatic connection monitoring
✅ Development logging support
✅ Model validation
✅ Pre/post hooks for auto-calculations
✅ Indexed fields for faster queries
✅ Virtual fields for computed values

---

**Status: Ready to use! 🎉**

Start the server and begin building! All models are connected and ready to handle your e-commerce data.

For issues or questions, refer to [MONGODB_SETUP.md](./MONGODB_SETUP.md) or [server/models/README.md](./server/models/README.md)
