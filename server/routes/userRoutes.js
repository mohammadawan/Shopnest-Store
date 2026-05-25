// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Get profile
router.get('/profile', protect, async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ success: true, user });
});

// Update profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, phone, addresses } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, ...(addresses && { addresses }) },
      { new: true, runValidators: true }
    );
    res.json({ success: true, user });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Admin: get all users
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const [users, total] = await Promise.all([
      User.find().sort('-createdAt').skip((page - 1) * limit).limit(Number(limit)),
      User.countDocuments(),
    ]);
    res.json({ success: true, users, total });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Admin: toggle user active
router.put('/:id/toggle', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, user });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Admin: set user role (promote/demote)
router.put('/:id/role', protect, adminOnly, async (req, res) => {
  try {
    const { role } = req.body; // expected 'user' or 'admin'
    if (!role || !['user', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role. Use "user" or "admin".' });
    }
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    user.role = role;
    await user.save();
    res.json({ success: true, user });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

module.exports = router;
