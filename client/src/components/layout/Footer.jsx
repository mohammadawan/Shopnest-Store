// components/layout/Footer.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const FooterSection = ({ title, links }) => (
  <div>
    <h4 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase">{title}</h4>
    <ul className="space-y-2">
      {links.map((link) => (
        <li key={link.label}>
          <Link
            to={link.to}
            className="text-gray-400 hover:text-primary text-sm transition-colors"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export default function Footer() {
  return (
    <footer className="bg-amazon-dark mt-auto">
      {/* Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="w-full bg-amazon-nav hover:bg-amazon-light py-3 text-white text-sm font-medium transition-colors"
      >
        ↑ Back to top
      </button>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 lg:col-span-1">
            <h2 className="text-white font-display font-black text-2xl mb-3">
              Shop<span className="text-primary">Nest</span>
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Your one-stop destination for everything you need. Quality products, fast delivery, best prices.
            </p>
            <div className="flex gap-3">
              {[FiFacebook, FiTwitter, FiInstagram, FiYoutube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full bg-amazon-nav hover:bg-primary hover:text-gray-900 flex items-center justify-center text-gray-400 transition-all">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <FooterSection title="Shop" links={[
            { to: '/products',                  label: 'All Products' },
            { to: '/products?featured=true',    label: 'Featured' },
            { to: '/products?isFlashSale=true', label: 'Flash Sale' },
            { to: '/products?isBestSeller=true',label: 'Best Sellers' },
          ]} />

          <FooterSection title="Account" links={[
            { to: '/profile',  label: 'My Profile' },
            { to: '/orders',   label: 'My Orders' },
            { to: '/wishlist', label: 'Wishlist' },
            { to: '/cart',     label: 'Cart' },
          ]} />

          <FooterSection title="Support" links={[
            { to: '/', label: 'Help Center' },
            { to: '/', label: 'Return Policy' },
            { to: '/', label: 'Privacy Policy' },
            { to: '/', label: 'Terms of Service' },
          ]} />

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <FiMapPin className="text-primary mt-0.5 shrink-0" size={15} />
                <p className="text-gray-400 text-sm">123 Commerce St, Punjab</p>
              </div>
              <div className="flex items-center gap-3">
                <FiPhone className="text-primary shrink-0" size={15} />
                <p className="text-gray-400 text-sm">+92 300 0000000</p>
              </div>
              <div className="flex items-center gap-3">
                <FiMail className="text-primary shrink-0" size={15} />
                <p className="text-gray-400 text-sm">support@shopnest.pk</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-700 py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm text-center">
            © {new Date().getFullYear()} ShopNest. Built with ❤️ as a Portfolio.
          </p>
          <div className="flex gap-6">
            <span className="text-gray-500 text-xs">🔒 Secure Payments</span>
            <span className="text-gray-500 text-xs">🚚 Fast Delivery</span>
            <span className="text-gray-500 text-xs">↩️ Easy Returns</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
