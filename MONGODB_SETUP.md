# MongoDB Setup & Connection Guide

## Overview
ShopNest uses **MongoDB** with **Mongoose ODM** for data persistence. All models are properly configured and connected to the backend server.

## 🗂️ Database Structure

### Collections (Models)

| Model | File | Description |
|-------|------|-------------|
| **User** | `models/User.js` | User accounts, authentication, profiles |
| **Product** | `models/Product.js` | Product catalog, inventory, pricing |
| **Category** | `models/Category.js` | Product categories and subcategories |
| **Order** | `models/Order.js` | Order history and order tracking |
| **Cart** | `models/Cart.js` | Shopping cart items |
| **Review** | `models/Review.js` | Product reviews and ratings |

---

## 🔧 Installation & Setup

### 1. Install MongoDB

#### Option A: Local MongoDB (Windows)
```bash
# Download MongoDB Community Edition
# https://www.mongodb.com/try/download/community

# After installation, MongoDB runs as a Windows Service
# Verify it's running:
# Services > MongoDB Server (should show "Running")
```

#### Option B: MongoDB Atlas Cloud (Recommended for Production)
```bash
# 1. Visit: https://www.mongodb.com/cloud/atlas
# 2. Create a free account
# 3. Create a new cluster
# 4. Get connection string (looks like):
# mongodb+srv://username:password@cluster.mongodb.net/shopnest?retryWrites=true&w=majority
```

#### Option C: Docker (Easy Alternative)
```bash
# Pull and run MongoDB Docker container
docker run -d -p 27017:27017 --name shopnest-mongo mongo:latest

# Verify connection
docker exec shopnest-mongo mongosh
```

---

## ⚙️ Configuration

### 1. Set Environment Variables

Create/update `.env` file in `server/` directory:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://127.0.0.1:27017/shopnest
# OR for MongoDB Atlas:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shopnest?retryWrites=true&w=majority

# Other configs
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars
JWT_EXPIRE=7d
```

### 2. Copy from Example
```bash
cp server/.env.example server/.env
# Then edit server/.env with your actual MongoDB URI
```

---

## 🚀 Starting the Server

### Install Dependencies
```bash
cd server
npm install
```

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Expected Output
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
📊 Environment: development
🔗 API: http://localhost:5000/api
```

---

## 🧪 Verification

### 1. Test Connection via API
```bash
# Health check endpoint
curl http://localhost:5000/api/health

# Response:
# {"status":"ShopNest API is running 🚀","timestamp":"2024-01-15T10:30:00.000Z"}
```

### 2. Use MongoDB Compass (GUI)
- Download: [MongoDB Compass](https://www.mongodb.com/products/tools/compass)
- Connection: `mongodb://127.0.0.1:27017`
- View all collections and data visually

### 3. Use MongoDB Shell
```bash
# Local
mongosh

# Or connect to specific database
mongosh "mongodb://127.0.0.1:27017/shopnest"

# List collections
show collections

# View users
db.users.find()

# View products
db.products.find()
```

---

## 📝 Model Relationships

```
User
├── addresses[] (embedded)
├── wishlist[] -> Product._id
├── avatar (embedded)
└── timestamps

Product
├── category -> Category._id
├── seller -> User._id
├── images[] (embedded)
├── specifications[] (embedded)
└── timestamps

Category
├── parent -> Category._id (for subcategories)
└── timestamps

Order
├── user -> User._id
├── orderItems[]
│   └── product -> Product._id
├── shippingAddress (embedded)
└── timestamps

Cart
├── user -> User._id (unique)
├── items[]
│   └── product -> Product._id
└── timestamps

Review
├── user -> User._id
├── product -> Product._id
├── images[] (embedded)
└── timestamps
```

---

## 🔍 Troubleshooting

### ❌ MongoDB Connection Failed

**Problem:** `❌ MongoDB Connection Failed! Error: connect ECONNREFUSED 127.0.0.1:27017`

**Solutions:**
1. Ensure MongoDB is running
   ```bash
   # Windows: Check Services > MongoDB Server
   # Mac: brew services list | grep mongodb
   # Linux: sudo systemctl status mongod
   ```

2. Check MongoDB URI in `.env`
   ```env
   MONGODB_URI=mongodb://127.0.0.1:27017/shopnest
   ```

3. Verify port 27017 is not blocked
   ```bash
   # Windows
   netstat -an | findstr :27017
   ```

4. Restart MongoDB service
   ```bash
   # Windows
   net stop MongoDB
   net start MongoDB
   ```

---

### ❌ Models Not Registered

**Problem:** `Mongoose Deprecated... Model.(...) is deprecated... name not found`

**Solution:** Make sure all models are imported in `server.js`:
```javascript
require('./models/User');
require('./models/Product');
require('./models/Category');
require('./models/Order');
require('./models/Cart');
require('./models/Review');
```

---

### ❌ Connection Timeout

**Problem:** Takes too long to connect or times out

**Solutions:**
1. Check network connectivity
2. For MongoDB Atlas, whitelist your IP:
   - Go to Atlas Dashboard > Network Access
   - Add your IP (or 0.0.0.0/0 for development)

3. Increase timeout in `config/db.js`:
   ```javascript
   serverSelectionTimeoutMS: 10000, // 10 seconds
   ```

---

## 📊 Database Maintenance

### Backup Database
```bash
# Local MongoDB
mongodump --uri="mongodb://127.0.0.1:27017/shopnest"

# MongoDB Atlas (automatic daily backups included)
```

### Restore Database
```bash
mongorestore --uri="mongodb://127.0.0.1:27017/shopnest" ./dump/shopnest
```

### Drop Database (Development Only!)
```bash
mongosh
use shopnest
db.dropDatabase()
```

---

## 🌱 Seeding Sample Data

```bash
cd server
npm run seed
```

This will populate the database with sample products, categories, and users for testing.

---

## 📚 Useful Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [MongoDB Atlas Guide](https://www.mongodb.com/docs/atlas/)
- [MongoDB Shell (mongosh)](https://www.mongodb.com/docs/mongodb-shell/)

---

## ✅ Checklist

- [ ] MongoDB installed and running
- [ ] `.env` file created with correct `MONGODB_URI`
- [ ] Dependencies installed (`npm install`)
- [ ] Server starts without connection errors
- [ ] All models are registered
- [ ] Health check API responds
- [ ] Can view collections in MongoDB Compass
- [ ] Sample data seeded (optional)

---

**Last Updated:** January 2024  
**MongoDB Version:** 4.4+  
**Mongoose Version:** ^8.0.3
