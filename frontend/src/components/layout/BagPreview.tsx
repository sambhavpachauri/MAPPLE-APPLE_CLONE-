import React, { useEffect } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { formatINR } from '../../lib/utils';

export const BagPreview: React.FC = () => {
  const { cart, isCartOpen, closeCart, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) {
        closeCart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, closeCart]);

  if (!isCartOpen) return null;

  const items = cart?.items || [];
  const subtotal = cart?.subtotal_paise || 0;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-neutral-900" />
              <h2 className="text-lg font-semibold text-neutral-900 tracking-tight">Your Shopping Bag</h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={closeCart}
              className="p-2 text-neutral-400 hover:text-neutral-900 rounded-full hover:bg-neutral-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900">Your bag is empty</h3>
                <p className="text-sm text-neutral-500 mt-1 max-w-xs">
                  Explore our latest MAPPLE flagship phones, laptops, and wearables.
                </p>
                <button
                  onClick={() => {
                    closeCart();
                    navigate('/store');
                  }}
                  className="mt-6 px-6 py-2.5 rounded-full bg-[#0071e3] text-white text-sm font-medium hover:bg-[#0077ed] transition-colors"
                >
                  Explore Store
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex gap-4 pb-6 border-b border-neutral-100 last:border-b-0">
                  <div
                    className="w-20 h-20 rounded-2xl bg-[#f5f5f7] p-2 overflow-hidden flex items-center justify-center shrink-0 cursor-pointer"
                    onClick={() => {
                      closeCart();
                      navigate(`/product/${item.product_slug}`);
                    }}
                  >
                    {item.product_image ? (
                      <img
                        src={item.product_image}
                        alt={item.product_name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <ShoppingBag className="w-8 h-8 text-neutral-400" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4
                      className="text-sm font-semibold text-neutral-900 truncate hover:text-blue-600 cursor-pointer"
                      onClick={() => {
                        closeCart();
                        navigate(`/product/${item.product_slug}`);
                      }}
                    >
                      {item.product_name}
                    </h4>
                    <div className="text-xs text-neutral-500 mt-0.5 space-x-2">
                      {item.selected_color && <span>{item.selected_color}</span>}
                      {item.selected_config && <span>• {item.selected_config}</span>}
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden bg-neutral-50">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="px-2.5 py-1 text-xs font-semibold text-neutral-600 hover:bg-neutral-200 transition-colors"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-medium text-neutral-900">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, Math.min(10, item.quantity + 1))}
                          className="px-2.5 py-1 text-xs font-semibold text-neutral-600 hover:bg-neutral-200 transition-colors"
                        >
                          +
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-neutral-900">
                          {formatINR(item.total_price_paise)}
                        </span>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-neutral-400 hover:text-rose-500 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {items.length > 0 && (
            <div className="p-6 border-t border-neutral-100 bg-[#fbfbfd] space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Subtotal</span>
                  <span className="font-semibold text-neutral-900">{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-xs text-emerald-600 font-medium">
                  <span>Delivery</span>
                  <span>Complimentary</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-neutral-500 py-1">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Complimentary express delivery and 14-day hassle-free returns included.</span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  onClick={() => {
                    closeCart();
                    navigate('/cart');
                  }}
                  className="w-full py-3 px-4 rounded-xl border border-neutral-300 text-neutral-800 text-sm font-medium hover:bg-neutral-100 transition-colors text-center"
                >
                  Review Bag
                </button>
                <button
                  onClick={() => {
                    closeCart();
                    navigate('/checkout');
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-[#0071e3] text-white text-sm font-medium hover:bg-[#0077ed] transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  Checkout <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
