import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Lock, Mail, ArrowRight, ShieldCheck, User } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/account';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch {
      // Error is surfaced via Toast
    } finally {
      setIsLoading(false);
    }
  };

  const fillCustomerCredentials = () => {
    setEmail('alex@mapple.com');
    setPassword('MappleCustomer2026!');
  };

  const fillAdminCredentials = () => {
    setEmail('admin@mapple.com');
    setPassword('MappleAdmin2026!');
  };

  return (
    <div className="py-12 max-w-md mx-auto px-4 space-y-8">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-bold text-lg mx-auto shadow-md">
          M
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1d1d1f]">
          Sign in to MAPPLE
        </h1>
        <p className="text-xs text-neutral-500 font-light">
          Manage your orders, devices, saved addresses, and express checkout.
        </p>
      </div>

      {/* Login Card */}
      <div className="bg-white rounded-3xl p-8 border border-neutral-200/60 shadow-sm space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">MAPPLE ID (Email)</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-neutral-700">Password</label>
              <Link to="/forgot-password" className="text-[11px] text-blue-600 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-xl bg-[#0071e3] text-white text-xs font-semibold hover:bg-[#0077ed] transition-all flex items-center justify-center gap-1.5 shadow-md disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Sign In'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast-fill Buttons */}
        <div className="pt-4 border-t border-neutral-100 space-y-2">
          <p className="text-[11px] text-neutral-400 font-medium text-center">Development Demo Access</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={fillCustomerCredentials}
              className="py-2 px-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 text-[11px] font-semibold text-neutral-700 transition-colors"
            >
              Customer Demo
            </button>
            <button
              type="button"
              onClick={fillAdminCredentials}
              className="py-2 px-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 text-[11px] font-semibold text-blue-700 transition-colors"
            >
              Admin Demo
            </button>
          </div>
        </div>

        <div className="text-center pt-2">
          <p className="text-xs text-neutral-500">
            Don't have a MAPPLE ID?{' '}
            <Link to="/register" className="text-blue-600 font-semibold hover:underline">
              Create yours now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
