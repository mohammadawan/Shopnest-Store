// pages/HomePage.jsx — Main Home Page

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { fetchProducts, fetchCategories } from '../redux/slices/productSlice';
import { HeroBanner, CategoryGrid, FlashSaleBanner } from '../components/home/HeroBanner';
import ProductCard from '../components/product/ProductCard';
import { SectionHeader, ProductGridSkeleton } from '../components/common';
import { FiArrowRight, FiTruck, FiShield, FiRefreshCw, FiHeadphones } from 'react-icons/fi';

const FEATURES = [
  { icon: FiTruck,      title: 'Free Delivery',     desc: 'On orders above ₨2,000',  color: 'text-blue-500' },
  { icon: FiShield,     title: 'Secure Payments',   desc: '100% protected checkout', color: 'text-green-500' },
  { icon: FiRefreshCw,  title: 'Easy Returns',      desc: '7-day return policy',     color: 'text-purple-500' },
  { icon: FiHeadphones, title: '24/7 Support',      desc: 'Always here to help',     color: 'text-orange-500' },
];

export default function HomePage() {
  const dispatch = useDispatch();
  const { products, categories, loading } = useSelector((s) => s.product);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProducts({ limit: 16 }));
  }, [dispatch]);

  const featured    = products.filter((p) => p.featured).slice(0, 8);
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);
  const flashSale   = products.filter((p) => p.isFlashSale).slice(0, 4);
  const trending    = products.slice(0, 8);

  return (
    <div className="dark:bg-gray-950">
      {/* Hero */}
      <HeroBanner />

      <div className="max-w-7xl mx-auto px-4">

        {/* Feature strips */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8">
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm"
            >
              <div className={`w-10 h-10 rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center justify-center ${f.color}`}>
                <f.icon size={20} />
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-900 dark:text-white">{f.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Categories */}
        <section className="mb-12">
          <SectionHeader
            title="Shop by Category"
            subtitle="Find exactly what you're looking for"
          />
          <CategoryGrid categories={categories} />
        </section>

        {/* Flash Sale */}
        <section className="mb-12">
          <FlashSaleBanner />
          {flashSale.length > 0 && (
            <div className="mt-6">
              {loading ? <ProductGridSkeleton count={4} /> : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {flashSale.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
                </div>
              )}
            </div>
          )}
        </section>

        {/* Featured Products */}
        <section className="mb-12">
          <SectionHeader
            title="Featured Products"
            subtitle="Handpicked by our team"
            action={
              <Link to="/products?featured=true" className="flex items-center gap-1 text-primary hover:text-primary-dark font-semibold text-sm transition-colors">
                View all <FiArrowRight size={16} />
              </Link>
            }
          />
          {loading ? <ProductGridSkeleton count={8} /> : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {(featured.length > 0 ? featured : trending).map((p, i) => (
                <ProductCard key={p._id} product={p} index={i} />
              ))}
            </div>
          )}
        </section>

        {/* Best Sellers */}
        {bestSellers.length > 0 && (
          <section className="mb-12">
            <SectionHeader
              title="🏆 Best Sellers"
              subtitle="Most loved by our customers"
              action={
                <Link to="/products?isBestSeller=true" className="flex items-center gap-1 text-primary hover:text-primary-dark font-semibold text-sm transition-colors">
                  View all <FiArrowRight size={16} />
                </Link>
              }
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {bestSellers.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
            </div>
          </section>
        )}

        {/* Trending */}
        <section className="mb-12">
          <SectionHeader
            title="🔥 Trending Now"
            subtitle="What everyone's buying"
            action={
              <Link to="/products" className="flex items-center gap-1 text-primary hover:text-primary-dark font-semibold text-sm transition-colors">
                See all <FiArrowRight size={16} />
              </Link>
            }
          />
          {loading ? <ProductGridSkeleton count={8} /> : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {trending.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
            </div>
          )}
        </section>

        {/* Newsletter */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-amazon-dark to-amazon-nav rounded-2xl p-10 text-center"
          >
            <h2 className="text-3xl font-display font-black text-white mb-2">
              Stay in the Loop 📧
            </h2>
            <p className="text-gray-300 mb-6">Get exclusive deals, new arrivals & offers delivered to your inbox.</p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-5 py-3 rounded-xl border-none outline-none text-gray-900 text-sm"
              />
              <button type="submit" className="bg-primary hover:bg-primary-dark text-gray-900 font-bold px-6 py-3 rounded-xl transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
