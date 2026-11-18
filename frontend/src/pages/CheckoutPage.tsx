import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { api, ApiError } from '../services/api';
import { formatINR } from '../lib/utils';
import { useToast } from '../contexts/ToastContext';
import {
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Truck,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Lock,
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { cart, deliveryMethod, discountCode, refreshCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { error, success } = useToast();
  const navigate = useNavigate();

  // Multi-step progress (1: Contact & Shipping, 2: Delivery & Review, 3: Payment)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    customer_email: user?.email || '',
    customer_name: user?.full_name || '',
    customer_phone: user?.phone || '',
    street_line1: '',
    street_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'India',
    delivery_method: deliveryMethod || 'standard',
    payment_method: 'mock_card', // Clearly identified test mode
  });

  // Pre-fill user details if logged in
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        customer_email: user.email,
        customer_name: user.full_name,
        customer_phone: user.phone || prev.customer_phone,
      }));

      // Try fetching saved addresses
      api.get<any[]>('/addresses').then((addresses) => {
        if (addresses && addresses.length > 0) {
          const defaultAddr = addresses.find((a) => a.is_default) || addresses[0];
          setFormData((prev) => ({
            ...prev,
            street_line1: defaultAddr.street_line1,
            street_line2: defaultAddr.street_line2 || '',
            city: defaultAddr.city,
            state: defaultAddr.state,
            postal_code: defaultAddr.postal_code,
            country: defaultAddr.country || 'India',
            customer_phone: defaultAddr.phone || prev.customer_phone,
          }));
        }
      }).catch(() => {});
    }
  }, [user]);

  if (!cart || cart.items.length === 0) {
    return (
      <div className="py-24 text-center max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-neutral-900">Your bag is empty</h2>
        <p className="text-xs text-neutral-500 mt-2">Add items to your bag before proceeding to checkout.</p>
        <button
          onClick={() => navigate('/store')}
          className="mt-6 px-6 py-2.5 rounded-full bg-[#0071e3] text-white text-xs font-semibold"
        >
          Return to Store
        </button>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customer_email || !formData.customer_name || !formData.customer_phone || !formData.street_line1 || !formData.city || !formData.postal_code) {
      error('Missing Information', 'Please fill in all mandatory contact and shipping fields.');
      return;
    }
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompleteOrder = async () => {
    setIsSubmitting(true);
    try {
      const orderPayload = {
        customer_email: formData.customer_email,
        customer_name: formData.customer_name,
        customer_phone: formData.customer_phone,
        shipping_address: {
          full_name: formData.customer_name,
          street_line1: formData.street_line1,
          street_line2: formData.street_line2,
          city: formData.city,
          state: formData.state,
          postal_code: formData.postal_code,
          country: formData.country,
          phone: formData.customer_phone,
        },
        delivery_method: formData.delivery_method,
        payment_method: formData.payment_method,
        discount_code: discountCode || undefined,
        guest_token: cart.guest_token,
      };

      const order = await api.post<any>('/orders', orderPayload);
      await refreshCart();
      success('Order Placed Successfully', `Your order ${order.id} is being processed.`);
      navigate(`/order-success/${order.id}`);
    } catch (err: any) {
      const msg = err instanceof ApiError ? err.message : 'Failed to create order';
      error('Checkout Error', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-8 space-y-10 max-w-5xl mx-auto">
      {/* Checkout Progress Stepper */}
      <div className="bg-white rounded-3xl p-6 border border-neutral-200/60 shadow-sm">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <div className="flex items-center gap-2">
            <span
              className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center ${
                currentStep >= 1 ? 'bg-[#0071e3] text-white' : 'bg-neutral-100 text-neutral-400'
              }`}
            >
              1
            </span>
            <span className="text-xs font-semibold text-neutral-900 hidden sm:inline">Shipping & Contact</span>
          </div>
          <div className="flex-1 h-0.5 bg-neutral-200 mx-4" />
          <div className="flex items-center gap-2">
            <span
              className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center ${
                currentStep >= 2 ? 'bg-[#0071e3] text-white' : 'bg-neutral-100 text-neutral-400'
              }`}
            >
              2
            </span>
            <span className="text-xs font-semibold text-neutral-900 hidden sm:inline">Review & Payment</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Step Form (Left: 7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {currentStep === 1 && (
            <form onSubmit={handleNextStep1} className="bg-white rounded-3xl p-8 border border-neutral-200/60 shadow-sm space-y-6">
              <div className="border-b border-neutral-100 pb-4">
                <h2 className="text-lg font-bold text-neutral-900">Step 1: Contact & Delivery Address</h2>
                <p className="text-xs text-neutral-500 mt-0.5">Where should we deliver your MAPPLE hardware?</p>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Contact Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      name="customer_name"
                      required
                      value={formData.customer_name}
                      onChange={handleInputChange}
                      placeholder="Alex Mercer"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      name="customer_email"
                      required
                      value={formData.customer_email}
                      onChange={handleInputChange}
                      placeholder="alex@mapple.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    name="customer_phone"
                    required
                    value={formData.customer_phone}
                    onChange={handleInputChange}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Shipping Address */}
              <div className="space-y-4 pt-4 border-t border-neutral-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Shipping Address</h3>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Address Line 1 *</label>
                  <input
                    type="text"
                    name="street_line1"
                    required
                    value={formData.street_line1}
                    onChange={handleInputChange}
                    placeholder="Apartment, suite, unit, building, or street address"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Address Line 2 (Optional)</label>
                  <input
                    type="text"
                    name="street_line2"
                    value={formData.street_line2}
                    onChange={handleInputChange}
                    placeholder="Floor, landmark, building number"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">City *</label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Bengaluru"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">State / Region *</label>
                    <input
                      type="text"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="Karnataka"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">PIN / Postal Code *</label>
                    <input
                      type="text"
                      name="postal_code"
                      required
                      value={formData.postal_code}
                      onChange={handleInputChange}
                      placeholder="560100"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">Country</label>
                    <input
                      type="text"
                      name="country"
                      disabled
                      value={formData.country}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-neutral-100 text-neutral-500 text-xs cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-4 px-6 rounded-2xl bg-[#0071e3] text-white text-sm font-semibold hover:bg-[#0077ed] transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  Continue to Review & Payment <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {currentStep === 2 && (
            <div className="bg-white rounded-3xl p-8 border border-neutral-200/60 shadow-sm space-y-6">
              <div className="border-b border-neutral-100 pb-4">
                <h2 className="text-lg font-bold text-neutral-900">Step 2: Payment Simulator & Confirmation</h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Select payment gateway simulation. (Clearly labeled test mode)
                </p>
              </div>

              {/* Delivery destination summary */}
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/70 text-xs space-y-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-neutral-900">Shipping to:</span>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Edit
                  </button>
                </div>
                <p className="text-neutral-700 font-medium">{formData.customer_name} ({formData.customer_phone})</p>
                <p className="text-neutral-500">{formData.street_line1}, {formData.city}, {formData.state} - {formData.postal_code}</p>
              </div>

              {/* Clearly labeled mock payment gateway simulator */}
              <div className="space-y-4 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Payment Method</h3>

                <div className="space-y-3">
                  <label
                    className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                      formData.payment_method === 'mock_card'
                        ? 'border-blue-600 bg-blue-50/20'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value="mock_card"
                      checked={formData.payment_method === 'mock_card'}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-neutral-900">MAPPLE Certified Test Card</span>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                          Dev Simulator
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        Simulates instant 3D-Secure payment confirmation for development & test reviews.
                      </p>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                      formData.payment_method === 'mock_gateway'
                        ? 'border-blue-600 bg-blue-50/20'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value="mock_gateway"
                      checked={formData.payment_method === 'mock_gateway'}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-neutral-900">Razorpay Test Gateway Mode</span>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-neutral-200 text-neutral-800">
                          Sandbox
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        Verifies test transactions using Razorpay Test IDs and automated server validation.
                      </p>
                    </div>
                  </label>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                  <span>
                    Development Test Environment. No actual monetary charge will occur.
                  </span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="py-4 px-6 rounded-2xl border border-neutral-300 text-neutral-700 text-xs font-semibold hover:bg-neutral-100 transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="button"
                  onClick={handleCompleteOrder}
                  disabled={isSubmitting}
                  className="flex-1 py-4 px-6 rounded-2xl bg-[#0071e3] text-white text-sm font-semibold hover:bg-[#0077ed] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                >
                  {isSubmitting ? (
                    'Processing Order...'
                  ) : (
                    <>
                      <Lock className="w-4 h-4" /> Authorize & Place Order ({formatINR(cart.total_paise)})
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Review Sticky Sidebar (Right: 5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/60 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-neutral-900 tracking-tight">In Your Bag</h2>

          <div className="space-y-4 max-h-72 overflow-y-auto pr-1 divide-y divide-neutral-100">
            {cart.items.map((it) => (
              <div key={it.id} className="pt-3 first:pt-0 flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-neutral-100 p-1 shrink-0 flex items-center justify-center">
                  {it.product_image && (
                    <img src={it.product_image} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-neutral-900 truncate">{it.product_name}</p>
                  <p className="text-[11px] text-neutral-500">Qty: {it.quantity} • {it.selected_color || 'Default'}</p>
                  <p className="text-xs font-medium text-neutral-900 mt-0.5">{formatINR(it.total_price_paise)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-neutral-100 pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-neutral-600">
              <span>Subtotal</span>
              <span className="font-semibold text-neutral-900">{formatINR(cart.subtotal_paise)}</span>
            </div>
            {cart.discount_paise > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Discount ({cart.discount_code})</span>
                <span>-{formatINR(cart.discount_paise)}</span>
              </div>
            )}
            <div className="flex justify-between text-neutral-600">
              <span>Delivery</span>
              <span>{cart.shipping_paise === 0 ? 'Complimentary' : formatINR(cart.shipping_paise)}</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>GST (18% inclusive)</span>
              <span>{formatINR(cart.tax_paise)}</span>
            </div>
            <div className="border-t border-neutral-200 pt-3 flex justify-between items-baseline text-sm font-bold text-neutral-900">
              <span>Total Payable</span>
              <span className="text-xl">{formatINR(cart.total_paise)}</span>
            </div>
          </div>

          <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-100 text-[11px] text-neutral-500 space-y-1">
            <div className="flex items-center gap-1.5 font-medium text-neutral-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> MAPPLE Security Guarantee
            </div>
            <p>Every transaction is verified on the server with stock integrity reservation.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
