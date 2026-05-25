// models/Review.js — Product Review Model

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    rating:   { type: Number, required: true, min: 1, max: 5 },
    title:    { type: String, maxlength: 100, default: '' },
    comment:  { type: String, required: true, maxlength: 1000 },
    images: [
      {
        public_id: String,
        url:       String,
      },
    ],
    helpful:  { type: Number, default: 0 }, // helpful votes
    verified: { type: Boolean, default: false }, // verified purchase
  },
  { timestamps: true }
);

// One review per user per product
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

// Update product rating after save
reviewSchema.post('save', async function () {
  const Product = require('./Product');
  const stats = await this.constructor.aggregate([
    { $match: { product: this.product } },
    { $group: { _id: '$product', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  if (stats.length > 0) {
    await Product.findByIdAndUpdate(this.product, {
      ratings: Math.round(stats[0].avgRating * 10) / 10,
      numReviews: stats[0].count,
    });
  }
});

module.exports = mongoose.model('Review', reviewSchema);
