// routes/uploadRoutes.js
const express = require('express');
const router  = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { uploadAvatar, uploadProduct } = require('../config/cloudinary');
const User = require('../models/User');

const path = require('path');

// Upload avatar
router.post('/avatar', protect, uploadAvatar.single('avatar'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded.' });
    // If file.path is a local filesystem path, convert to a public URL
    let avatarUrl = req.file.path;
    if (path.isAbsolute(req.file.path)) {
      avatarUrl = `${req.protocol}://${req.get('host')}/uploads/avatars/${req.file.filename}`;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: { public_id: req.file.filename, url: avatarUrl } },
      { new: true }
    );
    res.json({ success: true, avatar: user.avatar });
  } catch (e) {
    console.error('Avatar upload error:', e);
    const msg = String(e.message || e);
    if (/Unknown API key|Invalid API key|Authentication error/i.test(msg)) {
      return res.status(502).json({ success: false, message: 'Cloudinary authentication failed. Check CLOUDINARY_API_KEY/CLOUDINARY_API_SECRET in your .env.' });
    }
    return res.status(500).json({ success: false, message: 'Upload failed. ' + (e.message || 'Server error') });
  }
});

// Upload product images
router.post('/product', protect, adminOnly, uploadProduct.array('images', 5), (req, res) => {
  try {
    const images = req.files.map((f) => {
      let url = f.path;
      if (path.isAbsolute(f.path)) {
        url = `${req.protocol}://${req.get('host')}/uploads/products/${f.filename}`;
      }
      return { public_id: f.filename, url };
    });
    res.json({ success: true, images });
  } catch (e) {
    console.error('Product images upload error:', e);
    const msg = String(e.message || e);
    if (/Unknown API key|Invalid API key|Authentication error/i.test(msg)) {
      return res.status(502).json({ success: false, message: 'Cloudinary authentication failed. Check CLOUDINARY_API_KEY/CLOUDINARY_API_SECRET in your .env.' });
    }
    return res.status(500).json({ success: false, message: 'Upload failed. ' + (e.message || 'Server error') });
  }
});

module.exports = router;
