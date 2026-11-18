import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';

import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { StorePage } from './pages/StorePage';
import { CategoryPage } from './pages/CategoryPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { ComparePage } from './pages/ComparePage';
import { SearchPage } from './pages/SearchPage';
import { WishlistPage } from './pages/WishlistPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { SupportPage } from './pages/SupportPage';
import { OrderSupportPage } from './pages/OrderSupportPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { ShippingReturnsPage } from './pages/ShippingReturnsPage';

// Auth Pages
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';

// Customer Account Pages
import { AccountDashboardPage } from './pages/AccountDashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { AddressesPage } from './pages/AddressesPage';
import { OrderHistoryPage } from './pages/OrderHistoryPage';
import { OrderDetailPage } from './pages/OrderDetailPage';

// Admin Pages
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminProductsPage } from './pages/AdminProductsPage';
import { AdminOrdersPage } from './pages/AdminOrdersPage';
import { AdminSupportPage } from './pages/AdminSupportPage';

// 404
import { NotFoundPage } from './pages/NotFoundPage';

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return <div className="py-24 text-center text-xs text-neutral-400">Verifying session...</div>;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// Admin Route Wrapper
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  if (isLoading) {
    return <div className="py-24 text-center text-xs text-neutral-400">Verifying privileges...</div>;
  }
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <div className="min-h-screen flex flex-col bg-[#fbfbfd] text-[#1d1d1f] font-sans antialiased selection:bg-[#0071e3] selection:text-white">
                <AnnouncementBar />
                <Navbar />

                <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
                  <Routes>
                    {/* Public Store & Discovery Routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/store" element={<StorePage />} />
                    <Route path="/store/iphone" element={<CategoryPage />} />
                    <Route path="/store/mac" element={<CategoryPage />} />
                    <Route path="/store/ipad" element={<CategoryPage />} />
                    <Route path="/store/watch" element={<CategoryPage />} />
                    <Route path="/store/audio" element={<CategoryPage />} />
                    <Route path="/store/accessories" element={<CategoryPage />} />
                    <Route path="/product/:slug" element={<ProductDetailPage />} />
                    <Route path="/compare" element={<ComparePage />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/wishlist" element={<WishlistPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />

                    {/* Support & Brand Routes */}
                    <Route path="/support" element={<SupportPage />} />
                    <Route path="/support/orders" element={<OrderSupportPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/privacy" element={<PrivacyPage />} />
                    <Route path="/terms" element={<TermsPage />} />
                    <Route path="/shipping-returns" element={<ShippingReturnsPage />} />

                    {/* Authentication Routes */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />

                    {/* Customer Account Routes */}
                    <Route
                      path="/account"
                      element={
                        <ProtectedRoute>
                          <AccountDashboardPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/account/profile"
                      element={
                        <ProtectedRoute>
                          <ProfilePage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/account/addresses"
                      element={
                        <ProtectedRoute>
                          <AddressesPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/account/orders"
                      element={
                        <ProtectedRoute>
                          <OrderHistoryPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/account/orders/:orderId"
                      element={
                        <ProtectedRoute>
                          <OrderDetailPage />
                        </ProtectedRoute>
                      }
                    />

                    {/* Admin Routes */}
                    <Route
                      path="/admin"
                      element={
                        <AdminRoute>
                          <AdminDashboardPage />
                        </AdminRoute>
                      }
                    />
                    <Route
                      path="/admin/products"
                      element={
                        <AdminRoute>
                          <AdminProductsPage />
                        </AdminRoute>
                      }
                    />
                    <Route
                      path="/admin/orders"
                      element={
                        <AdminRoute>
                          <AdminOrdersPage />
                        </AdminRoute>
                      }
                    />
                    <Route
                      path="/admin/support"
                      element={
                        <AdminRoute>
                          <AdminSupportPage />
                        </AdminRoute>
                      }
                    />

                    {/* 404 Catch-All */}
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </main>

                <Footer />
              </div>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
};

export default App;
