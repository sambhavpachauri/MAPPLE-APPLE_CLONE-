import React, { useState, useEffect } from 'react';
import { api, ApiError } from '../services/api';
import { Order } from '../types';
import { formatINR, formatDate } from '../lib/utils';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  ArrowLeft,
  Truck,
  CheckCircle2,
  Clock,
  Filter,
  X,
} from 'lucide-react';

const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  pending: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered', 'cancelled'],
  delivered: [],
  cancelled: [],
};

export const AdminOrdersPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const { success, error } = useToast();

  const fetchOrders = async () => {
    try {
      const url = statusFilter === 'all' ? '/admin/orders' : `/admin/orders?status_filter=${statusFilter}`;
      const data = await api.get<Order[]>(url);
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchOrders();
    }
  }, [isAdmin, statusFilter]);

  const handleStatusChange = async (orderId: string, currentStatus: string, nextStatus: string) => {
    try {
      await api.patch(`/admin/orders/${orderId}/status`, { status: nextStatus });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus as any } : o))
      );
      success('Order Updated', `Order ${orderId} moved to '${nextStatus}'.`);
    } catch (err: any) {
      const msg = err instanceof ApiError ? err.message : 'Invalid status transition';
      error('Transition Error', msg);
    }
  };

  if (!isAdmin) {
    return <div className="py-24 text-center">Admin credentials required.</div>;
  }

  return (
    <div className="py-8 space-y-8 max-w-6xl mx-auto px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link to="/admin" className="p-2 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-100">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1d1d1f]">
              Customer Orders & Fulfillment
            </h1>
            <p className="text-xs text-neutral-500 mt-0.5">Manage dispatch logistics and order lifecycle transitions.</p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {['all', 'processing', 'shipped', 'delivered', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                statusFilter === st
                  ? 'bg-[#1d1d1f] text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/60 shadow-sm overflow-x-auto">
        {orders.length === 0 && !isLoading ? (
          <div className="py-12 text-center text-xs text-neutral-400">
            No orders match the selected status filter.
          </div>
        ) : (
          <table className="w-full text-left text-xs min-w-[750px]">
            <thead>
              <tr className="border-b border-neutral-200 pb-3 text-neutral-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-2">Reference</th>
                <th className="py-2">Customer Info</th>
                <th className="py-2">Amount Paid</th>
                <th className="py-2">Date Placed</th>
                <th className="py-2">Current Status</th>
                <th className="py-2 text-right">Advance State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-800">
              {orders.map((ord) => {
                const allowed = ALLOWED_TRANSITIONS[ord.status] || [];
                return (
                  <tr key={ord.id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="py-3.5">
                      <span className="font-mono font-bold text-neutral-900">{ord.id}</span>
                      <p className="text-[11px] text-neutral-400">{ord.items.length} items</p>
                    </td>

                    <td className="py-3.5">
                      <p className="font-bold text-neutral-900">{ord.customer_name}</p>
                      <p className="text-[11px] text-neutral-500">{ord.customer_email}</p>
                      <p className="text-[11px] text-neutral-400">{ord.customer_phone}</p>
                    </td>

                    <td className="py-3.5">
                      <span className="font-bold text-neutral-900">{formatINR(ord.total_paise)}</span>
                      <p className="text-[10px] text-emerald-600 font-medium capitalize">
                        {ord.payment_status} ({ord.payment_method})
                      </p>
                    </td>

                    <td className="py-3.5 text-neutral-500">
                      {formatDate(ord.created_at)}
                    </td>

                    <td className="py-3.5">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                          ord.status === 'delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ord.status === 'shipped'
                            ? 'bg-blue-100 text-blue-800'
                            : ord.status === 'cancelled'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>

                    <td className="py-3.5 text-right">
                      {allowed.length > 0 ? (
                        <div className="flex items-center justify-end gap-1.5">
                          {allowed.map((nextSt) => (
                            <button
                              key={nextSt}
                              onClick={() => handleStatusChange(ord.id, ord.status, nextSt)}
                              className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-colors ${
                                nextSt === 'shipped'
                                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                                  : nextSt === 'delivered'
                                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                  : nextSt === 'cancelled'
                                  ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                                  : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
                              }`}
                            >
                              Mark {nextSt}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[11px] text-neutral-400">Terminal</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
