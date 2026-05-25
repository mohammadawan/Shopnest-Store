// components/home/HeroBanner.jsx — Animated Hero Slider

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const slides = [
  {
    id: 1,
    title:    'Mega Sale is Live!',
    subtitle: 'Up to 70% off on Electronics, Fashion & More',
    cta:      'Shop Now',
    link:     '/products?isFlashSale=true',
    badge:    '⚡ Flash Sale',
    bg:       'from-amazon-dark via-[#1a2433] to-amazon-nav',
    accent:   'text-primary',
    emoji:    '🎉',
  },
  {
    id: 2,
    title:    'New Season Collection',
    subtitle: 'Discover the latest trends in fashion and lifestyle',
    cta:      'Explore Collection',
    link:     '/products',
    badge:    '✨ New Arrivals',
    bg:       'from-[#0d1b2a] via-[#1b3a4b] to-[#132a3a]',
    accent:   'text-cyan-400',
    emoji:    '👗',
  },
  {
    id: 3,
    title:    'Electronics Deals',
    subtitle: 'Best prices on smartphones, laptops, accessories',
    cta:      'View Deals',
    link:     '/products',
    badge:    '💻 Tech Sale',
    bg:       'from-[#1a0a2e] via-[#2d1b5e] to-[#3d2080]',
    accent:   'text-purple-400',
    emoji:    '📱',
  },
];

export function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [auto,    setAuto]    = useState(true);

  useEffect(() => {
    if (!auto) return;
    const id = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, [auto]);

  const prev = () => { setCurrent((c) => (c - 1 + slides.length) % slides.length); setAuto(false); };
  const next = () => { setCurrent((c) => (c + 1) % slides.length); setAuto(false); };

  const slide = slides[current];

  return (
    <div className={`relative overflow-hidden bg-gradient-to-r ${slide.bg} transition-all duration-700`} style={{ minHeight: 420 }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -60 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-center gap-12"
        >
          {/* Text */}
          <div className="flex-1 text-center md:text-left">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 bg-white/10 ${slide.accent}`}>
              {slide.badge}
            </span>
            <h1 className="text-4xl md:text-6xl font-display font-black text-white leading-tight mb-4">
              {slide.title}
            </h1>
            <p className="text-gray-300 text-lg mb-8 max-w-lg">
              {slide.subtitle}
            </p>
            <Link
              to={slide.link}
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-gray-900 font-bold px-8 py-4 rounded-xl transition-all duration-200 text-lg shadow-lg hover:shadow-primary/30 hover:shadow-2xl"
            >
              {slide.cta} →
            </Link>
          </div>

          {/* Emoji illustration */}
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            className="text-9xl md:text-[10rem] select-none"
          >
            {slide.emoji}
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors">
        <FiChevronLeft size={20} />
      </button>
      <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors">
        <FiChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => { setCurrent(i); setAuto(false); }}
            className={`h-2 rounded-full transition-all duration-300 ${i === current ? 'w-8 bg-primary' : 'w-2 bg-white/40'}`}
          />
        ))}
      </div>
    </div>
  );
}

// ── Category Grid ─────────────────────────────

const CATEGORY_ICONS = [
  { name: 'Electronics',  icon: '💻', color: 'from-blue-500 to-cyan-500' },
  { name: 'Fashion',      icon: '👗', color: 'from-pink-500 to-rose-500' },
  { name: 'Home',         icon: '🏠', color: 'from-orange-500 to-amber-500' },
  { name: 'Sports',       icon: '⚽', color: 'from-green-500 to-emerald-500' },
  { name: 'Beauty',       icon: '💄', color: 'from-purple-500 to-pink-500' },
  { name: 'Books',        icon: '📚', color: 'from-yellow-500 to-orange-500' },
  { name: 'Toys',         icon: '🧸', color: 'from-red-500 to-pink-500' },
  { name: 'Groceries',    icon: '🛒', color: 'from-teal-500 to-green-500' },
];

export function CategoryGrid({ categories }) {
  const display = categories.length > 0
    ? categories.map((c, i) => ({ ...c, icon: c.icon || CATEGORY_ICONS[i % CATEGORY_ICONS.length].icon, color: CATEGORY_ICONS[i % CATEGORY_ICONS.length].color }))
    : CATEGORY_ICONS;

  return (
    <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
      {display.slice(0, 8).map((cat, i) => (
        <motion.a
          key={cat._id || i}
          href={cat._id ? `/products?category=${cat._id}` : `/products`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05 }}
          whileHover={{ scale: 1.05 }}
          className="flex flex-col items-center gap-2 group cursor-pointer"
        >
          <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${cat.color || 'from-gray-400 to-gray-500'} flex items-center justify-center text-2xl shadow-lg group-hover:shadow-xl transition-all duration-200`}>
            {cat.icon}
          </div>
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center line-clamp-1">
            {cat.name}
          </span>
        </motion.a>
      ))}
    </div>
  );
}

// ── Flash Sale Banner ─────────────────────────

export function FlashSaleBanner() {
  const [timeLeft, setTimeLeft] = useState({ h: 5, m: 59, s: 59 });

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.s > 0)          return { ...prev, s: prev.s - 1 };
        if (prev.m > 0)          return { ...prev, m: prev.m - 1, s: 59 };
        if (prev.h > 0)          return { h: prev.h - 1, m: 59, s: 59 };
        return { h: 0, m: 0, s: 0 };
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <div className="bg-gradient-to-r from-red-600 to-orange-500 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-3xl">⚡</span>
          <h3 className="text-white font-display font-black text-2xl">Flash Sale!</h3>
        </div>
        <p className="text-red-100 text-sm">Limited time offer — grab deals before they're gone!</p>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-red-100 text-sm font-medium">Ends in:</span>
        {[pad(timeLeft.h), pad(timeLeft.m), pad(timeLeft.s)].map((t, i) => (
          <React.Fragment key={i}>
            <div className="bg-white/20 backdrop-blur rounded-xl w-14 h-14 flex flex-col items-center justify-center">
              <span className="text-white font-black text-xl leading-none">{t}</span>
              <span className="text-red-100 text-xs">{['HRS','MIN','SEC'][i]}</span>
            </div>
            {i < 2 && <span className="text-white font-bold text-xl">:</span>}
          </React.Fragment>
        ))}
        <Link
          to="/products?isFlashSale=true"
          className="ml-2 bg-white text-red-600 font-bold px-6 py-3 rounded-xl hover:bg-red-50 transition-colors whitespace-nowrap"
        >
          Shop Now
        </Link>
      </div>
    </div>
  );
}
