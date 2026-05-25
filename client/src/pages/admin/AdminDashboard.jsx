// pages/admin/AdminDashboard.jsx — Full Analytics Dashboard

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiUsers, FiPackage, FiShoppingBag, FiDollarSign,
  FiTrendingUp, FiArrowRight, FiAlertTriangle,
} from 'react-icons/fi';
import { OrderStatusBadge, Spinner } from '../../components/common';
import API from '../../utils/api';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const StatCard = ({ icon: Icon, label, value, sub, color, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm"
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
        <Icon size={22} className="text-white" />
      </div>
      <FiTrendingUp className="text-green-500" size={18} />
    </div>
    <p className="text-2xl font-display font-black text-gray-900 dark:text-white">{value}</p>
    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</p>
    {sub && <p className="text-xs text-green-600 dark:text-green-400 mt-1">{sub}</p>}
  </motion.div>
);

// Simple bar chart using divs (no external lib needed)
const MiniBarChart = ({ data }) => {
  if (!data || data.length === 0) return <p className="text-gray-400 text-sm text-center py-8">No sales data yet</p>;
  const max = Math.max(...data.map((d) => d.revenue), 1);
  return (
    <div className="flex items-end gap-2 h-32 mt-4">
      {data.map((d, i) => {
        const month = MONTHS[(d._id.month - 1)] || '';
        const pct   = Math.round((d.revenue / max) * 100);
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
            <div className="relative w-full">
              <div
                className="w-full bg-primary/20 rounded-t-lg transition-all duration-700 group-hover:bg-primary"
                style={{ height: `${Math.max(4, pct * 1.2)}px` }}
                title={`₨${d.revenue.toLocaleString()}`}
              />
            </div>
            <span className="text-xs text-gray-400">{month}</span>
          </div>
        );
      })}
    </div>
  );
};

export default function AdminDashboard() {
  const [stats,        setStats]        = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStock,     setLowStock]     = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    API.get('/admin/stats')
      .then((r) => {
        setStats(r.data.stats);
        setRecentOrders(r.data.recentOrders || []);
        setLowStock(r.data.lowStockProducts || []);
        setMonthlySales(r.data.monthlySales || []);
      })
      .catch(() => {
        // Fallback: use basic order endpoint
        API.get('/orders?limit=5').then((r) => {
          setRecentOrders(r.data.orders || []);
          setStats({ totalRevenue: r.data.revenue || 0, totalOrders: r.data.total || 0, totalUsers: 0, totalProducts: 0 });
        }).catch(() => {});
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 dark:bg-gray-950 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="section-title">Admin Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={FiDollarSign} label="Total Revenue"   value={`₨${(stats?.totalRevenue || 0).toLocaleString()}`} sub="All time earnings"    color="bg-green-500"  delay={0} />
        <StatCard icon={FiShoppingBag} label="Total Orders"   value={stats?.totalOrders   || 0} sub="All orders placed"  color="bg-blue-500"   delay={0.1} />
        <StatCard icon={FiUsers}       label="Customers"      value={stats?.totalUsers     || 0} sub="Registered users"  color="bg-purple-500" delay={0.2} />
        <StatCard icon={FiPackage}     label="Products"       value={stats?.totalProducts  || 0} sub="In catalog"        color="bg-orange-500" delay={0.3} />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { to: '/admin/products', label: 'Manage Products', icon: '📦', color: 'from-orange-500 to-red-500' },
          { to: '/admin/orders',   label: 'Manage Orders',   icon: '🛒', color: 'from-blue-500 to-cyan-500' },
          { to: '/admin/users',    label: 'Manage Users',    icon: '👥', color: 'from-purple-500 to-pink-500' },
          { to: '/products',       label: 'View Store',      icon: '🏪', color: 'from-green-500 to-teal-500' },
        ].map((item, i) => (
          <Link key={i} to={item.to}
            className={`bg-gradient-to-br ${item.color} rounded-2xl p-5 flex items-center gap-3 text-white hover:shadow-xl hover:scale-105 transition-all duration-200`}>
            <span className="text-3xl">{item.icon}</span>
            <span className="font-semibold text-sm leading-tight">{item.label}</span>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Monthly Sales Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-display font-bold text-lg text-gray-900 dark:text-white">Monthly Revenue</h2>
            <span className="text-xs text-gray-400">Last 6 months</span>
          </div>
          <MiniBarChart data={monthlySales} />
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <FiAlertTriangle className="text-orange-500" size={18} />
            <h2 className="font-display font-bold text-base text-gray-900 dark:text-white">Low Stock</h2>
          </div>
          {lowStock.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">All products well stocked ✓</p>
          ) : (
            <div className="space-y-3">
              {lowStock.map((p) => (
                <div key={p._id} className="flex items-center gap-3">
                  <img src={p.images?.[0]?.url || 'https://via.placeholder.com/40'} alt={p.name}
                    className="w-10 h-10 rounded-lg object-contain bg-gray-50 dark:bg-gray-700 p-1" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 dark:text-white line-clamp-1">{p.name}</p>
                    <p className={`text-xs font-bold ${p.stock === 0 ? 'text-red-600' : 'text-orange-500'}`}>
                      {p.stock === 0 ? 'OUT OF STOCK' : `${p.stock} left`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
          <h2 className="font-display font-bold text-lg text-gray-900 dark:text-white">Recent Orders</h2>
          <Link to="/admin/orders" className="flex items-center gap-1 text-primary hover:text-primary-dark text-sm font-medium transition-colors">
            View all <FiArrowRight size={14} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                {['Order','Customer','Items','Amount','Status','Date'].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {recentOrders.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-gray-400">No orders yet</td></tr>
              ) : recentOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs font-semibold text-gray-600 dark:text-gray-300">
                    #{order.orderNumber || order._id.slice(-6).toUpperCase()}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900 dark:text-white text-xs">{order.user?.name}</p>
                    <p className="text-xs text-gray-400">{order.user?.email}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs">
                    {order.orderItems?.length} item{order.orderItems?.length !== 1 ? 's' : ''}
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                    ₨{order.totalPrice?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4"><OrderStatusBadge status={order.orderStatus} /></td>
                  <td className="px-6 py-4 text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
