// DEPRECATED: This file has been split into Cart.js and Review.js
// Kept for backward compatibility - use individual imports instead

// ✅ NEW WAY (Recommended):
// const Cart = require('./Cart');
// const Review = require('./Review');

// ❌ OLD WAY (Deprecated):
// const Cart = require('./CartAndReview');
// const Review = require('./CartAndReview');

module.exports = {
  Cart: require('./Cart'),
  Review: require('./Review'),
};

