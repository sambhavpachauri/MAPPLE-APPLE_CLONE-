import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { Order, Address } from '../types';
import { formatINR, formatDate } from '../lib/utils';
import {
  User,
  ShoppingBag,
  MapPin,
  Shield,
  ArrowRight,
  Package,
  Clock,
  CheckCircle2,
} from 'lucide-react';

export const AccountDashboardPage: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        const [ordersRes, addrsRes] = await Promise.all([
          api.get<Order[]>('/orders'),
          api.get<Address[]>('/addresses'),
        ]);
        setRecentOrders(ordersRes);
        setAddresses(addrsRes);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAccountData();
  }, []);

  const defaultAddr = addresses.find((a) => a.is_default) || addresses[0];

  return (
    <div className="py-8 space-y-8 max-w-5xl mx-auto">
      {/* Account Greeting Header */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-neutral-200/60 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#1d1d1f] text-white flex items-center justify-center font-bold text-2xl shadow-inner">
            {user?.full_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1d1d1f]">
                {user?.full_name}
              </h1>
              {isAdmin && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  Admin
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">{user?.email}</p>
          </div>
        </div>

        <div className="flex gap-3 w-full sm:w-auto">
          <Link
            to="/account/profile"
            className="flex-1 sm:flex-initial px-4 py-2 rounded-xl border border-neutral-300 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 text-center"
          >
            Edit Profile
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 text-center flex items-center justify-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5" /> Admin Portal
            </Link>
          )}
        </div>
      </div>

      {/* Overview Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Orders Card */}
        <div className="bg-white rounded-3xl p-6 border border-neutral-200/60 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-neutral-900">Order History</h2>
            <p className="text-xs text-neutral-500">
              You have placed <span className="font-semibold text-neutral-900">{recentOrders.length}</span> orders with MAPPLE.
            </p>
          </div>
          <Link
            to="/account/orders"
            className="mt-6 text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
          >
            View all orders <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Addresses Card */}
        <div className="bg-white rounded-3xl p-6 border border-neutral-200/60 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-neutral-900">Address Book</h2>
            <p className="text-xs text-neutral-500">
              {defaultAddr
                ? `Default: ${defaultAddr.city}, ${defaultAddr.state} (${defaultAddr.postal_code})`
                : 'No saved address on file.'}
            </p>
          </div>
          <Link
            to="/account/addresses"
            className="mt-6 text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
          >
            Manage addresses <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Profile & Security Card */}
        <div className="bg-white rounded-3xl p-6 border border-neutral-200/60 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-neutral-900">Profile & Password</h2>
            <p className="text-xs text-neutral-500">
              Update phone number, password, and manage security settings.
            </p>
          </div>
          <Link
            to="/account/profile"
            className="mt-6 text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
          >
            Account settings <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Recent Orders List */}
      <div className="bg-white rounded-3xl p-8 border border-neutral-200/60 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
          <div>
            <h2 className="text-lg font-bold text-neutral-900">Recent Hardware Orders</h2>
            <p className="text-xs text-neutral-500 mt-0.5">Track shipment progress and review receipts.</p>
          </div>
          <Link to="/account/orders" className="text-xs font-semibold text-blue-600 hover:underline">
            View All
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="py-12 text-center text-xs text-neutral-500 space-y-2">
            <p>You haven't placed any orders yet.</p>
            <Link to="/store" className="inline-block text-blue-600 font-semibold hover:underline">
              Start shopping the MAPPLE catalogue
            </Link>
          </div>
        ) : (
          <div className="space-y-4 divide-y divide-neutral-100">
            {recentOrders.slice(0, 3).map((ord) => (
              <div key={ord.id} className="pt-4 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-neutral-900">{ord.id}</span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      {ord.status}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500">
                    Placed on {formatDate(ord.created_at)} • {ord.items.length} {ord.items.length === 1 ? 'item' : 'items'}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-neutral-900">{formatINR(ord.total_paise)}</span>
                  <Link
                    to={`/account/orders/${ord.id}`}
                    className="px-4 py-1.5 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-800 hover:bg-neutral-50"
                  >
                    View Order
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
