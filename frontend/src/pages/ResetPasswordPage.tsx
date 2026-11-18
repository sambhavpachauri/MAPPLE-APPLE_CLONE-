import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { api, ApiError } from '../services/api';
import { useToast } from '../contexts/ToastContext';
import { Lock, ArrowRight, CheckCircle2 } from 'lucide-react';

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [token, setToken] = useState(searchParams.get('token') || '');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { success, error } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post('/auth/reset-password', {
        email,
        token,
        new_password: newPassword,
      });
      success('Password Reset', 'Your password has been reset. Please sign in with your new credentials.');
      navigate('/login');
    } catch (err: any) {
      const msg = err instanceof ApiError ? err.message : 'Failed to reset password';
      error('Reset Error', msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-12 max-w-md mx-auto px-4 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1d1d1f]">
          Create New Password
        </h1>
        <p className="text-xs text-neutral-500 font-light">
          Set a secure new password for your MAPPLE ID.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-neutral-200/60 shadow-sm space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">MAPPLE ID (Email)</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">Reset Authorization Token</label>
            <input
              type="text"
              required
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="rst_..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">New Secure Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-xl bg-[#0071e3] text-white text-xs font-semibold hover:bg-[#0077ed] transition-all flex items-center justify-center gap-1.5 shadow-md disabled:opacity-50"
          >
            {isLoading ? 'Resetting Password...' : 'Save New Password'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2">
          <Link to="/login" className="text-xs text-blue-600 font-semibold hover:underline">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
