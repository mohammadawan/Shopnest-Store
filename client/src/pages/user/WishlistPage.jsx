// pages/user/WishlistPage.jsx

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { EmptyState, Spinner } from '../../components/common';
import ProductCard from '../../components/product/ProductCard';
import API from '../../utils/api';

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    API.get('/wishlist')
      .then((r) => setWishlist(r.data.wishlist))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 dark:bg-gray-950 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <h1 className="section-title">My Wishlist</h1>
        <span className="text-gray-500 text-sm">{wishlist.length} item{wishlist.length !== 1 ? 's' : ''}</span>
      </div>

      {wishlist.length === 0 ? (
        <EmptyState icon="❤️" title="Your wishlist is empty" message="Save items you love by clicking the heart icon on any product."
          action={<Link to="/products" className="btn-primary">Discover Products</Link>} />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {wishlist.map((product, i) => (
            <ProductCard key={product._id} product={product} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
