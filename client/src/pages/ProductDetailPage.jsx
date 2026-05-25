// pages/ProductDetailPage.jsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiHeart, FiShare2, FiTruck, FiShield, FiMinus, FiPlus, FiStar } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { fetchProduct } from '../redux/slices/productSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { StarRating, PriceDisplay, Badge, Spinner, OrderStatusBadge } from '../components/common';
import ProductCard from '../components/product/ProductCard';
import API from '../utils/api';

export default function ProductDetailPage() {
  const { id }     = useParams();
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const { product, productLoading } = useSelector((s) => s.product);
  const { isLoggedIn } = useSelector((s) => s.auth);

  const [selectedImg, setSelectedImg] = useState(0);
  const [quantity,    setQuantity]    = useState(1);
  const [addingCart,  setAddingCart]  = useState(false);
  const [wishlisted,  setWishlisted]  = useState(false);
  const [reviews,     setReviews]     = useState([]);
  const [related,     setRelated]     = useState([]);
  const [activeTab,   setActiveTab]   = useState('description');
  const [reviewForm,  setReviewForm]  = useState({ rating: 5, title: '', comment: '' });
  const [submitting,  setSubmitting]  = useState(false);

  useEffect(() => {
    dispatch(fetchProduct(id));
    window.scrollTo(0, 0);
  }, [id, dispatch]);

  useEffect(() => {
    if (!id) return;
    API.get(`/reviews/${id}`).then((r) => setReviews(r.data.reviews)).catch(() => {});
    API.get(`/products/${id}/related`).then((r) => setRelated(r.data.products)).catch(() => {});
  }, [id]);

  const handleAddToCart = async () => {
    if (!isLoggedIn) { navigate('/login'); return; }
    setAddingCart(true);
    await dispatch(addToCart({ productId: id, quantity }));
    setAddingCart(false);
  };

  const handleBuyNow = async () => {
    if (!isLoggedIn) { navigate('/login'); return; }
    setAddingCart(true);
    await dispatch(addToCart({ productId: id, quantity }));
    setAddingCart(false);
    navigate('/cart');
  };

  const handleWishlist = async () => {
    if (!isLoggedIn) { navigate('/login'); return; }
    try {
      await API.post('/wishlist/toggle', { productId: id });
      setWishlisted((v) => !v);
      toast.success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist ❤️');
    } catch { toast.error('Failed'); }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) { navigate('/login'); return; }
    setSubmitting(true);
    try {
      const res = await API.post('/reviews', { productId: id, ...reviewForm });
      setReviews((prev) => [res.data.review, ...prev]);
      setReviewForm({ rating: 5, title: '', comment: '' });
      toast.success('Review submitted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    }
    setSubmitting(false);
  };

  if (productLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12 animate-pulse">
          <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-2xl" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
            <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const { name, description, price, originalPrice, images, brand, stock, ratings, numReviews, specifications, category } = product;
  const mainImage = images?.[selectedImg]?.url || 'https://via.placeholder.com/600x600?text=No+Image';

  return (
    <div className="dark:bg-gray-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6 flex items-center gap-2">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-primary">Products</Link>
          {category && (
            <>
              <span>/</span>
              <Link to={`/products?category=${category._id}`} className="hover:text-primary">{category.name}</Link>
            </>
          )}
          <span>/</span>
          <span className="text-gray-900 dark:text-white line-clamp-1">{name}</span>
        </nav>

        {/* Main Product Section */}
        <div className="grid md:grid-cols-2 gap-10 mb-16">

          {/* Image Gallery */}
          <div className="space-y-4">
            <motion.div
              key={selectedImg}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-square bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden flex items-center justify-center border border-gray-100 dark:border-gray-700"
            >
              <img src={mainImage} alt={name} className="w-full h-full object-contain p-8" />
            </motion.div>
            {images?.length > 1 && (
              <div className="flex gap-3 overflow-x-auto scrollbar-hide">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImg(i)}
                    className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                      i === selectedImg ? 'border-primary' : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <img src={img.url} alt={`${name} ${i + 1}`} className="w-full h-full object-contain p-1" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-5">
            {brand && <p className="text-sm font-semibold text-primary uppercase tracking-wider">{brand}</p>}
            <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-white leading-tight">{name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <StarRating rating={ratings} size={18} />
              <span className="text-sm text-gray-500 dark:text-gray-400">({numReviews} reviews)</span>
              {stock > 0 ? (
                <Badge variant="success">✓ In Stock ({stock})</Badge>
              ) : (
                <Badge variant="danger">Out of Stock</Badge>
              )}
            </div>

            {/* Price */}
            <PriceDisplay price={price} originalPrice={originalPrice} size="xl" />

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">{description}</p>

            {/* Quantity */}
            {stock > 0 && (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Quantity:</span>
                <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400"
                  >
                    <FiMinus size={16} />
                  </button>
                  <span className="px-5 py-2.5 font-semibold text-gray-900 dark:text-white border-x border-gray-200 dark:border-gray-700 min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
                    className="px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400"
                  >
                    <FiPlus size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={handleAddToCart}
                disabled={stock <= 0 || addingCart}
                className="flex-1 btn-primary flex items-center justify-center gap-2 py-3 text-base disabled:opacity-50"
              >
                {addingCart ? <Spinner size="sm" color="gray" /> : <FiShoppingCart size={20} />}
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                disabled={stock <= 0}
                className="flex-1 btn-secondary flex items-center justify-center gap-2 py-3 text-base disabled:opacity-50"
              >
                Buy Now
              </button>
              <button
                onClick={handleWishlist}
                className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all ${
                  wishlisted ? 'border-red-500 bg-red-50 text-red-500' : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-red-300 hover:text-red-500'
                }`}
              >
                <FiHeart size={20} style={{ fill: wishlisted ? 'currentColor' : 'none' }} />
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {[
                { icon: FiTruck,  title: 'Free Delivery', desc: 'Orders above ₨2,000' },
                { icon: FiShield, title: 'Secure Payment', desc: '100% protected' },
              ].map((b, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <b.icon className="text-primary shrink-0" size={20} />
                  <div>
                    <p className="text-xs font-semibold text-gray-900 dark:text-white">{b.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-16">
          <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6 gap-6">
            {['description', 'specifications', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-semibold capitalize transition-colors border-b-2 -mb-px ${
                  activeTab === tab
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {tab} {tab === 'reviews' && `(${reviews.length})`}
              </button>
            ))}
          </div>

          {activeTab === 'description' && (
            <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed">
              <p>{description}</p>
            </div>
          )}

          {activeTab === 'specifications' && (
            <div className="max-w-lg">
              {specifications?.length > 0 ? (
                <table className="w-full text-sm">
                  <tbody>
                    {specifications.map((spec, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800' : ''}>
                        <td className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300 w-1/2">{spec.key}</td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500">No specifications available.</p>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-8">
              {/* Rating summary */}
              <div className="flex items-center gap-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                <div className="text-center">
                  <div className="text-5xl font-black text-gray-900 dark:text-white">{ratings || 0}</div>
                  <StarRating rating={ratings} size={20} />
                  <p className="text-sm text-gray-500 mt-1">{numReviews} reviews</p>
                </div>
                <div className="flex-1 space-y-2">
                  {[5,4,3,2,1].map((star) => {
                    const count = reviews.filter((r) => r.rating === star).length;
                    const pct   = reviews.length ? Math.round((count / reviews.length) * 100) : 0;
                    return (
                      <div key={star} className="flex items-center gap-3 text-sm">
                        <span className="text-gray-600 dark:text-gray-400 w-4">{star}</span>
                        <FiStar size={12} className="text-primary fill-primary" style={{ fill: '#FF9900' }} />
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-gray-500 w-8 text-right">{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Write review */}
              {isLoggedIn && (
                <form onSubmit={handleReviewSubmit} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm space-y-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Write a Review</h3>
                  {/* Star picker */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Your rating:</span>
                    {[1,2,3,4,5].map((s) => (
                      <button key={s} type="button" onClick={() => setReviewForm((f) => ({ ...f, rating: s }))}>
                        <FiStar
                          size={24}
                          className={s <= reviewForm.rating ? 'text-primary' : 'text-gray-300'}
                          style={{ fill: s <= reviewForm.rating ? '#FF9900' : 'none' }}
                        />
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Review title (optional)"
                    value={reviewForm.title}
                    onChange={(e) => setReviewForm((f) => ({ ...f, title: e.target.value }))}
                    className="input-field"
                  />
                  <textarea
                    placeholder="Share your experience with this product..."
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))}
                    rows={4}
                    required
                    className="input-field resize-none"
                  />
                  <button type="submit" disabled={submitting} className="btn-primary flex items-center gap-2">
                    {submitting && <Spinner size="sm" color="gray" />}
                    Submit Review
                  </button>
                </form>
              )}

              {/* Review list */}
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
                ) : (
                  reviews.map((review) => (
                    <div key={review._id} className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm overflow-hidden">
                            {review.user?.avatar?.url
                              ? <img src={review.user.avatar.url} alt="" className="w-full h-full object-cover" />
                              : review.user?.name?.[0]?.toUpperCase()
                            }
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-gray-900 dark:text-white">{review.user?.name}</p>
                            <p className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <StarRating rating={review.rating} size={14} />
                      </div>
                      {review.title && <p className="font-semibold text-gray-900 dark:text-white mb-1 text-sm">{review.title}</p>}
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{review.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section>
            <h2 className="section-title mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.slice(0, 4).map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
