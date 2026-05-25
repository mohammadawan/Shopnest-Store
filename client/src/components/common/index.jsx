// components/common/index.jsx — Reusable UI Components

import React from 'react';
import { FiStar } from 'react-icons/fi';
import { motion } from 'framer-motion';

// ── Skeleton ─────────────────────────────────
export const Skeleton = ({ className = '' }) => (
  <div className={`skeleton ${className}`} />
);

export const ProductCardSkeleton = () => (
  <div className="card p-4 animate-pulse">
    <Skeleton className="w-full aspect-square mb-3 rounded-lg" />
    <Skeleton className="h-4 w-3/4 mb-2" />
    <Skeleton className="h-3 w-1/2 mb-3" />
    <Skeleton className="h-6 w-1/3 mb-3" />
    <Skeleton className="h-10 w-full rounded-lg" />
  </div>
);

export const ProductGridSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

// ── Star Rating ───────────────────────────────
export const StarRating = ({ rating = 0, size = 16, showCount = false, count = 0 }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <FiStar
          key={star}
          size={size}
          className={star <= Math.round(rating) ? 'text-primary fill-primary' : 'text-gray-300'}
          style={{ fill: star <= Math.round(rating) ? '#FF9900' : 'none' }}
        />
      ))}
      {showCount && (
        <span className="text-xs text-gray-500 ml-1">({count})</span>
      )}
    </div>
  );
};

// ── Badge ─────────────────────────────────────
export const Badge = ({ children, variant = 'primary', className = '' }) => {
  const variants = {
    primary:   'bg-primary/10 text-primary',
    success:   'bg-green-100 text-green-700',
    danger:    'bg-red-100 text-red-700',
    warning:   'bg-yellow-100 text-yellow-700',
    info:      'bg-blue-100 text-blue-700',
    gray:      'bg-gray-100 text-gray-700',
  };
  return (
    <span className={`badge ${variants[variant] || variants.gray} ${className}`}>
      {children}
    </span>
  );
};

// ── Price Display ─────────────────────────────
export const PriceDisplay = ({ price, originalPrice, size = 'md' }) => {
  const sizeClasses = {
    sm:  { price: 'text-sm font-bold', original: 'text-xs', discount: 'text-xs' },
    md:  { price: 'text-lg font-bold', original: 'text-sm', discount: 'text-xs' },
    lg:  { price: 'text-2xl font-bold', original: 'text-base', discount: 'text-sm' },
    xl:  { price: 'text-3xl font-bold', original: 'text-lg',  discount: 'text-sm' },
  };
  const c = sizeClasses[size] || sizeClasses.md;
  const discount = originalPrice && originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <div className="flex items-baseline gap-2 flex-wrap">
      <span className={`text-gray-900 dark:text-white ${c.price}`}>
        ₨{price?.toLocaleString()}
      </span>
      {discount > 0 && (
        <>
          <span className={`text-gray-400 line-through ${c.original}`}>
            ₨{originalPrice?.toLocaleString()}
          </span>
          <Badge variant="danger" className={c.discount}>-{discount}%</Badge>
        </>
      )}
    </div>
  );
};

// ── Loading Spinner ───────────────────────────
export const Spinner = ({ size = 'md', color = 'primary' }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12', xl: 'w-16 h-16' };
  const colors = { primary: 'border-primary', white: 'border-white', gray: 'border-gray-400' };
  return (
    <div
      className={`${sizes[size] || sizes.md} rounded-full border-2 ${colors[color] || colors.primary} border-t-transparent animate-spin`}
    />
  );
};

export const FullPageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <Spinner size="xl" />
      <p className="mt-4 text-gray-500">Loading...</p>
    </div>
  </div>
);

// ── Empty State ───────────────────────────────
export const EmptyState = ({ icon, title, message, action }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-20 text-center"
  >
    <div className="text-6xl mb-4">{icon || '📦'}</div>
    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
    <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm">{message}</p>
    {action}
  </motion.div>
);

// ── Section Header ────────────────────────────
export const SectionHeader = ({ title, subtitle, action }) => (
  <div className="flex items-end justify-between mb-6">
    <div>
      <h2 className="section-title">{title}</h2>
      {subtitle && <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">{subtitle}</p>}
    </div>
    {action && action}
  </div>
);

// ── Order Status Badge ────────────────────────
export const OrderStatusBadge = ({ status }) => {
  const config = {
    processing: { label: 'Processing',  variant: 'warning' },
    confirmed:  { label: 'Confirmed',   variant: 'info' },
    shipped:    { label: 'Shipped',     variant: 'primary' },
    delivered:  { label: 'Delivered',   variant: 'success' },
    cancelled:  { label: 'Cancelled',   variant: 'danger' },
  };
  const { label, variant } = config[status] || { label: status, variant: 'gray' };
  return <Badge variant={variant}>{label}</Badge>;
};
