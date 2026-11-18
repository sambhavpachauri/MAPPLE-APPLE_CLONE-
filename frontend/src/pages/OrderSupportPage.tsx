import React, { useState } from 'react';
import { api, ApiError } from '../services/api';
import { Order } from '../types';
import { formatINR, formatDate } from '../lib/utils';
import { Search, Package, Truck, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const OrderSupportPage: React.FC = () => {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setOrder(null);
    setIsLoading(true);

    try {
      const data = await api.get<Order>(`/orders/${orderId.trim()}?guest_email=${encodeURIComponent(email.trim())}`);
      setOrder(data);
    } catch (err: any) {
      setErrorMsg('No order matching that reference ID and email was found. Please verify and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-8 space-y-8 max-w-3xl mx-auto px-4">
      <div className="flex items-center gap-3">
        <Link to="/support" className="p-2 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-100">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1d1d1f]">
            Order Tracking & Support
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">Track shipment progress using your order ID and email address.</p>
        </div>
      </div>

      {/* Lookup Card */}
      <div className="bg-white rounded-3xl p-8 border border-neutral-200/60 shadow-sm space-y-6">
        <form onSubmit={handleLookup} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Order Reference ID *</label>
              <input
                type="text"
                required
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="e.g. MPL-98421"
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-blue-500 uppercase font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Billing Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-[#0071e3] text-white text-xs font-semibold hover:bg-[#0077ed] transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
          >
            <Search className="w-4 h-4" /> {isLoading ? 'Searching...' : 'Track Hardware Order'}
          </button>
        </form>

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Lookup Result */}
      {order && (
        <div className="bg-white rounded-3xl p-8 border border-neutral-200/60 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-100 gap-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Shipment Status</span>
              <p className="text-lg font-bold text-neutral-900 font-mono">{order.id}</p>
            </div>
            <div>
              <span
                className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                  order.status === 'delivered'
                    ? 'bg-emerald-100 text-emerald-800'
                    : order.status === 'shipped'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {order.status}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/60 text-xs space-y-1">
            <p className="font-semibold text-neutral-900">Customer: {order.customer_name}</p>
            <p className="text-neutral-500">Placed on {formatDate(order.created_at)}</p>
            <p className="text-neutral-500">Total: {formatINR(order.total_paise)} ({order.payment_status.toUpperCase()})</p>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Items</h4>
            <div className="divide-y divide-neutral-100">
              {order.items.map((it) => (
                <div key={it.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-neutral-900">{it.product_name_snapshot}</span>
                    <span className="text-neutral-500 ml-2">Qty: {it.quantity}</span>
                  </div>
                  <span className="font-bold text-neutral-900">{formatINR(it.total_price_paise)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-100 flex justify-between items-center text-xs">
            <span className="text-neutral-500">Need help with this delivery?</span>
            <Link
              to="/support"
              className="text-blue-600 font-semibold hover:underline"
            >
              Contact Support →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
