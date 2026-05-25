// pages/auth/LoginPage.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { loginUser } from '../../redux/slices/authSlice';
import { Spinner } from '../../components/common';

export default function LoginPage() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { loading } = useSelector((s) => s.auth);

  const [form,    setForm]    = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [errors,  setErrors]  = useState({});

  const validate = () => {
    const e = {};
    if (!form.email)                    e.email    = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password)                 e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const result = await dispatch(loginUser(form));
    if (loginUser.fulfilled.match(result)) navigate('/');
  };

  return (
    <div className="min-h-screen flex dark:bg-gray-950">
      {/* Left banner */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-amazon-dark to-amazon-nav items-center justify-center p-12">
        <div className="text-center">
          <div className="text-8xl mb-6">🛒</div>
          <h2 className="text-4xl font-display font-black text-white mb-3">ShopNest</h2>
          <p className="text-gray-300 text-lg">Your one-stop shopping destination</p>
          <div className="mt-8 grid grid-cols-2 gap-4 text-sm text-gray-400">
            {['🚚 Fast Delivery','🔒 Secure Payments','↩️ Easy Returns','⭐ Top Brands'].map((t) => (
              <div key={t} className="bg-white/5 rounded-xl p-3">{t}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display font-black text-gray-900 dark:text-white mb-2">Welcome back</h1>
            <p className="text-gray-500 dark:text-gray-400">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={`input-field pl-11 ${errors.email ? 'border-red-400 ring-red-200' : ''}`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Password</label>
                <Link to="/forgot-password" className="text-sm text-primary hover:text-primary-dark">Forgot?</Link>
              </div>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type={showPwd ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className={`input-field pl-11 pr-11 ${errors.password ? 'border-red-400' : ''}`}
                />
                <button type="button" onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPwd ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <button type="submit" disabled={loading} className="w-full btn-primary py-4 text-base font-bold flex items-center justify-center gap-2">
              {loading && <Spinner size="sm" color="gray" />}
              Sign In
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary font-semibold hover:text-primary-dark">Create one</Link>
          </p>

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
            <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-1">Demo Credentials</p>
            <p className="text-xs text-blue-600 dark:text-blue-300">Admin: admin@shopnest.com / admin123</p>
            <p className="text-xs text-blue-600 dark:text-blue-300">User: user@shopnest.com / user123</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
