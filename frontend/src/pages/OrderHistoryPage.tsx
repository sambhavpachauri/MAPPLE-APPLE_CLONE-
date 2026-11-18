import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Order } from '../types';
import { formatINR, formatDate } from '../lib/utils';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, ArrowLeft, Package, Clock, ShieldCheck } from 'lucide-react';

export const OrderHistoryPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await api.get<Order[]>('/orders');
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="py-8 space-y-8 max-w-4xl mx-auto px-4">
      <div className="flex items-center gap-3">
        <Link to="/account" className="p-2 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-100">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1d1d1f]">
            Order History
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">Review your past orders, track shipments, and download receipts.</p>
        </div>
      </div>

      {orders.length === 0 && !isLoading ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-neutral-200/60 max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-neutral-900">No Orders Placed Yet</h3>
          <p className="text-xs text-neutral-500">Discover cutting-edge MAPPLE smartphones, laptops, and wearables.</p>
          <Link
            to="/store"
            className="inline-block px-6 py-2.5 rounded-full bg-[#0071e3] text-white text-xs font-semibold hover:bg-[#0077ed]"
          >
            Explore Store
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/60 shadow-sm space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-100 gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-base font-bold text-neutral-900">{order.id}</span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
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
                  <p className="text-xs text-neutral-500">Placed on {formatDate(order.created_at)}</p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-base font-bold text-neutral-900">{formatINR(order.total_paise)}</span>
                  <Link
                    to={`/account/orders/${order.id}`}
                    className="px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    View Details <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Items snapshot */}
              <div className="divide-y divide-neutral-100">
                {order.items.map((it) => (
                  <div key={it.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
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
                    <span className="text-xs font-semibold text-neutral-800 shrink-0">
                      {formatINR(it.total_price_paise)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
