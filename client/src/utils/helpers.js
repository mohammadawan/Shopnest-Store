// utils/helpers.js — General utility functions

/**
 * Format price in PKR (Pakistani Rupee)
 */
export const formatPrice = (amount) => {
  if (amount === undefined || amount === null) return '₨0';
  return `₨${Number(amount).toLocaleString('en-PK')}`;
};

/**
 * Calculate discount percentage
 */
export const getDiscount = (price, originalPrice) => {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
};

/**
 * Truncate text to a given length
 */
export const truncate = (str, len = 60) => {
  if (!str) return '';
  return str.length > len ? str.slice(0, len) + '…' : str;
};

/**
 * Format date nicely
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
};

/**
 * Debounce a function
 */
export const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

/**
 * Build query string from object
 */
export const buildQuery = (params) => {
  const cleaned = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== '' && v !== null && v !== undefined)
  );
  return new URLSearchParams(cleaned).toString();
};

/**
 * Get order status color
 */
export const getStatusColor = (status) => {
  const map = {
    processing: 'text-yellow-600 bg-yellow-50',
    confirmed:  'text-blue-600 bg-blue-50',
    shipped:    'text-purple-600 bg-purple-50',
    delivered:  'text-green-600 bg-green-50',
    cancelled:  'text-red-600 bg-red-50',
  };
  return map[status] || 'text-gray-600 bg-gray-50';
};

/**
 * Validate email format
 */
export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

/**
 * Generate a random product placeholder image
 */
export const placeholderImg = (seed = 'product') =>
  `https://picsum.photos/seed/${seed}/400/400`;

/**
 * Scroll smoothly to top
 */
export const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
