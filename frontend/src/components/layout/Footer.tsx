import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { success } = useToast();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
    success('Subscribed', 'You have been subscribed to MAPPLE Keynotes & releases.');
  };

  return (
    <footer className="bg-[#f5f5f7] text-[#6e6e73] text-xs border-t border-neutral-200/80 pt-12 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Newsletter Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/60 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-md">
            <h3 className="text-base font-semibold text-[#1d1d1f] tracking-tight">Stay ahead with MAPPLE</h3>
            <p className="text-xs text-neutral-500 mt-1">
              Be the first to hear about new titanium hardware releases, architectural silicon breakthroughs, and exclusive owner perks.
            </p>
          </div>

          {subscribed ? (
            <div className="flex items-center gap-2 text-emerald-600 font-medium text-xs bg-emerald-50 px-4 py-2.5 rounded-full border border-emerald-100">
              <CheckCircle2 className="w-4 h-4" /> Thank you for subscribing to MAPPLE updates.
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex items-center w-full md:w-auto gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="px-4 py-2.5 rounded-full bg-neutral-50 border border-neutral-200 text-neutral-900 placeholder-neutral-400 text-xs focus:outline-none focus:border-blue-500 w-full sm:w-64"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-full bg-[#1d1d1f] text-white hover:bg-neutral-800 transition-colors text-xs font-semibold flex items-center gap-1 shrink-0"
              >
                Join <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>

        {/* Directory Columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pt-4">
          <div>
            <h4 className="font-semibold text-[#1d1d1f] mb-3">Shop & Learn</h4>
            <ul className="space-y-2">
              <li><Link to="/store/iphone" className="hover:text-[#1d1d1f] transition-colors">Smartphones</Link></li>
              <li><Link to="/store/mac" className="hover:text-[#1d1d1f] transition-colors">Mac Laptops & Desktops</Link></li>
              <li><Link to="/store/ipad" className="hover:text-[#1d1d1f] transition-colors">Tablets</Link></li>
              <li><Link to="/store/watch" className="hover:text-[#1d1d1f] transition-colors">Watch</Link></li>
              <li><Link to="/store/audio" className="hover:text-[#1d1d1f] transition-colors">AirPods & Max Audio</Link></li>
              <li><Link to="/store/accessories" className="hover:text-[#1d1d1f] transition-colors">Accessories</Link></li>
              <li><Link to="/compare" className="hover:text-[#1d1d1f] transition-colors">Compare Devices</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[#1d1d1f] mb-3">Account</h4>
            <ul className="space-y-2">
              <li><Link to="/account" className="hover:text-[#1d1d1f] transition-colors">Manage MAPPLE Account</Link></li>
              <li><Link to="/account/orders" className="hover:text-[#1d1d1f] transition-colors">Order History</Link></li>
              <li><Link to="/account/addresses" className="hover:text-[#1d1d1f] transition-colors">Saved Addresses</Link></li>
              <li><Link to="/wishlist" className="hover:text-[#1d1d1f] transition-colors">Saved Wishlist</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[#1d1d1f] mb-3">Entertainment</h4>
            <ul className="space-y-2">
              <li><span className="text-neutral-400">MAPPLE Spatial Cinema</span></li>
              <li><span className="text-neutral-400">MAPPLE Studio Sound</span></li>
              <li><span className="text-neutral-400">M-Titan Neural Labs</span></li>
              <li><span className="text-neutral-400">Developer Ecosystem</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[#1d1d1f] mb-3">MAPPLE Store</h4>
            <ul className="space-y-2">
              <li><Link to="/store" className="hover:text-[#1d1d1f] transition-colors">Store Overview</Link></li>
              <li><Link to="/shipping-returns" className="hover:text-[#1d1d1f] transition-colors">Delivery & Returns</Link></li>
              <li><Link to="/support/orders" className="hover:text-[#1d1d1f] transition-colors">Order Tracking</Link></li>
              <li><Link to="/support" className="hover:text-[#1d1d1f] transition-colors">Certified Refurbished</Link></li>
              <li><Link to="/cart" className="hover:text-[#1d1d1f] transition-colors">Shopping Bag</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[#1d1d1f] mb-3">About MAPPLE</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="hover:text-[#1d1d1f] transition-colors">Brand & Philosophy</Link></li>
              <li><Link to="/contact" className="hover:text-[#1d1d1f] transition-colors">Contact Us</Link></li>
              <li><Link to="/privacy" className="hover:text-[#1d1d1f] transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-[#1d1d1f] transition-colors">Terms of Service</Link></li>
              <li><Link to="/admin" className="text-blue-600 hover:text-blue-700 font-medium">Administrator Login</Link></li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer & Bar */}
        <div className="pt-8 border-t border-neutral-200/60 space-y-3">
          <p className="text-[11px] leading-relaxed text-neutral-400">
            * 1. Promotional savings are subject to cart qualification and promo code validation. 2. Complimentary standard delivery is provided on all orders within India. 3. MAPPLE is an original premium technology brand concept and fictional product catalogue. Not affiliated with Apple Inc.
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] text-neutral-500 pt-2">
            <div>
              Copyright © 2026 MAPPLE Technologies Inc. All rights reserved. Technology. Beautifully Simplified.
            </div>

            <div className="flex flex-wrap gap-4">
              <Link to="/privacy" className="hover:text-[#1d1d1f] transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-[#1d1d1f] transition-colors">Terms of Use</Link>
              <Link to="/shipping-returns" className="hover:text-[#1d1d1f] transition-colors">Sales and Refunds</Link>
              <Link to="/support" className="hover:text-[#1d1d1f] transition-colors">Legal & Compliance</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
