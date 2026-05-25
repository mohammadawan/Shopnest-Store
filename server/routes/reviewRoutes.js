// routes/reviewRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Review = require('../models/Review');

// Add Review
router.post('/', protect, async (req, res) => {
  try {
    const { productId, rating, title, comment } = req.body;
    const existing = await Review.findOne({ user: req.user._id, product: productId });
    if (existing) return res.status(400).json({ success: false, message: 'You already reviewed this product.' });

    const review = await Review.create({
      user: req.user._id, product: productId, rating, title, comment,
    });
    await review.populate('user', 'name avatar');
    res.status(201).json({ success: true, review });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Get Product Reviews
router.get('/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name avatar')
      .sort('-createdAt');
    res.json({ success: true, reviews });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Delete Review
router.delete('/:id', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found.' });
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }
    await review.deleteOne();
    res.json({ success: true, message: 'Review deleted.' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

module.exports = router;
