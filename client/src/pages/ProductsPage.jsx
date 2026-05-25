// pages/ProductsPage.jsx — Product Listing with Filters

import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiFilter, FiX, FiChevronDown, FiGrid, FiList } from 'react-icons/fi';
import { fetchProducts, fetchCategories, setFilters, clearFilters } from '../redux/slices/productSlice';
import ProductCard from '../components/product/ProductCard';
import { ProductGridSkeleton, EmptyState, SectionHeader } from '../components/common';

const SORT_OPTIONS = [
  { label: 'Newest First',    value: '-createdAt' },
  { label: 'Price: Low→High',value: 'price' },
  { label: 'Price: High→Low',value: '-price' },
  { label: 'Best Rated',     value: '-ratings' },
  { label: 'Most Reviews',   value: '-numReviews' },
];

const PRICE_RANGES = [
  { label: 'Under ₨500',     min: 0,    max: 500 },
  { label: '₨500 – ₨1,000', min: 500,  max: 1000 },
  { label: '₨1,000 – ₨5,000', min: 1000, max: 5000 },
  { label: '₨5,000 – ₨15,000', min: 5000, max: 15000 },
  { label: 'Above ₨15,000', min: 15000, max: '' },
];

export default function ProductsPage() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { products, categories, loading, pagination, filters } = useSelector((s) => s.product);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [localFilters, setLocalFilters] = useState({
    sort: '-createdAt', category: '', minPrice: '', maxPrice: '', search: '',
  });

  // Sync URL params to filters
  useEffect(() => {
    const search   = searchParams.get('search')      || '';
    const category = searchParams.get('category')    || '';
    const featured = searchParams.get('featured')    || '';
    const flash    = searchParams.get('isFlashSale') || '';
    const best     = searchParams.get('isBestSeller')|| '';

    const newFilters = { search, category };
    if (featured)    newFilters.featured = true;
    if (flash)       newFilters.isFlashSale = true;
    if (best)        newFilters.isBestSeller = true;

    setLocalFilters((prev) => ({ ...prev, ...newFilters }));
    dispatch(setFilters(newFilters));
  }, [searchParams, dispatch]);

  const loadProducts = useCallback(() => {
    dispatch(fetchProducts({ ...localFilters, page, limit: 12 }));
  }, [dispatch, localFilters, page]);

  useEffect(() => { loadProducts(); }, [loadProducts]);
  useEffect(() => { dispatch(fetchCategories()); }, [dispatch]);

  const handleFilterChange = (key, value) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handlePriceRange = (range) => {
    setLocalFilters((prev) => ({ ...prev, minPrice: range.min, maxPrice: range.max }));
    setPage(1);
  };

  const handleClearFilters = () => {
    const reset = { sort: '-createdAt', category: '', minPrice: '', maxPrice: '', search: '' };
    setLocalFilters(reset);
    dispatch(clearFilters());
    setPage(1);
  };

  const pageTitle = searchParams.get('search')
    ? `Results for "${searchParams.get('search')}"`
    : searchParams.get('isFlashSale')  ? '⚡ Flash Sale'
    : searchParams.get('isBestSeller') ? '🏆 Best Sellers'
    : searchParams.get('featured')     ? '⭐ Featured Products'
    : 'All Products';

  // Sidebar content
  const Sidebar = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Categories</h3>
        <div className="space-y-1">
          <button
            onClick={() => handleFilterChange('category', '')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              !localFilters.category ? 'bg-primary/10 text-primary font-semibold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => handleFilterChange('category', cat._id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                localFilters.category === cat._id ? 'bg-primary/10 text-primary font-semibold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Price Range</h3>
        <div className="space-y-1">
          {PRICE_RANGES.map((range, i) => (
            <button
              key={i}
              onClick={() => handlePriceRange(range)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                localFilters.minPrice === range.min && localFilters.maxPrice === range.max
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
        {/* Custom range */}
        <div className="mt-3 flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={localFilters.minPrice}
            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            className="input-field text-xs py-2"
          />
          <input
            type="number"
            placeholder="Max"
            value={localFilters.maxPrice}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            className="input-field text-xs py-2"
          />
        </div>
      </div>

      {/* Clear filters */}
      <button
        onClick={handleClearFilters}
        className="w-full py-2.5 border-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 rounded-lg text-sm font-medium hover:border-primary hover:text-primary transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 dark:bg-gray-950 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="section-title">{pageTitle}</h1>
          {!loading && (
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              {pagination.total || 0} products found
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile filter toggle */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-primary transition-colors lg:hidden"
          >
            <FiFilter size={16} /> Filters
          </button>

          {/* Sort */}
          <div className="relative">
            <select
              value={localFilters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="appearance-none input-field py-2.5 pr-8 text-sm cursor-pointer"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm sticky top-24">
            <Sidebar />
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="absolute left-0 top-0 h-full w-72 bg-white dark:bg-gray-900 p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-lg text-gray-900 dark:text-white">Filters</h2>
                <button onClick={() => setSidebarOpen(false)} className="text-gray-500"><FiX size={20} /></button>
              </div>
              <Sidebar />
            </motion.div>
          </div>
        )}

        {/* Products Grid */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <ProductGridSkeleton count={12} />
          ) : products.length === 0 ? (
            <EmptyState
              icon="🔍"
              title="No products found"
              message="Try adjusting your filters or search terms."
              action={
                <button onClick={handleClearFilters} className="btn-primary">
                  Clear Filters
                </button>
              }
            />
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((p, i) => (
                  <ProductCard key={p._id} product={p} index={i} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex justify-center mt-10 gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm disabled:opacity-40 hover:border-primary hover:text-primary transition-colors"
                  >
                    ← Prev
                  </button>
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === pagination.pages || Math.abs(p - page) <= 1)
                    .map((p, idx, arr) => (
                      <React.Fragment key={p}>
                        {idx > 0 && arr[idx - 1] !== p - 1 && (
                          <span className="px-3 py-2 text-gray-400">…</span>
                        )}
                        <button
                          onClick={() => setPage(p)}
                          className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                            p === page ? 'bg-primary text-gray-900 font-bold' : 'border border-gray-200 dark:border-gray-700 hover:border-primary hover:text-primary'
                          }`}
                        >
                          {p}
                        </button>
                      </React.Fragment>
                    ))}
                  <button
                    onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                    disabled={page === pagination.pages}
                    className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm disabled:opacity-40 hover:border-primary hover:text-primary transition-colors"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
