import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  Layers,
  Shield,
  LogOut,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { useAuth } from '../../contexts/AuthContext';
import { SearchOverlay } from './SearchOverlay';
import { BagPreview } from './BagPreview';

const NAV_LINKS = [
  { label: 'Store', path: '/store' },
  { label: 'Smartphones', path: '/store/iphone' },
  { label: 'Mac', path: '/store/mac' },
  { label: 'Tablets', path: '/store/ipad' },
  { label: 'Watch', path: '/store/watch' },
  { label: 'Audio', path: '/store/audio' },
  { label: 'Accessories', path: '/store/accessories' },
  { label: 'Compare', path: '/compare' },
  { label: 'Support', path: '/support' },
];

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  const { totalItems, openCart } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();
  const accountMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsAccountMenuOpen(false);
    setIsSearchOpen(false);
  }, [location.pathname]);

  // Click outside listener for account menu
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'glass-nav border-b border-neutral-200/60 shadow-sm'
            : 'bg-white/90 backdrop-blur-md border-b border-neutral-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          {/* Brand Logo & Wordmark */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-7 h-7 rounded-lg bg-black text-white flex items-center justify-center font-bold tracking-tighter text-sm shadow-sm group-hover:scale-105 transition-transform">
              M
            </div>
            <span className="font-semibold text-lg tracking-tight text-[#1d1d1f] flex items-center">
              MAPPLE
              <span className="w-1.5 h-1.5 rounded-full bg-[#0071e3] ml-1"></span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7 text-xs font-medium text-neutral-600">
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`transition-colors hover:text-[#0071e3] relative py-1 ${
                    isActive ? 'text-[#0071e3] font-semibold' : ''
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0071e3] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-full transition-all"
              title="Search"
              aria-label="Search products"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Wishlist Icon */}
            <Link
              to="/wishlist"
              className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-full transition-all relative"
              title="Saved Items"
              aria-label="Wishlist"
            >
              <Heart className="w-4 h-4" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-in zoom-in">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Bag Icon */}
            <button
              onClick={openCart}
              className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-full transition-all relative"
              title="Shopping Bag"
              aria-label="View shopping bag"
            >
              <ShoppingBag className="w-4 h-4" />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#0071e3] text-white text-[10px] font-bold flex items-center justify-center animate-in zoom-in">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Customer / Admin Account Popover */}
            <div className="relative" ref={accountMenuRef}>
              <button
                onClick={() => setIsAccountMenuOpen((prev) => !prev)}
                className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-full transition-all flex items-center gap-1"
                aria-label="Account options"
              >
                {isAuthenticated ? (
                  <div className="w-6 h-6 rounded-full bg-[#1d1d1f] text-white text-xs font-semibold flex items-center justify-center">
                    {user?.full_name.charAt(0).toUpperCase()}
                  </div>
                ) : (
                  <User className="w-4 h-4" />
                )}
              </button>

              {isAccountMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-neutral-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-3 border-b border-neutral-100">
                        <p className="text-xs font-semibold text-neutral-900 truncate">{user?.full_name}</p>
                        <p className="text-[11px] text-neutral-500 truncate">{user?.email}</p>
                        {isAdmin && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-semibold mt-1">
                            <Shield className="w-3 h-3" /> Administrator
                          </span>
                        )}
                      </div>

                      <div className="py-1">
                        <Link
                          to="/account"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900"
                        >
                          <User className="w-4 h-4 text-neutral-400" /> Dashboard
                        </Link>
                        <Link
                          to="/account/orders"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900"
                        >
                          <ShoppingBag className="w-4 h-4 text-neutral-400" /> Orders
                        </Link>
                        <Link
                          to="/account/addresses"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900"
                        >
                          <Layers className="w-4 h-4 text-neutral-400" /> Saved Addresses
                        </Link>
                        {isAdmin && (
                          <Link
                            to="/admin"
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50"
                          >
                            <Shield className="w-4 h-4 text-blue-500" /> Admin Portal
                          </Link>
                        )}
                      </div>

                      <div className="border-t border-neutral-100 pt-1">
                        <button
                          onClick={() => {
                            logout();
                            setIsAccountMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="p-3 space-y-2">
                      <Link
                        to="/login"
                        className="block w-full py-2 px-3 text-center rounded-xl bg-[#0071e3] text-white text-xs font-semibold hover:bg-[#0077ed] transition-colors"
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/register"
                        className="block w-full py-2 px-3 text-center rounded-xl bg-neutral-100 text-neutral-800 text-xs font-medium hover:bg-neutral-200 transition-colors"
                      >
                        Create Account
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="lg:hidden p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-full transition-all"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-neutral-200/60 bg-white/95 backdrop-blur-xl animate-in slide-in-from-top-2 duration-200 shadow-xl">
            <div className="px-6 py-5 space-y-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block text-base font-medium text-neutral-800 hover:text-[#0071e3] py-1 border-b border-neutral-100/70"
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-3 border-t border-neutral-100 flex flex-col gap-2">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/account"
                      className="flex items-center gap-2 text-sm font-semibold text-neutral-900 py-1"
                    >
                      <User className="w-4 h-4" /> My Account ({user?.full_name})
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 text-sm font-semibold text-blue-600 py-1"
                      >
                        <Shield className="w-4 h-4" /> Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={logout}
                      className="flex items-center gap-2 text-sm font-semibold text-rose-600 py-1 text-left"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <Link
                      to="/login"
                      className="py-2.5 px-4 text-center rounded-xl bg-[#0071e3] text-white text-xs font-semibold"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="py-2.5 px-4 text-center rounded-xl border border-neutral-300 text-neutral-800 text-xs font-semibold"
                    >
                      Create Account
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Global Overlays */}
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <BagPreview />
    </>
  );
};
