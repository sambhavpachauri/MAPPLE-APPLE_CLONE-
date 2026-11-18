import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { AdminStats, Order } from '../types';
import { formatINR, formatDate } from '../lib/utils';
import {
  Shield,
  TrendingUp,
  ShoppingBag,
  Users,
  AlertTriangle,
  ArrowRight,
  Package,
  Headphones,
  CheckCircle2,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.get<AdminStats>('/admin/stats');
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (!isAdmin) {
    return (
      <div className="py-24 text-center max-w-md mx-auto px-4 space-y-4">
        <Shield className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-neutral-900">Access Restricted</h2>
        <p className="text-xs text-neutral-500">
          This portal requires MAPPLE Administrative role authorization.
        </p>
        <Link
          to="/login"
          className="inline-block px-6 py-2.5 rounded-full bg-[#0071e3] text-white text-xs font-semibold"
        >
          Sign In as Administrator
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 space-y-8 max-w-6xl mx-auto px-4">
      {/* Admin Header */}
      <div className="bg-white rounded-3xl p-8 border border-neutral-200/60 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
              <Shield className="w-3 h-3" /> Certified Portal
            </span>
            <span className="text-xs text-neutral-400">• Operations Live</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1d1d1f] mt-1">
            MAPPLE Administration
          </h1>
          <p className="text-xs text-neutral-500">
            System Overseer: {user?.full_name} ({user?.email})
          </p>
        </div>

        {/* Quick Admin Navigation */}
        <div className="flex flex-wrap gap-2">
          <Link
            to="/admin/products"
            className="px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <Package className="w-4 h-4 text-blue-600" /> Manage Products
          </Link>
          <Link
            to="/admin/orders"
            className="px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <ShoppingBag className="w-4 h-4 text-emerald-600" /> Manage Orders
          </Link>
          <Link
            to="/admin/support"
            className="px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <Headphones className="w-4 h-4 text-purple-600" /> Support Desk
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Sales */}
        <div className="bg-white rounded-3xl p-6 border border-neutral-200/60 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Gross Sales</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-neutral-900 tracking-tight">
            {formatINR(stats?.total_sales_paise || 0)}
          </p>
          <p className="text-[11px] text-emerald-600 font-medium">Server verified settled payments</p>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-3xl p-6 border border-neutral-200/60 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-neutral-900 tracking-tight">
            {stats?.total_orders || 0}
          </p>
          <p className="text-[11px] text-neutral-500">Orders placed across platform</p>
        </div>

        {/* Active Products */}
        <div className="bg-white rounded-3xl p-6 border border-neutral-200/60 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Catalogue Items</span>
            <Package className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-neutral-900 tracking-tight">
            {stats?.total_products || 0}
          </p>
          <p className="text-[11px] text-neutral-500">Fictional flagship hardware models</p>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white rounded-3xl p-6 border border-neutral-200/60 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Stock Alerts</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-neutral-900 tracking-tight">
            {stats?.low_stock_count || 0}
          </p>
          <p className="text-[11px] text-amber-700 font-medium">SKUs with stock &le; 5 units</p>
        </div>
      </div>

      {/* Recent Orders Overview */}
      <div className="bg-white rounded-3xl p-8 border border-neutral-200/60 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
          <div>
            <h2 className="text-base font-bold text-neutral-900">Latest Customer Orders</h2>
            <p className="text-xs text-neutral-500">Real-time transactions recorded in database.</p>
          </div>
          <Link to="/admin/orders" className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1">
            Fulfill orders <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {(!stats?.recent_orders || stats.recent_orders.length === 0) ? (
          <div className="py-8 text-center text-xs text-neutral-400">No orders recorded yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-100 text-neutral-400 font-medium pb-2">
                  <th className="py-2.5 font-semibold">Order ID</th>
                  <th className="py-2.5 font-semibold">Customer</th>
                  <th className="py-2.5 font-semibold">Placed Date</th>
                  <th className="py-2.5 font-semibold">Total Paid</th>
                  <th className="py-2.5 font-semibold">Status</th>
                  <th className="py-2.5 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-neutral-800">
                {stats.recent_orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="py-3 font-mono font-bold text-neutral-900">{ord.id}</td>
                    <td className="py-3">
                      <div className="font-semibold text-neutral-900">{ord.customer_name}</div>
                      <div className="text-[11px] text-neutral-400">{ord.customer_email}</div>
                    </td>
                    <td className="py-3 text-neutral-500">{formatDate(ord.created_at)}</td>
                    <td className="py-3 font-semibold text-neutral-900">{formatINR(ord.total_paise)}</td>
                    <td className="py-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        to={`/account/orders/${ord.id}`}
                        className="text-blue-600 hover:underline font-semibold"
                      >
                        Inspect
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
