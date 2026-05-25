// pages/auth/SignupPage.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiCheck } from 'react-icons/fi';
import { registerUser } from '../../redux/slices/authSlice';
import { Spinner } from '../../components/common';

export default function SignupPage() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { loading } = useSelector((s) => s.auth);

  const [form,    setForm]    = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [errors,  setErrors]  = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim())              e.name     = 'Name is required';
    if (!form.email)                    e.email    = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password)                 e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirm) e.confirm  = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const result = await dispatch(registerUser({ name: form.name, email: form.email, password: form.password }));
    if (registerUser.fulfilled.match(result)) navigate('/');
  };

  const pwdStrength = form.password.length >= 8 && /[A-Z]/.test(form.password) && /[0-9]/.test(form.password);

  return (
    <div className="min-h-screen flex dark:bg-gray-950">
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[#0d1b2a] to-[#1b3a4b] items-center justify-center p-12">
        <div className="text-center">
          <div className="text-8xl mb-6">🎁</div>
          <h2 className="text-4xl font-display font-black text-white mb-3">Join ShopNest</h2>
          <p className="text-gray-300 text-lg mb-8">Get exclusive deals as a member</p>
          {['10% off your first order','Early access to sales','Track all your orders','Personalised recommendations'].map((b, i) => (
            <div key={i} className="flex items-center gap-3 text-gray-300 mb-3">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0">
                <FiCheck size={12} className="text-gray-900" />
              </div>
              <span className="text-sm">{b}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display font-black text-gray-900 dark:text-white mb-2">Create Account</h1>
            <p className="text-gray-500 dark:text-gray-400">Join thousands of happy shoppers</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="text" placeholder="Muhammad Ali" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={`input-field pl-11 ${errors.name ? 'border-red-400' : ''}`} />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="email" placeholder="you@example.com" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={`input-field pl-11 ${errors.email ? 'border-red-400' : ''}`} />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type={showPwd ? 'text' : 'password'} placeholder="Min. 6 characters" value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className={`input-field pl-11 pr-11 ${errors.password ? 'border-red-400' : ''}`} />
                <button type="button" onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPwd ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
              {form.password && (
                <div className="flex gap-1 mt-2">
                  {[form.password.length >= 6, /[A-Z]/.test(form.password), /[0-9]/.test(form.password)].map((ok, i) => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${ok ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
                  ))}
                </div>
              )}
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Confirm */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Confirm Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="password" placeholder="Re-enter password" value={form.confirm}
                  onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                  className={`input-field pl-11 ${errors.confirm ? 'border-red-400' : ''}`} />
              </div>
              {errors.confirm && <p className="text-red-500 text-xs mt-1">{errors.confirm}</p>}
            </div>

            <button type="submit" disabled={loading} className="w-full btn-primary py-4 text-base font-bold flex items-center justify-center gap-2">
              {loading && <Spinner size="sm" color="gray" />}
              Create Account
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:text-primary-dark">Sign In</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
