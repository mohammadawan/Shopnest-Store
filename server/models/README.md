// models/README.md — Models Quick Reference

# ShopNest MongoDB Models

## 📦 Importing Models

### Option 1: Direct Import (Most Common)
```javascript
const User = require('../models/User');
const Product = require('../models/Product');
```

### Option 2: Centralized Import
```javascript
const { User, Product, Category, Order, Cart, Review } = require('../models');
```

---

## 👤 User Model

### Schema Fields
- `name` - User's full name (required, max 50 chars)
- `email` - Email address (required, unique)
- `password` - Hashed password (required, min 6 chars)
- `role` - 'user' or 'admin' (default: 'user')
- `avatar` - Profile picture { public_id, url }
- `phone` - Phone number
- `addresses[]` - Array of shipping addresses
- `wishlist[]` - Array of Product IDs
- `isActive` - Account status (default: true)
- `lastLogin` - Last login timestamp
- `resetPasswordToken` - For password reset
- `resetPasswordExpire` - Token expiration

### Example Usage

```javascript
// Create new user
const user = await User.create({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'securePassword123',
});

// Find user by email
const user = await User.findOne({ email: 'john@example.com' });

// Find user by ID and populate wishlist
const user = await User.findById(userId).populate('wishlist');

// Update user profile
const user = await User.findByIdAndUpdate(
  userId,
  { name: 'John Updated', phone: '03001234567' },
  { new: true, runValidators: true }
);

// Add address
user.addresses.push({
  fullName: 'John Doe',
  phone: '03001234567',
  street: '123 Main St',
  city: 'Karachi',
  state: 'Sindh',
  zipCode: '75000',
  country: 'Pakistan',
  isDefault: true,
});
await user.save();

// Add to wishlist
user.wishlist.push(productId);
await user.save();

// Verify password
const isMatch = await user.comparePassword(enteredPassword);

// Get user count
const count = await User.countDocuments();
```

---

## 🛍️ Product Model

### Schema Fields
- `name` - Product name (required, max 200 chars)
- `description` - Product description (required)
- `price` - Current price (required, min 0)
- `originalPrice` - Original price (for discounts)
- `category` - Category ID (required, ref to Category)
- `brand` - Brand name
- `images[]` - Array of { public_id, url }
- `stock` - Available quantity (required, min 0)
- `ratings` - Average rating (0-5)
- `numReviews` - Total reviews count
- `featured` - Featured product flag
- `isBestSeller` - Best seller flag
- `isFlashSale` - Flash sale flag
- `flashSaleEndTime` - Flash sale expiration
- `tags[]` - Search tags
- `specifications[]` - { key, value } pairs
- `seller` - Seller User ID

### Example Usage

```javascript
// Create product
const product = await Product.create({
  name: 'iPhone 15',
  description: 'Latest Apple iPhone',
  price: 99999,
  originalPrice: 120000,
  category: categoryId,
  brand: 'Apple',
  images: [{ public_id: 'abc123', url: 'https://...' }],
  stock: 50,
  tags: ['phone', 'apple', 'ios'],
});

// Find and populate category
const product = await Product.findById(productId).populate('category');

// Search by text (name, description, brand, tags)
const results = await Product.find({ $text: { $search: 'iPhone' } });

// Get featured products
const featured = await Product.find({ featured: true }).limit(10);

// Get best sellers
const bestSellers = await Product.find({ isBestSeller: true }).limit(20);

// Get flash sale products
const flashSale = await Product.find({
  isFlashSale: true,
  flashSaleEndTime: { $gt: new Date() },
});

// Filter by category and price
const products = await Product.find({
  category: categoryId,
  price: { $gte: 10000, $lte: 100000 },
});

// Get product with discount
product.discountPercent; // Virtual field calculated automatically

// Update stock after order
await Product.findByIdAndUpdate(
  productId,
  { $inc: { stock: -quantity } },
  { new: true }
);

// Aggregate - top rated products
const topRated = await Product.aggregate([
  { $match: { ratings: { $gte: 4 } } },
  { $sort: { numReviews: -1 } },
  { $limit: 10 },
]);
```

