import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Order } from '../types';
import { formatINR, formatDate } from '../lib/utils';
import { ArrowLeft, Truck, Package, CheckCircle2, ShieldCheck, ShoppingBag, Printer } from 'lucide-react';

export const OrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await api.get<Order>(`/orders/${orderId}`);
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
  }, [orderId]);

  if (isLoading) {
    return <div className="py-24 text-center text-xs text-neutral-500">Loading order details...</div>;
  }

  if (!order) {
    return (
      <div className="py-24 text-center max-w-md mx-auto space-y-4">
        <h2 className="text-xl font-bold text-neutral-900">Order Not Found</h2>
        <p className="text-xs text-neutral-500">We couldn't locate order reference {orderId}.</p>
        <Link to="/account/orders" className="inline-block text-xs font-semibold text-blue-600 hover:underline">
          Return to Order History
        </Link>
      </div>
    );
  }

  let addressObj: any = {};
  try {
    addressObj = JSON.parse(order.shipping_address_json);
  } catch {
    addressObj = {};
  }

  const steps = ['pending', 'processing', 'shipped', 'delivered'];
  const currentStepIdx = steps.indexOf(order.status) >= 0 ? steps.indexOf(order.status) : 1;

  return (
    <div className="py-8 space-y-8 max-w-4xl mx-auto px-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/account/orders" className="p-2 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-100">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1d1d1f]">
                Order {order.id}
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                {order.status}
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">Placed on {formatDate(order.created_at)}</p>
          </div>
        </div>

        <button
          onClick={() => window.print()}
          className="px-4 py-2 rounded-xl border border-neutral-300 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 flex items-center gap-1.5"
        >
          <Printer className="w-4 h-4" /> Print Receipt
        </button>
      </div>

      {/* Shipment Tracker Progress */}
      <div className="bg-white rounded-3xl p-8 border border-neutral-200/60 shadow-sm space-y-6">
        <h2 className="text-sm font-bold text-neutral-900 tracking-tight">Shipment Tracking</h2>

        <div className="flex items-center justify-between max-w-2xl mx-auto pt-2">
          {['Order Placed', 'Processing Silicon', 'Dispatched Air', 'Delivered'].map((stepLabel, idx) => (
            <React.Fragment key={stepLabel}>
              <div className="flex flex-col items-center text-center">
                <span
                  className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
                    idx <= currentStepIdx
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-neutral-100 text-neutral-400'
                  }`}
                >
                  {idx <= currentStepIdx ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                </span>
                <span className="text-[11px] font-medium text-neutral-700 mt-1.5">{stepLabel}</span>
              </div>
              {idx < 3 && (
                <div
                  className={`flex-1 h-0.5 mx-2 ${
                    idx < currentStepIdx ? 'bg-emerald-600' : 'bg-neutral-200'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Order Items Snapshot */}
      <div className="bg-white rounded-3xl p-8 border border-neutral-200/60 shadow-sm space-y-6">
        <h2 className="text-sm font-bold text-neutral-900 tracking-tight">Items in this Delivery</h2>

        <div className="divide-y divide-neutral-100">
          {order.items.map((it) => (
            <div key={it.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-16 h-16 rounded-xl bg-neutral-100 p-2 shrink-0 flex items-center justify-center">
                  {it.product_image_snapshot ? (
                    <img src={it.product_image_snapshot} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                  ) : (
                    <ShoppingBag className="w-6 h-6 text-neutral-400" />
                  )}
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-neutral-900">{it.product_name_snapshot}</h4>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Quantity: {it.quantity} {it.selected_color && `• Finish: ${it.selected_color}`} {it.selected_config && `• Config: ${it.selected_config}`}
                  </p>
                  <p className="text-xs font-medium text-neutral-700 mt-0.5">
                    Unit: {formatINR(it.unit_price_paise)}
                  </p>
                </div>
              </div>
              <span className="text-sm font-bold text-neutral-900 shrink-0">{formatINR(it.total_price_paise)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping Address & Pricing Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping Address */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/60 shadow-sm space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Shipping Details</h3>
          <div className="text-xs text-neutral-700 leading-relaxed space-y-1">
            <p className="font-semibold text-neutral-900">{order.customer_name}</p>
            <p>{addressObj.street_line1}</p>
            {addressObj.street_line2 && <p>{addressObj.street_line2}</p>}
            <p>{addressObj.city}, {addressObj.state} - {addressObj.postal_code}</p>
            <p>{addressObj.country || 'India'}</p>
            <p className="text-neutral-500 pt-1">Phone: {order.customer_phone}</p>
            <p className="text-neutral-500">Email: {order.customer_email}</p>
          </div>
        </div>

        {/* Financial Breakdown */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/60 shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Payment Breakdown</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-neutral-600">
              <span>Subtotal</span>
              <span>{formatINR(order.subtotal_paise)}</span>
            </div>
            {order.discount_paise > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Promotional Discount</span>
                <span>-{formatINR(order.discount_paise)}</span>
              </div>
            )}
            <div className="flex justify-between text-neutral-600">
              <span>Delivery Method ({order.delivery_method})</span>
              <span>{order.shipping_paise === 0 ? 'Complimentary' : formatINR(order.shipping_paise)}</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Taxes (18% GST inclusive)</span>
              <span>{formatINR(order.tax_paise)}</span>
            </div>
            <div className="border-t border-neutral-200 pt-2 flex justify-between items-baseline font-bold text-neutral-900 text-sm">
              <span>Total Paid</span>
              <span className="text-xl">{formatINR(order.total_paise)}</span>
            </div>
            <div className="pt-2 text-[11px] text-neutral-500 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Paid via {order.payment_method} ({order.payment_status.toUpperCase()})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
