import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, ApiError } from '../services/api';
import { useToast } from '../contexts/ToastContext';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [devToken, setDevToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { success, error } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.post<any>('/auth/forgot-password', { email });
      if (res.dev_reset_token) {
        setDevToken(res.dev_reset_token);
        success('Reset Token Issued', 'Development reset token generated.');
      } else {
        success('Instructions Issued', res.message);
      }
    } catch (err: any) {
      error('Error', 'Unable to initiate password reset.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-12 max-w-md mx-auto px-4 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1d1d1f]">
          Reset MAPPLE Password
        </h1>
        <p className="text-xs text-neutral-500 font-light">
          Enter your registered email address to receive password reset authorization.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-neutral-200/60 shadow-sm space-y-6">
        {devToken ? (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs space-y-2">
              <div className="flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Dev Reset Token Generated
              </div>
              <p className="font-mono bg-white p-2 rounded border border-emerald-200 break-all">
                {devToken}
              </p>
              <p className="text-[11px] text-emerald-700">
                In production, this token is securely dispatched to the user's verified inbox.
              </p>
            </div>

            <button
              onClick={() => navigate(`/reset-password?email=${encodeURIComponent(email)}&token=${devToken}`)}
              className="w-full py-3 px-4 rounded-xl bg-[#0071e3] text-white text-xs font-semibold hover:bg-[#0077ed] transition-colors"
            >
              Proceed to Reset Password Form
            </button>
          </div>
        ) : (
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-[#0071e3] text-white text-xs font-semibold hover:bg-[#0077ed] transition-all flex items-center justify-center gap-1.5 shadow-md disabled:opacity-50"
            >
              {isLoading ? 'Generating Request...' : 'Send Password Reset Link'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="text-center pt-2">
          <Link to="/login" className="text-xs text-blue-600 font-semibold hover:underline">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
