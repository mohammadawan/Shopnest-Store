// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const {
  getProducts, getProduct, createProduct,
  updateProduct, deleteProduct, getRelatedProducts,
} = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { uploadProduct } = require('../config/cloudinary');

router.get('/',               getProducts);
router.get('/:id',            getProduct);
router.get('/:id/related',    getRelatedProducts);
router.post('/',   protect, adminOnly, uploadProduct.array('images', 5), createProduct);
router.put('/:id', protect, adminOnly, uploadProduct.array('images', 5), updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;
