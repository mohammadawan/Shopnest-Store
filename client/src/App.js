// src/App.js — Main Router

import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMe } from './redux/slices/authSlice';
import { fetchCart } from './redux/slices/cartSlice';

// Layout
import Navbar  from './components/layout/Navbar';
import Footer  from './components/layout/Footer';

// Pages
import HomePage     from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage     from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';

// Auth Pages
import LoginPage      from './pages/auth/LoginPage';
import SignupPage     from './pages/auth/SignupPage';
import ForgotPassword from './pages/auth/ForgotPassword';

// User Pages
import ProfilePage  from './pages/user/ProfilePage';
import OrdersPage   from './pages/user/OrdersPage';
import WishlistPage from './pages/user/WishlistPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts  from './pages/admin/AdminProducts';
import AdminUsers     from './pages/admin/AdminUsers';
import AdminOrders    from './pages/admin/AdminOrders';

// Guards
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useSelector((s) => s.auth);
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { isLoggedIn, user } = useSelector((s) => s.auth);
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (user?.role !== 'admin') return <Navigate to="/" replace />;
  return children;
};

const GuestRoute = ({ children }) => {
  const { isLoggedIn } = useSelector((s) => s.auth);
  return isLoggedIn ? <Navigate to="/" replace /> : children;
};

export default function App() {
  const dispatch   = useDispatch();
  const { isLoggedIn } = useSelector((s) => s.auth);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchMe());
      dispatch(fetchCart());
    }
  }, [dispatch, isLoggedIn]);

  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-950">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public */}
          <Route path="/"               element={<HomePage />} />
          <Route path="/products"       element={<ProductsPage />} />
          <Route path="/products/:id"   element={<ProductDetailPage />} />
          <Route path="/cart"           element={<CartPage />} />

          {/* Guest only */}
          <Route path="/login"          element={<GuestRoute><LoginPage /></GuestRoute>} />
          <Route path="/signup"         element={<GuestRoute><SignupPage /></GuestRoute>} />
          <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />

          {/* Protected */}
          <Route path="/checkout"       element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
          <Route path="/order-success"  element={<ProtectedRoute><OrderSuccessPage /></ProtectedRoute>} />
          <Route path="/profile"        element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/orders"         element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
          <Route path="/wishlist"       element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />

          {/* Admin */}
          <Route path="/admin"          element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
          <Route path="/admin/users"    element={<AdminRoute><AdminUsers /></AdminRoute>} />
          <Route path="/admin/orders"   element={<AdminRoute><AdminOrders /></AdminRoute>} />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
