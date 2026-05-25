// routes/wishlistRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// Toggle wishlist item
router.post('/toggle', protect, async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user._id);
    const idx  = user.wishlist.indexOf(productId);

    if (idx > -1) {
      user.wishlist.splice(idx, 1);
    } else {
      user.wishlist.push(productId);
    }
    await user.save();
    res.json({ success: true, wishlist: user.wishlist, added: idx === -1 });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Get wishlist
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist', 'name images price ratings stock brand');
    res.json({ success: true, wishlist: user.wishlist });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

module.exports = router;
