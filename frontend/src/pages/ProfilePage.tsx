import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api, ApiError } from '../services/api';
import { useToast } from '../contexts/ToastContext';
import { User, Lock, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { success, error } = useToast();

  // Profile Form
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Password Form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    try {
      const updated = await api.put<any>('/auth/me', { full_name: fullName, phone });
      updateUser(updated);
      success('Profile Updated', 'Your profile details have been saved.');
    } catch (err: any) {
      const msg = err instanceof ApiError ? err.message : 'Failed to update profile';
      error('Profile Error', msg);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChangingPassword(true);
    try {
      await api.put('/auth/password', {
        current_password: currentPassword,
        new_password: newPassword,
      });
      success('Password Changed', 'Your password has been successfully updated.');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      const msg = err instanceof ApiError ? err.message : 'Failed to change password';
      error('Security Error', msg);
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="py-8 space-y-8 max-w-3xl mx-auto px-4">
      <div className="flex items-center gap-3">
        <Link to="/account" className="p-2 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-100">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1d1d1f]">
            Profile & Security
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">Manage your personal information and account credentials.</p>
        </div>
      </div>

      {/* Personal Info Card */}
      <div className="bg-white rounded-3xl p-8 border border-neutral-200/60 shadow-sm space-y-6">
        <div className="border-b border-neutral-100 pb-4">
          <h2 className="text-base font-bold text-neutral-900">Personal Information</h2>
          <p className="text-xs text-neutral-500">Contact details used for orders and dispatches.</p>
        </div>

        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">MAPPLE ID (Email)</label>
            <input
              type="email"
              disabled
              value={user?.email || ''}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-neutral-100 text-neutral-500 text-xs cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={isUpdatingProfile}
            className="px-6 py-2.5 rounded-xl bg-[#0071e3] text-white text-xs font-semibold hover:bg-[#0077ed] transition-colors disabled:opacity-50"
          >
            {isUpdatingProfile ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>

      {/* Change Password Card */}
      <div className="bg-white rounded-3xl p-8 border border-neutral-200/60 shadow-sm space-y-6">
        <div className="border-b border-neutral-100 pb-4">
          <h2 className="text-base font-bold text-neutral-900">Change Password</h2>
          <p className="text-xs text-neutral-500">Ensure your account uses a secure password.</p>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">New Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={isChangingPassword}
            className="px-6 py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors disabled:opacity-50"
          >
            {isChangingPassword ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};
