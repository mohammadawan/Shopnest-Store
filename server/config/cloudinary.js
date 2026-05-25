// config/cloudinary.js — Cloudinary Setup

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Helper: check if Cloudinary credentials look valid
const hasCloudinaryCredentials = () => {
  const key = process.env.CLOUDINARY_API_KEY || '';
  const secret = process.env.CLOUDINARY_API_SECRET || '';
  const name = process.env.CLOUDINARY_CLOUD_NAME || '';
  if (!key || !secret || !name) return false;
  if (key.includes('your_') || secret.includes('your_') || name.includes('your_')) return false;
  return true;
};

let uploadProduct;
let uploadAvatar;

if (hasCloudinaryCredentials()) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  // Storage engine for product images (Cloudinary)
  const productStorage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'shopnest/products',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [{ width: 800, height: 800, crop: 'limit', quality: 'auto' }],
    },
  });

  // Storage engine for avatar images (Cloudinary)
  const avatarStorage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'shopnest/avatars',
      allowed_formats: ['jpg', 'jpeg', 'png'],
      transformation: [{ width: 200, height: 200, crop: 'fill', gravity: 'face' }],
    },
  });

  uploadProduct = multer({ storage: productStorage, limits: { fileSize: 5 * 1024 * 1024 } });
  uploadAvatar = multer({ storage: avatarStorage, limits: { fileSize: 2 * 1024 * 1024 } });
} else {
  // Fallback: store uploads locally for development
  const uploadsRoot = path.join(__dirname, '..', 'uploads');
  const avatarsDir = path.join(uploadsRoot, 'avatars');
  const productsDir = path.join(uploadsRoot, 'products');
  // ensure directories exist
  [uploadsRoot, avatarsDir, productsDir].forEach((d) => { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); });

  const diskStorage = (dest) => multer.diskStorage({
    destination: function (req, file, cb) { cb(null, dest); },
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname) || '';
      const name = Date.now() + '-' + Math.random().toString(36).slice(2, 9) + ext;
      cb(null, name);
    },
  });

  uploadProduct = multer({ storage: diskStorage(productsDir), limits: { fileSize: 5 * 1024 * 1024 } });
  uploadAvatar  = multer({ storage: diskStorage(avatarsDir),  limits: { fileSize: 2 * 1024 * 1024 } });
}

module.exports = { cloudinary, uploadProduct, uploadAvatar, hasCloudinaryCredentials };
