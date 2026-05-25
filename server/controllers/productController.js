// controllers/productController.js — Product Business Logic

const Product = require('../models/Product');

// ── Get All Products ────────────────────────
// GET /api/products?search=&category=&minPrice=&maxPrice=&sort=&page=&limit=
const getProducts = async (req, res) => {
  try {
    const {
      search, category, brand, minPrice, maxPrice,
      sort = '-createdAt', page = 1, limit = 12,
      featured, isBestSeller, isFlashSale,
    } = req.query;

    const query = {};

    // Full-text search
    if (search) {
      query.$text = { $search: search };
    }

    // Filters
    if (category)     query.category = category;
    if (brand)        query.brand = { $regex: brand, $options: 'i' };
    if (featured)     query.featured = true;
    if (isBestSeller) query.isBestSeller = true;
    if (isFlashSale)  query.isFlashSale = true;

    // Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const pageNum  = Math.max(1, Number(page));
    const pageSize = Math.min(50, Math.max(1, Number(limit)));
    const skip     = (pageNum - 1) * pageSize;

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('category', 'name slug')
        .sort(sort)
        .skip(skip)
        .limit(pageSize)
        .lean(),
      Product.countDocuments(query),
    ]);

    res.json({
      success: true,
      products,
      pagination: {
        total,
        page:       pageNum,
        pages:      Math.ceil(total / pageSize),
        limit:      pageSize,
        hasMore:    pageNum < Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Get Single Product ──────────────────────
// GET /api/products/:id
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug')
      .populate('seller', 'name');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Create Product (Admin) ──────────────────
// POST /api/products
const createProduct = async (req, res) => {
  try {
    const productData = { ...req.body, seller: req.user._id };

    // If images were uploaded (Cloudinary or local), normalize URLs
    if (req.files && req.files.length > 0) {
      productData.images = req.files.map((file) => {
        let url = file.path;
        if (!/^https?:\/\//i.test(url)) {
          // local disk storage: expose via /uploads/products/:filename
          url = `${req.protocol}://${req.get('host')}/uploads/products/${file.filename}`;
        }
        return { public_id: file.filename, url };
      });
    }

    const product = await Product.create(productData);
    await product.populate('category', 'name slug');

    res.status(201).json({ success: true, message: 'Product created!', product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Update Product (Admin) ──────────────────
// PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const updateData = { ...req.body };

    // Add new images if uploaded
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => {
        let url = file.path;
        if (!/^https?:\/\//i.test(url)) {
          url = `${req.protocol}://${req.get('host')}/uploads/products/${file.filename}`;
        }
        return { public_id: file.filename, url };
      });
      updateData.images = [...(product.images || []), ...newImages];
    }

    product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).populate('category', 'name slug');

    res.json({ success: true, message: 'Product updated!', product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Delete Product (Admin) ──────────────────
// DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }
    await product.deleteOne();
    res.json({ success: true, message: 'Product deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Get Related Products ────────────────────
// GET /api/products/:id/related
const getRelatedProducts = async (req, res) => {
  try {
    const product  = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Not found.' });

    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
    })
      .limit(8)
      .populate('category', 'name slug')
      .lean();

    res.json({ success: true, products: related });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct, getRelatedProducts };
