// components/layout/Navbar.jsx — Amazon-style Navbar

import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch, FiShoppingCart, FiUser, FiMenu, FiX, FiHeart,
  FiPackage, FiLogOut, FiSettings, FiMoon, FiSun, FiChevronDown,
} from 'react-icons/fi';
import { logout } from '../../redux/slices/authSlice';
import { toggleDarkMode } from '../../redux/slices/uiSlice';
import { selectCartCount } from '../../redux/slices/cartSlice';
import { fetchProducts, setFilters } from '../../redux/slices/productSlice';

export default function Navbar() {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const { user, isLoggedIn } = useSelector((s) => s.auth);
  const { darkMode } = useSelector((s) => s.ui);
  const cartCount  = useSelector(selectCartCount);
  const { categories } = useSelector((s) => s.product);

  const [search,     setSearch]     = useState('');
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [userMenu,   setUserMenu]   = useState(false);
  const [scrolled,   setScrolled]   = useState(false);

  const userMenuRef = useRef(null);

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Click outside user menu
  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    dispatch(setFilters({ search: search.trim() }));
    navigate(`/products?search=${encodeURIComponent(search.trim())}`);
    setSearch('');
  };

  const handleLogout = () => {
    dispatch(logout());
    setUserMenu(false);
    navigate('/');
  };

  return (
    <>
      {/* ── Top Bar ─────────────────────────────── */}
      <header className={`sticky top-0 z-50 transition-shadow duration-300 ${scrolled ? 'shadow-xl' : ''}`}>

        {/* Main Nav */}
        <nav className="bg-amazon-dark">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-3">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-1 shrink-0 group">
              <span className="text-white font-display font-black text-xl tracking-tight">
                Shop<span className="text-primary">Nest</span>
              </span>
              <span className="text-primary text-xs mt-1">🛒</span>
            </Link>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 flex max-w-2xl mx-auto hidden md:flex">
              <input
                type="text"
                placeholder="Search products, brands..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 px-4 py-2.5 text-sm bg-white border-none outline-none rounded-l-lg text-gray-900"
              />
              <button
                type="submit"
                className="bg-primary hover:bg-primary-dark px-5 rounded-r-lg flex items-center justify-center transition-colors"
              >
                <FiSearch className="text-gray-900 text-xl" />
              </button>
            </form>

            {/* Right Actions */}
            <div className="flex items-center gap-2 ml-auto">
              {/* Dark mode toggle */}
              <button
                onClick={() => dispatch(toggleDarkMode())}
                className="text-white p-2 hover:text-primary transition-colors hidden md:block"
                title="Toggle dark mode"
              >
                {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
              </button>

              {/* Wishlist */}
              {isLoggedIn && (
                <Link to="/wishlist" className="text-white p-2 hover:text-primary transition-colors hidden md:block">
                  <FiHeart size={20} />
                </Link>
              )}

              {/* User Menu */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenu((v) => !v)}
                  className="flex items-center gap-1.5 text-white hover:text-primary transition-colors px-2 py-1 rounded"
                >
                  <div className="w-8 h-8 rounded-full bg-amazon-nav flex items-center justify-center overflow-hidden">
                    {user?.avatar?.url ? (
                      <img src={user.avatar.url} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <FiUser size={16} />
                    )}
                  </div>
                  <span className="hidden md:block text-sm font-medium">
                    {isLoggedIn ? user?.name?.split(' ')[0] : 'Sign In'}
                  </span>
                  <FiChevronDown size={14} className={`transition-transform ${userMenu ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {userMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-12 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50"
                    >
                      {isLoggedIn ? (
                        <>
                          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-100 dark:border-gray-600">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                          </div>
                          {user?.role === 'admin' && (
                            <Link to="/admin" onClick={() => setUserMenu(false)}
                              className="flex items-center gap-3 px-4 py-3 text-sm text-purple-600 font-semibold hover:bg-purple-50 transition-colors">
                              <FiSettings size={16} /> Admin Dashboard
                            </Link>
                          )}
                          <Link to="/profile" onClick={() => setUserMenu(false)}
                            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            <FiUser size={16} /> My Profile
                          </Link>
                          <Link to="/orders" onClick={() => setUserMenu(false)}
                            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            <FiPackage size={16} /> My Orders
                          </Link>
                          <Link to="/wishlist" onClick={() => setUserMenu(false)}
                            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            <FiHeart size={16} /> Wishlist
                          </Link>
                          <button onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 w-full hover:bg-red-50 transition-colors border-t border-gray-100 dark:border-gray-600">
                            <FiLogOut size={16} /> Logout
                          </button>
                        </>
                      ) : (
                        <>
                          <Link to="/login" onClick={() => setUserMenu(false)}
                            className="block px-4 py-3 text-sm font-semibold text-center text-white bg-primary hover:bg-primary-dark m-3 rounded-lg transition-colors">
                            Sign In
                          </Link>
                          <Link to="/signup" onClick={() => setUserMenu(false)}
                            className="block px-4 py-3 text-sm text-center text-gray-700 hover:bg-gray-50 transition-colors">
                            Create Account
                          </Link>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Cart */}
              <Link to="/cart" className="relative text-white hover:text-primary transition-colors p-2">
                <FiShoppingCart size={24} />
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-primary text-gray-900 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
                  >
                    {cartCount > 99 ? '99+' : cartCount}
                  </motion.span>
                )}
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="text-white p-2 md:hidden"
              >
                {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden px-4 pb-3">
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 px-4 py-2.5 text-sm bg-white rounded-l-lg outline-none text-gray-900"
              />
              <button type="submit" className="bg-primary px-4 rounded-r-lg">
                <FiSearch className="text-gray-900" />
              </button>
            </form>
          </div>
        </nav>

        {/* ── Category Bar ──────────────────────── */}
        <div className="bg-amazon-nav text-white text-sm hidden md:block">
          <div className="max-w-7xl mx-auto px-4 h-10 flex items-center gap-6 overflow-x-auto scrollbar-hide">
            <Link to="/products" className="whitespace-nowrap hover:text-primary transition-colors font-medium">
              All Products
            </Link>
            {categories.slice(0, 8).map((cat) => (
              <Link
                key={cat._id}
                to={`/products?category=${cat._id}`}
                className="whitespace-nowrap hover:text-primary transition-colors"
              >
                {cat.icon} {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* ── Mobile Side Menu ─────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed left-0 top-0 h-full w-72 bg-white dark:bg-gray-900 z-50 overflow-y-auto"
            >
              <div className="bg-amazon-dark p-4 flex items-center justify-between">
                <span className="text-white font-display font-bold text-lg">
                  Shop<span className="text-primary">Nest</span>
                </span>
                <button onClick={() => setMenuOpen(false)} className="text-white">
                  <FiX size={24} />
                </button>
              </div>

              {isLoggedIn && (
                <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                  <p className="font-semibold text-gray-900 dark:text-white">{user?.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                </div>
              )}

              <nav className="p-4 space-y-1">
                {[
                  { to: '/', label: 'Home' },
                  { to: '/products', label: 'Products' },
                  ...(isLoggedIn ? [
                    { to: '/profile',  label: 'My Profile' },
                    { to: '/orders',   label: 'My Orders' },
                    { to: '/wishlist', label: 'Wishlist' },
                    { to: '/cart',     label: `Cart (${cartCount})` },
                  ] : [
                    { to: '/login',  label: 'Sign In' },
                    { to: '/signup', label: 'Create Account' },
                  ]),
                ].map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}

                <button
                  onClick={() => dispatch(toggleDarkMode())}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
                  {darkMode ? 'Light Mode' : 'Dark Mode'}
                </button>

                {isLoggedIn && (
                  <button
                    onClick={() => { handleLogout(); setMenuOpen(false); }}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <FiLogOut size={18} /> Logout
                  </button>
                )}
              </nav>

              <div className="p-4 border-t border-gray-100 dark:border-gray-700">
                <p className="text-xs font-semibold text-gray-500 mb-3">CATEGORIES</p>
                {categories.map((cat) => (
                  <Link
                    key={cat._id}
                    to={`/products?category=${cat._id}`}
                    onClick={() => setMenuOpen(false)}
                    className="block px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
                  >
                    {cat.icon} {cat.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