---

## 📂 Category Model

### Schema Fields
- `name` - Category name (required, unique)
- `slug` - URL-friendly name (required, unique, lowercase)
- `description` - Category description
- `image` - { public_id, url }
- `icon` - Icon emoji or name
- `isActive` - Active status (default: true)
- `parent` - Parent category ID (for subcategories)

### Example Usage

```javascript
// Create category
const category = await Category.create({
  name: 'Electronics',
  slug: 'electronics',
  description: 'Electronic devices and gadgets',
  icon: '📱',
  isActive: true,
});

// Create subcategory
const subCategory = await Category.create({
  name: 'Smartphones',
  slug: 'smartphones',
  parent: categoryId, // Reference to parent
});

// Find with parent details
const category = await Category.findById(categoryId).populate('parent');

// Get all subcategories
const subcategories = await Category.find({ parent: categoryId });

// Find by slug
const category = await Category.findOne({ slug: 'electronics' });

// Get active categories
const activeCategories = await Category.find({ isActive: true });
```

---

## 📦 Order Model

### Schema Fields
- `user` - User ID (required, ref to User)
- `orderItems[]` - Array of items { product, name, image, price, quantity }
- `shippingAddress` - Embedded address object
- `paymentMethod` - 'cod', 'card', 'easypaisa', 'jazzcash'
- `paymentStatus` - 'pending', 'paid', 'failed', 'refunded'
- `orderStatus` - 'processing', 'confirmed', 'shipped', 'delivered', 'cancelled'
- `itemsPrice` - Total items price
- `shippingPrice` - Shipping cost
- `taxPrice` - Tax amount
- `totalPrice` - Final total
- `orderNumber` - Unique order number (auto-generated)
- `paidAt` - Payment timestamp
- `deliveredAt` - Delivery timestamp
- `trackingNumber` - Shipping tracking number
- `notes` - Order notes

### Example Usage

```javascript
// Create order
const order = await Order.create({
  user: userId,
  orderItems: [
    {
      product: productId,
      name: 'iPhone 15',
      image: 'https://...',
      price: 99999,
      quantity: 1,
    },
  ],
  shippingAddress: {
    fullName: 'John Doe',
    phone: '03001234567',
    street: '123 Main St',
    city: 'Karachi',
    state: 'Sindh',
    zipCode: '75000',
    country: 'Pakistan',
  },
  itemsPrice: 99999,
  shippingPrice: 500,
  taxPrice: 12000,
  totalPrice: 112499,
  paymentMethod: 'cod',
});
// orderNumber is auto-generated as 'ORD-xxxxxxxx'

// Get orders with user and product details
const order = await Order.findById(orderId)
  .populate('user')
  .populate('orderItems.product');

// Get user's orders
const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });

// Get pending orders (admin)
const pending = await Order.find({ orderStatus: 'processing' });

// Update order status
await Order.findByIdAndUpdate(
  orderId,
  {
    orderStatus: 'shipped',
    trackingNumber: 'TRACK123456',
  },
  { new: true }
);

// Mark as paid
await Order.findByIdAndUpdate(
  orderId,
  { paymentStatus: 'paid', paidAt: new Date() },
  { new: true }
);

// Get order statistics
const stats = await Order.aggregate([
  {
    $group: {
      _id: '$orderStatus',
      count: { $sum: 1 },
      totalAmount: { $sum: '$totalPrice' },
    },
  },
]);
```

---

## 🛒 Cart Model

### Schema Fields
- `user` - User ID (required, unique, ref to User)
- `items[]` - Array of { product, quantity, price }
- `coupon` - Coupon code applied
- `discount` - Discount amount
- `total` - Virtual field (auto-calculated)

### Example Usage

