import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Package, Truck, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';
import { api } from '../services/api';
import { Order } from '../types';
import { formatINR, formatDate } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';

export const OrderSuccessPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const guestEmail = user?.email || undefined;
        const query = guestEmail ? `?guest_email=${encodeURIComponent(guestEmail)}` : '';
        const data = await api.get<Order>(`/orders/${orderId}${query}`);
        setOrder(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    if (orderId) {
      fetchOrder();
    }
  }, [orderId, user]);

  return (
    <div className="py-12 max-w-3xl mx-auto px-4 space-y-8">
      {/* Confirmation Card */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-neutral-200/60 shadow-sm text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center animate-in zoom-in duration-300">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
          Order Confirmed
        </span>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1d1d1f]">
          Thank you for choosing MAPPLE.
        </h1>

        <p className="text-sm text-neutral-500 max-w-lg mx-auto">
          We’ve received your order <span className="font-semibold text-neutral-900 font-mono">{orderId}</span>. A confirmation receipt has been sent to your email.
        </p>

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Link
            to="/store"
            className="px-6 py-3 rounded-full bg-[#0071e3] text-white text-xs font-semibold hover:bg-[#0077ed] transition-colors"
          >
            Continue Shopping
          </Link>

          {isAuthenticated ? (
            <Link
              to={`/account/orders/${orderId}`}
              className="px-6 py-3 rounded-full border border-neutral-300 text-neutral-800 text-xs font-semibold hover:bg-neutral-50 transition-colors"
            >
              View Order Details
            </Link>
          ) : (
            <Link
              to="/support/orders"
              className="px-6 py-3 rounded-full border border-neutral-300 text-neutral-800 text-xs font-semibold hover:bg-neutral-50 transition-colors"
            >
              Track Order Status
            </Link>
          )}
        </div>
      </div>

      {/* Order Summary & Status Card */}
      {order && (
        <div className="bg-white rounded-3xl p-8 border border-neutral-200/60 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-100 gap-2">
            <div>
              <p className="text-xs text-neutral-500">Order Reference</p>
              <p className="text-base font-bold text-neutral-900 font-mono">{order.id}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-500">Placed on</p>
              <p className="text-xs font-medium text-neutral-900">{formatDate(order.created_at)}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-100 text-blue-800">
                Status: {order.status}
              </span>
            </div>
          </div>

          {/* Delivery Window */}
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-neutral-50 border border-neutral-200/60 text-xs text-neutral-700">
            <Truck className="w-5 h-5 text-blue-600 shrink-0" />
            <div>
              <p className="font-semibold text-neutral-900">Estimated Dispatch: Within 24-48 Hours</p>
              <p className="text-neutral-500 mt-0.5">Dispatched via MAPPLE Express Air with secure signature delivery.</p>
            </div>
          </div>

          {/* Items */}
          <div className="space-y-4 divide-y divide-neutral-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Purchased Items</h3>
            {order.items.map((it) => (
              <div key={it.id} className="pt-4 first:pt-0 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-neutral-100 p-1 shrink-0 flex items-center justify-center">
                    {it.product_image_snapshot ? (
                      <img src={it.product_image_snapshot} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                    ) : (
                      <ShoppingBag className="w-6 h-6 text-neutral-400" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-neutral-900 truncate">{it.product_name_snapshot}</p>
                    <p className="text-[11px] text-neutral-500">
                      Qty: {it.quantity} {it.selected_color && `• ${it.selected_color}`} {it.selected_config && `• ${it.selected_config}`}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-neutral-900 shrink-0">{formatINR(it.total_price_paise)}</span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="border-t border-neutral-100 pt-4 space-y-1.5 text-xs">
            <div className="flex justify-between text-neutral-600">
              <span>Subtotal</span>
              <span>{formatINR(order.subtotal_paise)}</span>
            </div>
            {order.discount_paise > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Discount Applied</span>
                <span>-{formatINR(order.discount_paise)}</span>
              </div>
            )}
            <div className="flex justify-between text-neutral-600">
              <span>Delivery</span>
              <span>{order.shipping_paise === 0 ? 'Complimentary' : formatINR(order.shipping_paise)}</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>GST (18% inclusive)</span>
              <span>{formatINR(order.tax_paise)}</span>
            </div>
            <div className="border-t border-neutral-200 pt-2 flex justify-between items-baseline font-bold text-neutral-900 text-sm">
              <span>Total Paid</span>
              <span className="text-lg">{formatINR(order.total_paise)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
