import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { formatINR } from '../lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Tag,
  Check,
  Truck,
  RotateCcw,
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    cart,
    updateQuantity,
    removeItem,
    applyDiscount,
    removeDiscount,
    deliveryMethod,
    setDeliveryMethod,
    discountCode,
  } = useCart();
  const [promoInput, setPromoInput] = useState('');
  const navigate = useNavigate();

  const items = cart?.items || [];
  const subtotal = cart?.subtotal_paise || 0;
  const discount = cart?.discount_paise || 0;
  const shipping = cart?.shipping_paise || 0;
  const tax = cart?.tax_paise || 0;
  const total = cart?.total_paise || 0;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoInput.trim()) {
      applyDiscount(promoInput);
      setPromoInput('');
    }
  };

  if (items.length === 0) {
    return (
      <div className="py-20 max-w-xl mx-auto px-4 text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-[#1d1d1f]">
          Your Shopping Bag is empty.
        </h1>
        <p className="text-sm text-neutral-500 max-w-md mx-auto">
          Explore our range of premium smartphones, pro laptops, tablets, and studio audio devices.
        </p>
        <div className="pt-4">
          <Link
            to="/store"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#0071e3] text-white text-sm font-semibold hover:bg-[#0077ed] transition-colors shadow-md"
          >
            Continue Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 space-y-10">
      {/* Page Title */}
      <div className="border-b border-neutral-200/80 pb-6">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1d1d1f]">
          Review your Shopping Bag
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Complimentary delivery on eligible orders and 14-day return privilege.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Items List (Left: 8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/60 shadow-sm divide-y divide-neutral-100">
            {items.map((item) => (
              <div key={item.id} className="py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-6 items-start">
                {/* Thumbnail */}
                <div
                  className="w-28 h-28 rounded-2xl bg-[#fbfbfd] p-3 shrink-0 flex items-center justify-center overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/product/${item.product_slug}`)}
                >
                  {item.product_image ? (
                    <img
                      src={item.product_image}
                      alt={item.product_name}
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                  ) : (
                    <ShoppingBag className="w-8 h-8 text-neutral-300" />
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <h3
                      className="text-base font-semibold text-neutral-900 hover:text-blue-600 cursor-pointer"
                      onClick={() => navigate(`/product/${item.product_slug}`)}
                    >
                      {item.product_name}
                    </h3>
                    <span className="text-base font-bold text-neutral-900 shrink-0">
                      {formatINR(item.total_price_paise)}
                    </span>
                  </div>

                  <div className="text-xs text-neutral-500 space-x-2">
                    {item.selected_color && <span>Finish: {item.selected_color}</span>}
                    {item.selected_config && <span>• Config: {item.selected_config}</span>}
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    {/* Stepper */}
                    <div className="flex items-center border border-neutral-200 rounded-xl overflow-hidden bg-neutral-50">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="px-3 py-1 text-xs font-semibold text-neutral-600 hover:bg-neutral-200"
                      >
                        -
                      </button>
                      <span className="px-3 text-xs font-semibold text-neutral-900">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, Math.min(10, item.quantity + 1))}
                        className="px-3 py-1 text-xs font-semibold text-neutral-600 hover:bg-neutral-200"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-xs text-neutral-400 hover:text-rose-600 flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Delivery Method Choice */}
          <div className="bg-white rounded-3xl p-6 border border-neutral-200/60 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-neutral-900 flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-600" /> Delivery Options
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                  deliveryMethod === 'standard'
                    ? 'border-blue-600 bg-blue-50/30'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <input
                  type="radio"
                  name="delivery"
                  checked={deliveryMethod === 'standard'}
                  onChange={() => setDeliveryMethod('standard')}
                  className="mt-1"
                />
                <div>
                  <span className="text-xs font-bold text-neutral-900 block">Complimentary Standard</span>
                  <span className="text-xs text-neutral-500 block">Delivers in 2-4 business days</span>
                  <span className="text-xs font-bold text-emerald-600 mt-1 block">Free</span>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                  deliveryMethod === 'express'
                    ? 'border-blue-600 bg-blue-50/30'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <input
                  type="radio"
                  name="delivery"
                  checked={deliveryMethod === 'express'}
                  onChange={() => setDeliveryMethod('express')}
                  className="mt-1"
                />
                <div>
                  <span className="text-xs font-bold text-neutral-900 block">Express Air Priority</span>
                  <span className="text-xs text-neutral-500 block">Guaranteed next-business-day delivery</span>
                  <span className="text-xs font-bold text-neutral-900 mt-1 block">₹499</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Order Summary (Right: 4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/60 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-neutral-900 tracking-tight">Order Summary</h2>

            {/* Financial Breakdown */}
            <div className="space-y-3 text-xs border-b border-neutral-100 pb-4">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal ({cart?.total_items} items)</span>
                <span className="font-semibold text-neutral-900">{formatINR(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Promotional Savings ({discountCode})</span>
                  <span>-{formatINR(discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-neutral-600">
                <span>Estimated Delivery</span>
                <span>{shipping === 0 ? 'Complimentary' : formatINR(shipping)}</span>
              </div>

              <div className="flex justify-between text-neutral-600">
                <span>GST (18% inclusive)</span>
                <span>{formatINR(tax)}</span>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-baseline">
              <span className="text-sm font-bold text-neutral-900">Total Due</span>
              <span className="text-2xl font-bold text-neutral-900 tracking-tight">{formatINR(total)}</span>
            </div>

            {/* Promo Code Input */}
            <div className="pt-2">
              {cart?.discount_code ? (
                <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                    <Tag className="w-4 h-4 text-emerald-600" />
                    <span>{cart.discount_code} Applied</span>
                  </div>
                  <button
                    onClick={removeDiscount}
                    className="text-xs text-emerald-700 underline font-medium hover:text-emerald-900"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Promo code (e.g. MAPPLE10)"
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-blue-500 uppercase"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}
            </div>

            {/* Checkout CTA */}
            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 px-6 rounded-2xl bg-[#0071e3] text-white text-sm font-semibold hover:bg-[#0077ed] transition-all flex items-center justify-center gap-2 shadow-lg hover:scale-[1.01]"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </button>

            {/* Trust Info */}
            <div className="space-y-2 pt-2 text-[11px] text-neutral-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>256-Bit Bank Grade SSL Encrypted Checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-blue-500 shrink-0" />
                <span>14-day complimentary returns on all devices</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
