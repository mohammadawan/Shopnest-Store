// Run with: node utils/seeder.js

const path     = require('path');
const dotenv   = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const connectDB = require('../config/db');
const User     = require('../models/User');
const Product  = require('../models/Product');
const Category = require('../models/Category');

// ── Sample Categories ────────────────────────
const categories = [
  { name: 'Electronics',  slug: 'electronics',  icon: '💻', description: 'Phones, Laptops, Gadgets' },
  { name: 'Fashion',      slug: 'fashion',      icon: '👗', description: 'Clothing & Accessories' },
  { name: 'Home & Living',slug: 'home-living',  icon: '🏠', description: 'Furniture & Decor' },
  { name: 'Sports',       slug: 'sports',       icon: '⚽', description: 'Sports & Fitness' },
  { name: 'Beauty',       slug: 'beauty',       icon: '💄', description: 'Skincare & Cosmetics' },
  { name: 'Books',        slug: 'books',        icon: '📚', description: 'Books & Stationery' },
  { name: 'Toys',         slug: 'toys',         icon: '🧸', description: 'Kids & Toys' },
  { name: 'Groceries',    slug: 'groceries',    icon: '🛒', description: 'Food & Beverages' },
];

// ── Sample Users ─────────────────────────────
const users = [
  {
    name: 'Admin User',
    email: 'admin@shopnest.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    name: 'Test User',
    email: 'user@shopnest.com',
    password: 'user123',
    role: 'user',
  },
];

