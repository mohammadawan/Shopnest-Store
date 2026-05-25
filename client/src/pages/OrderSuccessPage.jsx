// pages/OrderSuccessPage.jsx

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPackage, FiHome, FiList } from 'react-icons/fi';

export default function OrderSuccessPage() {
  const { state } = useLocation();
  const order = state?.order;

  return (
    <div className="min-h-screen flex items-center justify-center dark:bg-gray-950 px-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', duration: 0.6 }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <span className="text-5xl">🎉</span>
        </motion.div>
        <h1 className="text-3xl font-display font-black text-gray-900 dark:text-white mb-2">Order Placed!</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-2">
          Thank you for your order. We'll process it shortly.
        </p>
        {order?.orderNumber && (
          <p className="text-sm font-semibold text-primary mb-8">Order #: {order.orderNumber}</p>
        )}
        <div className="flex gap-3 justify-center flex-wrap">
          <Link to="/" className="btn-primary flex items-center gap-2">
            <FiHome size={16} /> Go Home
          </Link>
          <Link to="/orders" className="btn-outline flex items-center gap-2">
            <FiList size={16} /> My Orders
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
