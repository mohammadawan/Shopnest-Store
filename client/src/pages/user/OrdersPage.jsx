// pages/user/OrdersPage.jsx

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPackage } from 'react-icons/fi';
import { OrderStatusBadge, EmptyState, Spinner } from '../../components/common';
import API from '../../utils/api';

export default function OrdersPage() {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/orders/my')
      .then((r) => setOrders(r.data.orders))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex justify-center py-20">
      <Spinner size="lg" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 dark:bg-gray-950 min-h-screen">
      <h1 className="section-title mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <EmptyState icon="📦" title="No orders yet" message="Your order history will appear here."
          action={<Link to="/products" className="btn-primary">Start Shopping</Link>} />
      ) : (
        <div className="space-y-4">
          {orders.map((order, i) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <FiPackage className="text-primary" size={18} />
                    <span className="font-semibold text-gray-900 dark:text-white text-sm">
                      {order.orderNumber || order._id.slice(-8).toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <OrderStatusBadge status={order.orderStatus} />
                  <span className="font-bold text-gray-900 dark:text-white">₨{order.totalPrice?.toLocaleString()}</span>
                </div>
              </div>

              {/* Items preview */}
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {order.orderItems?.slice(0, 4).map((item, j) => (
                  <div key={j} className="shrink-0 flex items-center gap-2 bg-gray-50 dark:bg-gray-700 rounded-xl px-3 py-2">
                    <img src={item.image} alt={item.name} className="w-10 h-10 object-contain rounded-lg" />
                    <div>
                      <p className="text-xs font-medium text-gray-900 dark:text-white line-clamp-1 max-w-[120px]">{item.name}</p>
                      <p className="text-xs text-gray-400">×{item.quantity}</p>
                    </div>
                  </div>
                ))}
                {order.orderItems?.length > 4 && (
                  <div className="shrink-0 w-14 h-14 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center text-sm text-gray-500">
                    +{order.orderItems.length - 4}
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
                <span>Payment: <span className="capitalize font-medium text-gray-600 dark:text-gray-300">{order.paymentMethod}</span></span>
                {order.trackingNumber && (
                  <span>Tracking: <span className="font-mono text-primary">{order.trackingNumber}</span></span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
