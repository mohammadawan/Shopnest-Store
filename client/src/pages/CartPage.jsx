// pages/CartPage.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowLeft } from 'react-icons/fi';
import { updateCartItem, removeCartItem, selectCartTotal } from '../redux/slices/cartSlice';
import { EmptyState, Spinner } from '../components/common';

export default function CartPage() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { items, loading } = useSelector((s) => s.cart);
  const total = useSelector(selectCartTotal);
  const { isLoggedIn } = useSelector((s) => s.auth);

  if (!isLoggedIn) {
    return (
      <EmptyState
        icon="🔒"
        title="Please sign in"
        message="You need to be signed in to view your cart."
        action={<Link to="/login" className="btn-primary">Sign In</Link>}
      />
    );
  }

  const shippingCost = total >= 2000 ? 0 : 150;
  const tax          = Math.round(total * 0.05);
  const grandTotal   = total + shippingCost + tax;

  const handleQty = (itemId, qty) => {
    if (qty < 1) return;
    dispatch(updateCartItem({ itemId, quantity: qty }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 dark:bg-gray-950 min-h-screen">
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-primary transition-colors">
          <FiArrowLeft size={20} />
        </button>
        <h1 className="section-title">Shopping Cart</h1>
        <span className="text-gray-500 text-sm">({items.length} item{items.length !== 1 ? 's' : ''})</span>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon="🛒"
          title="Your cart is empty"
          message="Looks like you haven't added anything yet. Start shopping!"
          action={<Link to="/products" className="btn-primary">Browse Products</Link>}
        />
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item) => {
                const product = item.product;
                const image   = product?.images?.[0]?.url || 'https://via.placeholder.com/100';

                return (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100, height: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-4 flex gap-4 shadow-sm"
                  >
                    <Link to={`/products/${product?._id}`} className="shrink-0">
                      <img
                        src={image}
                        alt={product?.name}
                        className="w-24 h-24 object-contain rounded-xl bg-gray-50 dark:bg-gray-700 p-2"
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link to={`/products/${product?._id}`}>
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2 hover:text-primary transition-colors mb-1">
                          {product?.name}
                        </h3>
                      </Link>
                      {product?.brand && (
                        <p className="text-xs text-gray-400 mb-2">{product.brand}</p>
                      )}
                      <p className="font-bold text-gray-900 dark:text-white mb-3">
                        ₨{(item.price * item.quantity).toLocaleString()}
                        <span className="font-normal text-gray-400 text-xs ml-1">(₨{item.price?.toLocaleString()} each)</span>
                      </p>

                      <div className="flex items-center justify-between">
                        {/* Qty control */}
                        <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                          <button
                            onClick={() => handleQty(item._id, item.quantity - 1)}
                            disabled={loading}
                            className="px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-500"
                          >
                            <FiMinus size={14} />
                          </button>
                          <span className="px-4 py-1.5 text-sm font-semibold text-gray-900 dark:text-white border-x border-gray-200 dark:border-gray-700">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQty(item._id, item.quantity + 1)}
                            disabled={loading || item.quantity >= (product?.stock || 99)}
                            className="px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-500"
                          >
                            <FiPlus size={14} />
                          </button>
                        </div>

                        <button
                          onClick={() => dispatch(removeCartItem(item._id))}
                          className="text-gray-400 hover:text-red-500 transition-colors p-2"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            <Link to="/products" className="flex items-center gap-2 text-primary hover:text-primary-dark text-sm font-medium transition-colors">
              <FiArrowLeft size={16} /> Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm sticky top-24">
              <h2 className="font-display font-bold text-lg text-gray-900 dark:text-white mb-5">Order Summary</h2>

              <div className="space-y-3 text-sm mb-5">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal ({items.length} items)</span>
                  <span>₨{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Shipping</span>
                  <span className={shippingCost === 0 ? 'text-green-600 font-medium' : ''}>
                    {shippingCost === 0 ? 'FREE' : `₨${shippingCost}`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Tax (5%)</span>
                  <span>₨{tax.toLocaleString()}</span>
                </div>
                {shippingCost > 0 && (
                  <p className="text-xs text-blue-600 bg-blue-50 dark:bg-blue-900/20 rounded-lg px-3 py-2">
                    💡 Add ₨{(2000 - total).toLocaleString()} more for FREE shipping!
                  </p>
                )}
                <div className="border-t border-gray-100 dark:border-gray-700 pt-3 flex justify-between font-bold text-gray-900 dark:text-white text-base">
                  <span>Total</span>
                  <span>₨{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full btn-primary py-4 text-base font-bold flex items-center justify-center gap-2"
              >
                <FiShoppingBag size={20} /> Proceed to Checkout
              </button>

              <div className="mt-4 text-center text-xs text-gray-400">
                🔒 Secure SSL encrypted checkout
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
