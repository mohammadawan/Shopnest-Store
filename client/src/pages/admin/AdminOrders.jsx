// pages/admin/AdminOrders.jsx

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FiChevronDown } from 'react-icons/fi';
import { OrderStatusBadge, Badge, Spinner, EmptyState } from '../../components/common';
import API from '../../utils/api';

const ORDER_STATUSES = ['processing','confirmed','shipped','delivered','cancelled'];

export default function AdminOrders() {
  const [orders,   setOrders]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState('');
  const [updating, setUpdating] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const load = (status = '') => {
    setLoading(true);
    const query = status ? `?status=${status}` : '';
    API.get(`/orders${query}`)
      .then((r) => setOrders(r.data.orders || []))
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleStatusChange = async (orderId, status) => {
    setUpdating(orderId);
    try {
      const res = await API.put(`/orders/${orderId}/status`, { status });
      setOrders((prev) => prev.map((o) => o._id === orderId ? res.data.order : o));
      toast.success('Order status updated!');
    } catch { toast.error('Failed to update'); }
    setUpdating(null);
  };

  const handleFilterChange = (status) => {
    setFilter(status);
    load(status);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 dark:bg-gray-950 min-h-screen">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h1 className="section-title">Orders ({orders.length})</h1>
        {/* Status filter tabs */}
        <div className="flex gap-2 flex-wrap">
          {['', ...ORDER_STATUSES].map((s) => (
            <button key={s} onClick={() => handleFilterChange(s)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors capitalize ${
                filter === s ? 'bg-primary text-gray-900' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {s || 'All'}
            </button>
          ))}
        </div>
      </div>

      {loading ? <div className="flex justify-center py-20"><Spinner size="lg" /></div> :
        orders.length === 0 ? (
          <EmptyState icon="📦" title="No orders found" message="Orders will appear here when customers purchase." />
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order._id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
                {/* Header row */}
                <div
                  onClick={() => setExpanded(expanded === order._id ? null : order._id)}
                  className="flex flex-wrap items-center justify-between p-5 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors gap-3"
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">
                        #{order.orderNumber || order._id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-xs text-gray-400">
                        {order.user?.name} · {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="font-bold text-gray-900 dark:text-white">₨{order.totalPrice?.toLocaleString()}</span>
                    <OrderStatusBadge status={order.orderStatus} />
                    <Badge variant={order.paymentStatus === 'paid' ? 'success' : 'warning'}>
                      {order.paymentStatus}
                    </Badge>
                    <FiChevronDown
                      className={`text-gray-400 transition-transform ${expanded === order._id ? 'rotate-180' : ''}`}
                      size={18}
                    />
                  </div>
                </div>

                {/* Expanded details */}
                {expanded === order._id && (
                  <div className="border-t border-gray-100 dark:border-gray-700 p-5 space-y-4">
                    {/* Items */}
                    <div>
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3">Order Items</p>
                      <div className="space-y-2">
                        {order.orderItems?.map((item, i) => (
                          <div key={i} className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700 rounded-xl p-3">
                            <img src={item.image} alt={item.name} className="w-12 h-12 object-contain rounded-lg bg-white dark:bg-gray-600 p-1" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{item.name}</p>
                              <p className="text-xs text-gray-400">₨{item.price?.toLocaleString()} × {item.quantity}</p>
                            </div>
                            <p className="font-bold text-sm text-gray-900 dark:text-white">₨{(item.price * item.quantity)?.toLocaleString()}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping + Update Status */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Shipping Address</p>
                        <div className="text-sm text-gray-700 dark:text-gray-300 space-y-0.5">
                          <p className="font-medium">{order.shippingAddress?.fullName}</p>
                          <p>{order.shippingAddress?.street}</p>
                          <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}</p>
                          <p>{order.shippingAddress?.phone}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Update Status</p>
                        <div className="flex gap-2 flex-wrap">
                          {ORDER_STATUSES.map((s) => (
                            <button key={s} onClick={() => handleStatusChange(order._id, s)}
                              disabled={updating === order._id || order.orderStatus === s}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                                order.orderStatus === s
                                  ? 'bg-primary text-gray-900 cursor-default'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                              }`}
                            >
                              {updating === order._id ? '...' : s}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      }
    </div>
  );
}