```javascript
// Get or create cart
let cart = await Cart.findOne({ user: userId });
if (!cart) {
  cart = await Cart.create({ user: userId, items: [] });
}

// Add to cart
const cartItem = {
  product: productId,
  quantity: 2,
  price: 99999,
};
cart.items.push(cartItem);
await cart.save();

// Update cart item quantity
await Cart.findOneAndUpdate(
  { user: userId, 'items.product': productId },
  { $set: { 'items.$.quantity': 5 } },
  { new: true }
);

// Remove from cart
await Cart.findOneAndUpdate(
  { user: userId },
  { $pull: { items: { product: productId } } },
  { new: true }
);

// Get cart with product details
const cart = await Cart.findOne({ user: userId }).populate('items.product');

// Apply coupon
await Cart.findOneAndUpdate(
  { user: userId },
  { coupon: 'SAVE20', discount: 5000 },
  { new: true }
);

// Clear cart
await Cart.findOneAndUpdate(
  { user: userId },
  { items: [], coupon: '', discount: 0 },
  { new: true }
);

// Get total (virtual field)
console.log(cart.total); // Auto-calculated sum
```

---

## ⭐ Review Model

### Schema Fields
- `user` - User ID (required, ref to User)
- `product` - Product ID (required, ref to Product)
- `rating` - Rating 1-5 (required)
- `title` - Review title (max 100)
- `comment` - Review comment (required, max 1000)
- `images[]` - Review images
- `helpful` - Helpful votes count
- `verified` - Verified purchase flag

### Example Usage

```javascript
// Create review
const review = await Review.create({
  user: userId,
  product: productId,
  rating: 5,
  title: 'Excellent product!',
  comment: 'Great quality and fast delivery',
  verified: true,
});

// Get product reviews
const reviews = await Review.find({ product: productId }).populate('user');

// Get user's reviews
const userReviews = await Review.find({ user: userId });

// Update review
await Review.findByIdAndUpdate(
  reviewId,
  { rating: 4, comment: 'Updated comment' },
  { new: true }
);

// Delete review
await Review.findByIdAndDelete(reviewId);

// Mark as helpful
await Review.findByIdAndUpdate(
  reviewId,
  { $inc: { helpful: 1 } },
  { new: true }
);

// Get average rating for product
const stats = await Review.aggregate([
  { $match: { product: productId } },
  {
    $group: {
      _id: '$product',
      avgRating: { $avg: '$rating' },
      totalReviews: { $sum: 1 },
    },
  },
]);
// Product.ratings and Product.numReviews auto-updated after review save
```

---

## 🔄 Pagination Example

```javascript
// Get paginated products
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 10;
const skip = (page - 1) * limit;

const products = await Product.find()
  .skip(skip)
  .limit(limit)
  .sort({ createdAt: -1 });

const total = await Product.countDocuments();

res.json({
  products,
  pagination: {
    current: page,
    total: Math.ceil(total / limit),
    limit,
  },
});
```

---

## 🔐 Error Handling

```javascript
try {
  const user = await User.create({ email: 'test@test.com' });
} catch (error) {
  if (error.code === 11000) {
    // Duplicate key error
    console.log('Email already exists');
  } else if (error.name === 'ValidationError') {
    // Validation error
    console.log('Invalid data:', error.message);
  } else {
    console.log('Database error:', error.message);
  }
}
```

---

## 📚 Common Mongoose Methods

| Method | Description |
|--------|-------------|
| `Model.create(data)` | Create new document |
| `Model.find(query)` | Find all matching documents |
| `Model.findOne(query)` | Find first matching document |
| `Model.findById(id)` | Find by ID |
| `Model.findByIdAndUpdate(id, update, options)` | Update and return |
| `Model.findByIdAndDelete(id)` | Delete document |
| `Model.updateMany(query, update)` | Update multiple |
| `Model.deleteMany(query)` | Delete multiple |
| `Model.countDocuments(query)` | Count matching documents |
| `.populate(field)` | Load referenced documents |
| `.select('field1 field2')` | Select specific fields |
| `.sort({field: 1/-1})` | Sort ascending/descending |
| `.limit(n)` | Limit results |
| `.skip(n)` | Skip results (pagination) |
| `.exec()` | Execute query |

---

**For detailed MongoDB queries, refer to the official [Mongoose Documentation](https://mongoosejs.com/)**
