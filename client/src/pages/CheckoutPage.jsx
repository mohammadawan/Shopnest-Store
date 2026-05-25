// pages/CheckoutPage.jsx

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiMapPin, FiCreditCard, FiCheck } from 'react-icons/fi';
import { selectCartTotal } from '../redux/slices/cartSlice';
import { Spinner } from '../components/common';
import API from '../utils/api';

const PAYMENT_METHODS = [
  { id: 'cod',       label: 'Cash on Delivery',  icon: '💵' },
  { id: 'easypaisa', label: 'EasyPaisa',          icon: '📱' },
  { id: 'jazzcash',  label: 'JazzCash',           icon: '💳' },
  { id: 'card',      label: 'Credit/Debit Card',  icon: '🏧' },
];

export default function CheckoutPage() {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const { items }  = useSelector((s) => s.cart);
  const { user }   = useSelector((s) => s.auth);
  const total      = useSelector(selectCartTotal);

  const [loading, setLoading]  = useState(false);
  const [payment,  setPayment]  = useState('cod');
  const [address,  setAddress]  = useState({
    fullName: user?.name || '',
    phone:    user?.phone || '',
    street:   '',
    city:     '',
    state:    '',
    zipCode:  '',
    country:  'Pakistan',
  });

  const shippingCost = total >= 2000 ? 0 : 150;
  const tax          = Math.round(total * 0.05);
  const grandTotal   = total + shippingCost + tax;

  const handleChange = (e) => {
    setAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    const required = ['fullName','phone','street','city','state','zipCode'];
    for (const key of required) {
      if (!address[key].trim()) {
        toast.error(`Please fill in ${key}.`);
        return;
      }
    }
    setLoading(true);
    try {
      const res = await API.post('/orders', {
        shippingAddress: address,
        paymentMethod:   payment,
      });
      navigate('/order-success', { state: { order: res.data.order } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 dark:bg-gray-950 min-h-screen">
      <h1 className="section-title mb-8">Checkout</h1>

      <form onSubmit={handlePlaceOrder}>
        <div className="grid lg:grid-cols-3 gap-8">

          {/* Left: Address + Payment */}
          <div className="lg:col-span-2 space-y-6">

            {/* Shipping Address */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <FiMapPin className="text-primary" size={20} />
                <h2 className="font-display font-bold text-lg text-gray-900 dark:text-white">Shipping Address</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'fullName', label: 'Full Name',    placeholder: 'Muhammad Ali' },
                  { name: 'phone',    label: 'Phone',        placeholder: '+92 300 1234567' },
                  { name: 'street',   label: 'Street Address', placeholder: '123 Main St, House #5', full: true },
                  { name: 'city',     label: 'City',         placeholder: 'Bahawalpur' },
                  { name: 'state',    label: 'Province',     placeholder: 'Punjab' },
                  { name: 'zipCode',  label: 'ZIP Code',     placeholder: '63100' },
                ].map((field) => (
                  <div key={field.name} className={field.full ? 'md:col-span-2' : ''}>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                      {field.label} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name={field.name}
                      value={address[field.name]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      required
                      className="input-field"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <FiCreditCard className="text-primary" size={20} />
                <h2 className="font-display font-bold text-lg text-gray-900 dark:text-white">Payment Method</h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {PAYMENT_METHODS.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPayment(method.id)}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                      payment === method.id
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-2xl">{method.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{method.label}</p>
                    </div>
                    {payment === method.id && (
                      <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center shrink-0">
                        <FiCheck size={12} className="text-gray-900" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Summary */}
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm sticky top-24">
              <h2 className="font-display font-bold text-lg text-gray-900 dark:text-white mb-5">Order Summary</h2>

              {/* Items */}
              <div className="space-y-3 mb-5">
                {items.map((item) => (
                  <div key={item._id} className="flex items-center gap-3">
                    <img
                      src={item.product?.images?.[0]?.url || 'https://via.placeholder.com/50'}
                      alt={item.product?.name}
                      className="w-12 h-12 rounded-lg object-contain bg-gray-50 dark:bg-gray-700 p-1"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-900 dark:text-white line-clamp-1">{item.product?.name}</p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white whitespace-nowrap">
                      ₨{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 dark:border-gray-700 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span><span>₨{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Shipping</span>
                  <span className={shippingCost === 0 ? 'text-green-600' : ''}>
                    {shippingCost === 0 ? 'FREE' : `₨${shippingCost}`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Tax (5%)</span><span>₨{tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 dark:text-white text-base border-t border-gray-100 dark:border-gray-700 pt-2 mt-2">
                  <span>Total</span><span>₨{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || items.length === 0}
                className="w-full btn-primary mt-6 py-4 text-base font-bold flex items-center justify-center gap-2"
              >
                {loading ? <Spinner size="sm" color="gray" /> : null}
                Place Order · ₨{grandTotal.toLocaleString()}
              </button>
              <p className="text-center text-xs text-gray-400 mt-3">🔒 Safe & Secure Checkout</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
