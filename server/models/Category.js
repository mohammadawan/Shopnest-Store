// models/Category.js

const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, unique: true, trim: true },
    slug:        { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: '' },
    image: {
      public_id: { type: String, default: '' },
      url:       { type: String, default: '' },
    },
    icon:     { type: String, default: '' },  // emoji or icon name
    isActive: { type: Boolean, default: true },
    parent:   { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);
