// components/product/ProductCard.jsx — Product Card with animations

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingCart, FiEye } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { addToCart } from '../../redux/slices/cartSlice';
import { StarRating, PriceDisplay, Badge } from '../common';
import API from '../../utils/api';

export default function ProductCard({ product, index = 0 }) {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const { isLoggedIn } = useSelector((s) => s.auth);
  const [wishlisted, setWishlisted] = useState(false);
  const [addingCart, setAddingCart] = useState(false);

  if (!product) return null;

  const { _id, name, images, price, originalPrice, ratings, numReviews, stock, brand, isFlashSale, featured, isBestSeller } = product;
  const image = images?.[0]?.url || 'https://via.placeholder.com/400x400?text=No+Image';

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) { navigate('/login'); return; }
    if (stock <= 0) { toast.error('Out of stock!'); return; }
    setAddingCart(true);
    await dispatch(addToCart({ productId: _id, quantity: 1 }));
    setAddingCart(false);
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) { navigate('/login'); return; }
    try {
      await API.post('/wishlist/toggle', { productId: _id });
      setWishlisted((v) => !v);
      toast.success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist ❤️');
    } catch (e) {
      toast.error('Failed to update wishlist');
    }
  };

  const discount = originalPrice && originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Link to={`/products/${_id}`} className="block">
        <div className="card overflow-hidden dark:bg-gray-800">
          {/* Image */}
          <div className="relative overflow-hidden bg-gray-50 dark:bg-gray-700 aspect-square">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />

            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {discount > 0 && (
                <Badge variant="danger">-{discount}%</Badge>
              )}
              {isFlashSale && (
                <Badge variant="warning">⚡ Flash Sale</Badge>
              )}
              {isBestSeller && (
                <Badge variant="success">🏆 Best Seller</Badge>
              )}
              {featured && !isBestSeller && (
                <Badge variant="info">⭐ Featured</Badge>
              )}
              {stock <= 0 && (
                <Badge variant="gray">Out of Stock</Badge>
              )}
            </div>

            {/* Quick actions overlay */}
            <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={handleWishlist}
                className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-colors ${
                  wishlisted ? 'bg-red-500 text-white' : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-500'
                }`}
              >
                <FiHeart size={16} style={{ fill: wishlisted ? 'white' : 'none' }} />
              </button>
              <Link
                to={`/products/${_id}`}
                className="w-9 h-9 rounded-full bg-white text-gray-600 hover:bg-gray-100 flex items-center justify-center shadow-md transition-colors"
              >
                <FiEye size={16} />
              </Link>
            </div>
          </div>

          {/* Info */}
          <div className="p-4">
            {brand && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-1 uppercase tracking-wide">{brand}</p>
            )}
            <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 mb-2 leading-snug">
              {name}
            </h3>
            <div className="flex items-center gap-2 mb-3">
              <StarRating rating={ratings} size={13} />
              <span className="text-xs text-gray-400">({numReviews || 0})</span>
            </div>
            <PriceDisplay price={price} originalPrice={originalPrice} size="sm" />

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={stock <= 0 || addingCart}
              className={`w-full mt-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2
                ${stock <= 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700'
                  : 'bg-primary hover:bg-primary-dark text-gray-900 active:scale-95'
                }`}
            >
              {addingCart ? (
                <span className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <FiShoppingCart size={15} />
                  {stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                </>
              )}
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
