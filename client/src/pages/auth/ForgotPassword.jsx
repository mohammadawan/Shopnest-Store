// pages/auth/ForgotPassword.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import { toast } from 'react-toastify';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent,  setSent]  = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) { toast.error('Please enter your email'); return; }
    // In production, call API to send reset link
    setSent(true);
    toast.success('Password reset link sent! (Feature coming soon)');
  };

  return (
    <div className="min-h-screen flex items-center justify-center dark:bg-gray-950 p-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm">
          <Link to="/login" className="flex items-center gap-2 text-gray-500 hover:text-primary text-sm mb-6 transition-colors">
            <FiArrowLeft size={16} /> Back to Sign In
          </Link>

          <div className="text-center mb-8">
            <div className="text-5xl mb-4">{sent ? '✅' : '🔐'}</div>
            <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-2">
              {sent ? 'Check your email' : 'Reset Password'}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {sent ? `We sent a reset link to ${email}` : "Enter your email and we'll send you a reset link"}
            </p>
          </div>

          {!sent && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="email" placeholder="your@email.com" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-11" required />
              </div>
              <button type="submit" className="w-full btn-primary py-4 font-bold">
                Send Reset Link
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