// ── Sample Products ───────────────────────────
const getProducts = (categoryMap) => [
  // Electronics
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Experience the ultimate Samsung Galaxy with the most advanced AI features, a powerful 200MP camera, and titanium build. Perfect for professionals and enthusiasts.',
    price: 189999,
    originalPrice: 220000,
    brand: 'Samsung',
    stock: 25,
    category: categoryMap['electronics'],
    featured: true,
    isBestSeller: true,
    ratings: 4.8,
    numReviews: 124,
    tags: ['smartphone', '5g', 'android', 'samsung'],
    images: [{ public_id: 's24', url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500' }],
    specifications: [
      { key: 'Display', value: '6.8" QHD+ Dynamic AMOLED 2X' },
      { key: 'Processor', value: 'Snapdragon 8 Gen 3' },
      { key: 'RAM', value: '12 GB' },
      { key: 'Storage', value: '256 GB' },
      { key: 'Camera', value: '200MP + 12MP + 10MP + 10MP' },
      { key: 'Battery', value: '5000 mAh' },
    ],
  },
  {
    name: 'Apple iPhone 15 Pro',
    description: 'iPhone 15 Pro with A17 Pro chip and titanium design. Shoot incredible videos in 4K with cinematic mode. Features USB-C connectivity and Action Button.',
    price: 299999,
    originalPrice: 330000,
    brand: 'Apple',
    stock: 15,
    category: categoryMap['electronics'],
    featured: true,
    isBestSeller: true,
    ratings: 4.9,
    numReviews: 87,
    tags: ['iphone', 'apple', 'smartphone', 'ios'],
    images: [{ public_id: 'iphone15', url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500' }],
    specifications: [
      { key: 'Display', value: '6.1" Super Retina XDR OLED' },
      { key: 'Chip', value: 'A17 Pro' },
      { key: 'Camera', value: '48MP Main + 12MP Ultra Wide' },
      { key: 'Battery', value: 'Up to 23 hrs video playback' },
    ],
  },
  {
    name: 'Dell XPS 15 Laptop',
    description: 'Stunning 15.6" OLED display laptop with Intel Core i7, 16GB RAM, and 512GB SSD. Perfect for creators and developers. Thin, light, and powerful.',
    price: 249999,
    originalPrice: 285000,
    brand: 'Dell',
    stock: 10,
    category: categoryMap['electronics'],
    featured: true,
    isFlashSale: true,
    ratings: 4.7,
    numReviews: 56,
    tags: ['laptop', 'dell', 'intel', 'creator'],
    images: [{ public_id: 'xps15', url: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500' }],
    specifications: [
      { key: 'Display', value: '15.6" 3.5K OLED Touch' },
      { key: 'Processor', value: 'Intel Core i7-13700H' },
      { key: 'RAM', value: '16 GB DDR5' },
      { key: 'Storage', value: '512 GB NVMe SSD' },
    ],
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Industry-leading noise canceling with two processors and eight microphones. Crystal clear hands-free calling. Up to 30 hours battery life.',
    price: 49999,
    originalPrice: 65000,
    brand: 'Sony',
    stock: 40,
    category: categoryMap['electronics'],
    isFlashSale: true,
    ratings: 4.8,
    numReviews: 203,
    tags: ['headphones', 'sony', 'wireless', 'noise-canceling'],
    images: [{ public_id: 'sony-wh', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500' }],
  },
  {
    name: 'Apple iPad Pro 12.9"',
    description: 'Supercharged by the M2 chip. iPad Pro features a stunning Liquid Retina XDR display, 5G connectivity, and all-day battery life.',
    price: 169999,
    originalPrice: 195000,
    brand: 'Apple',
    stock: 20,
    category: categoryMap['electronics'],
    featured: true,
    ratings: 4.7,
    numReviews: 45,
    tags: ['ipad', 'apple', 'tablet'],
    images: [{ public_id: 'ipad-pro', url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500' }],
  },

  // Fashion
  {
    name: 'Classic Linen Blazer',
    description: 'Elevate your style with this premium linen blazer. Perfect for formal and semi-formal occasions. Available in navy blue. Tailored fit with modern cut.',
    price: 8999,
    originalPrice: 14999,
    brand: 'Gul Ahmed',
    stock: 50,
    category: categoryMap['fashion'],
    featured: true,
    isBestSeller: true,
    ratings: 4.5,
    numReviews: 78,
    tags: ['blazer', 'formal', 'linen', 'menswear'],
    images: [{ public_id: 'blazer', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500' }],
  },
  {
    name: 'Women\'s Embroidered Lawn Suit',
    description: '3-piece embroidered lawn suit with digital print dupatta. Soft fabric, vibrant colours. Stitched and ready to wear.',
    price: 4500,
    originalPrice: 7200,
    brand: 'Khaadi',
    stock: 75,
    category: categoryMap['fashion'],
    isFlashSale: true,
    ratings: 4.6,
    numReviews: 112,
    tags: ['lawn', 'women', 'stitched', 'summer'],
    images: [{ public_id: 'lawn-suit', url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500' }],
  },
  {
    name: 'Nike Air Max 270',
    description: 'The Nike Air Max 270 features a large Air unit in the heel for maximum cushioning and a sleek, modern profile. Ideal for all-day comfort.',
    price: 18999,
    originalPrice: 24999,
    brand: 'Nike',
    stock: 35,
    category: categoryMap['fashion'],
    isBestSeller: true,
    ratings: 4.7,
    numReviews: 198,
    tags: ['shoes', 'nike', 'sneakers', 'airmax'],
    images: [{ public_id: 'nike-am270', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500' }],
  },

  // Home & Living
  {
    name: 'Nespresso Vertuo Coffee Machine',
    description: 'Brew barista-quality coffee at home with this Nespresso Vertuo machine. Works with all Vertuo pods. Fast heat-up time in just 30 seconds.',
    price: 29999,
    originalPrice: 38000,
    brand: 'Nespresso',
    stock: 18,
    category: categoryMap['home-living'],
    featured: true,
    ratings: 4.6,
    numReviews: 67,
    tags: ['coffee', 'kitchen', 'nespresso', 'appliance'],
    images: [{ public_id: 'nespresso', url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500' }],
  },
  {
    name: 'Ergonomic Office Chair',
    description: 'Premium ergonomic office chair with lumbar support, adjustable armrests, and breathable mesh back. Sit comfortably for hours while you work.',
    price: 24999,
    originalPrice: 32000,
    brand: 'DuraComfort',
    stock: 12,
    category: categoryMap['home-living'],
    isBestSeller: true,
    isFlashSale: true,
    ratings: 4.4,
    numReviews: 43,
    tags: ['chair', 'office', 'ergonomic', 'furniture'],
    images: [{ public_id: 'office-chair', url: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=500' }],
  },
  {
    name: 'Philips Air Fryer XL',
    description: 'Enjoy guilt-free fried food with up to 90% less fat. 6.2L capacity fits a whole chicken. Rapid Air Technology circulates hot air for crispy results.',
    price: 19999,
    originalPrice: 27000,
    brand: 'Philips',
    stock: 30,
    category: categoryMap['home-living'],
    featured: true,
    ratings: 4.7,
    numReviews: 89,
    tags: ['airfryer', 'philips', 'kitchen', 'healthy'],
    images: [{ public_id: 'airfryer', url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500' }],
  },

  // Sports
  {
    name: 'Yoga Mat Premium Anti-Slip',
    description: 'Extra thick 6mm yoga mat with anti-slip surface. Double-layer construction for superior grip and cushioning. Includes carrying strap.',
    price: 2999,
    originalPrice: 4500,
    brand: 'FitZone',
    stock: 80,
    category: categoryMap['sports'],
    featured: true,
    ratings: 4.5,
    numReviews: 156,
    tags: ['yoga', 'mat', 'fitness', 'exercise'],
    images: [{ public_id: 'yoga-mat', url: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=500' }],
  },
  {
    name: 'Adjustable Dumbbell Set 20kg',
    description: 'Space-saving adjustable dumbbell set from 2kg to 20kg per dumbbell. Quick-change weight selector. Commercial grade steel construction.',
    price: 15999,
    originalPrice: 22000,
    brand: 'PowerFit',
    stock: 20,
    category: categoryMap['sports'],
    isFlashSale: true,
    isBestSeller: true,
    ratings: 4.6,
    numReviews: 72,
    tags: ['dumbbells', 'weights', 'gym', 'fitness'],
    images: [{ public_id: 'dumbbells', url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=500' }],
  },

  // Beauty
  {
    name: 'Neutrogena Hydro Boost Gel Cream',
    description: 'Oil-free moisturizer that delivers a surge of intense hydration. Hyaluronic acid formula absorbs instantly and locks in moisture for 72 hours.',
    price: 3299,
    originalPrice: 4500,
    brand: 'Neutrogena',
    stock: 100,
    category: categoryMap['beauty'],
    isBestSeller: true,
    ratings: 4.7,
    numReviews: 234,
    tags: ['moisturizer', 'skincare', 'hydration', 'neutrogena'],
    images: [{ public_id: 'neutrogena', url: 'https://images.unsplash.com/photo-1556228578-dd539282b964?w=500' }],
  },
  {
    name: 'Dyson Supersonic Hair Dryer',
    description: 'Engineered to protect hair from extreme heat damage. Uses Air Multiplier technology for fast drying and precise styling. Multiple attachments included.',
    price: 64999,
    originalPrice: 80000,
    brand: 'Dyson',
    stock: 8,
    category: categoryMap['beauty'],
    featured: true,
    ratings: 4.9,
    numReviews: 45,
    tags: ['hairdryer', 'dyson', 'beauty', 'hair'],
    images: [{ public_id: 'dyson-dryer', url: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=500' }],
  },

  // Books
  {
    name: 'Atomic Habits — James Clear',
    description: 'A revolutionary system to get 1% better every day. Learn how tiny changes in your habits can have an extraordinary impact on your life and career.',
    price: 1499,
    originalPrice: 2200,
    brand: 'Penguin',
    stock: 200,
    category: categoryMap['books'],
    isBestSeller: true,
    ratings: 4.9,
    numReviews: 512,
    tags: ['self-help', 'habits', 'productivity', 'nonfiction'],
    images: [{ public_id: 'atomic-habits', url: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500' }],
  },

  // Toys
  {
    name: 'LEGO Technic Bugatti Chiron',
    description: 'Build the iconic Bugatti Chiron with this 3,599-piece Technic set. Features an 8-speed gearbox, working W16 engine, and authentic details.',
    price: 34999,
    originalPrice: 45000,
    brand: 'LEGO',
    stock: 15,
    category: categoryMap['toys'],
    featured: true,
    ratings: 4.8,
    numReviews: 34,
    tags: ['lego', 'technic', 'bugatti', 'building'],
    images: [{ public_id: 'lego-bugatti', url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500' }],
  },
];

// ── Seed Function ────────────────────────────
const seedDB = async () => {
  try {
    await connectDB();

    console.log('🗑️  Clearing existing data...');
    await Promise.all([
      User.deleteMany(),
      Product.deleteMany(),
      Category.deleteMany(),
    ]);

    console.log('👥 Creating users...');
    const createdUsers = await User.create(users);
    const adminUser = createdUsers.find((u) => u.role === 'admin');
    console.log(`   ✅ ${createdUsers.length} users created`);
    console.log('   📧 Admin: admin@shopnest.com / admin123');
    console.log('   📧 User:  user@shopnest.com / user123');

    console.log('🗂️  Creating categories...');
    const createdCats = await Category.create(categories);
    const categoryMap = createdCats.reduce((acc, c) => {
      acc[c.slug] = c._id;
      return acc;
    }, {});
    console.log(`   ✅ ${createdCats.length} categories created`);

    console.log('📦 Creating products...');
    const products = getProducts(categoryMap).map((p) => ({ ...p, seller: adminUser._id }));
    const createdProducts = await Product.create(products);
    console.log(`   ✅ ${createdProducts.length} products created`);

    console.log('\n🎉 Database seeded successfully!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDB();
