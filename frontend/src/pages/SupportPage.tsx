import React, { useState } from 'react';
import { api, ApiError } from '../services/api';
import { useToast } from '../contexts/ToastContext';
import {
  HelpCircle,
  Package,
  Wrench,
  ShieldCheck,
  Send,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQS = [
  {
    q: 'How does MAPPLE complimentary delivery work across India?',
    a: 'Every MAPPLE flagship device qualifies for complimentary express air dispatch with real-time end-to-end tracking. Shipments are typically delivered in 2 to 4 business days.',
  },
  {
    q: 'What is covered under the 1-Year MAPPLE Care warranty?',
    a: 'All internal hardware components, display panels, logic boards, wireless charging coils, and batteries with capacity degradation beyond 20% are fully covered with complimentary repair or replacement.',
  },
  {
    q: 'Can I return my device if I change my mind?',
    a: 'Yes. MAPPLE offers a 14-day hassle-free return policy on all eligible hardware in original condition with box packaging.',
  },
  {
    q: 'How do I track an existing order?',
    a: 'You can track your order status directly from your Account Dashboard or via our dedicated Order Support page using your order reference ID and email.',
  },
];

export const SupportPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    order_id: '',
    category: 'General',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { success, error } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/support/contact', {
        name: formData.name,
        email: formData.email,
        order_id: formData.order_id || undefined,
        category: formData.category,
        subject: formData.subject,
        message: formData.message,
      });
      setSubmitted(true);
      success('Ticket Created', 'Your support inquiry has been submitted. A technician will follow up shortly.');
    } catch (err: any) {
      const msg = err instanceof ApiError ? err.message : 'Failed to submit ticket';
      error('Support Error', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-8 space-y-12 max-w-5xl mx-auto px-4">
      {/* Support Hero Header */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-neutral-200/60 shadow-sm text-center space-y-3">
        <span className="text-[10px] font-bold tracking-wider uppercase text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          MAPPLE Customer Care
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#1d1d1f]">
          How can we assist you today?
        </h1>
        <p className="text-sm text-neutral-500 max-w-xl mx-auto font-light">
          Get help with your MAPPLE devices, review warranties, track orders, or connect with a technical specialist.
        </p>

        <div className="pt-4 flex flex-wrap justify-center gap-3">
          <Link
            to="/support/orders"
            className="px-5 py-2.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-xs font-semibold text-neutral-800 transition-colors flex items-center gap-1.5"
          >
            <Package className="w-4 h-4 text-blue-600" /> Track Existing Order
          </Link>
          <a
            href="#contact-form"
            className="px-5 py-2.5 rounded-full bg-[#0071e3] text-white text-xs font-semibold hover:bg-[#0077ed] transition-colors"
          >
            File a Ticket
          </a>
        </div>
      </div>

      {/* Quick Topic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-neutral-200/60 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-neutral-900">Orders & Deliveries</h3>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Check real-time air dispatch timelines, request delivery address adjustments, or manage order cancellations.
          </p>
          <Link to="/support/orders" className="text-xs text-blue-600 font-semibold hover:underline block pt-2">
            Order lookup & status →
          </Link>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-neutral-200/60 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-neutral-900">MAPPLE Care Warranty</h3>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Review your 1-year complimentary hardware warranty, accidental protection options, and repair privileges.
          </p>
          <Link to="/shipping-returns" className="text-xs text-blue-600 font-semibold hover:underline block pt-2">
            Warranty terms →
          </Link>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-neutral-200/60 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Wrench className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-neutral-900">Device Diagnostics</h3>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Troubleshoot display settings, M-Silicon firmware updates, wireless MagCharge pairing, and battery tuning.
          </p>
          <a href="#contact-form" className="text-xs text-blue-600 font-semibold hover:underline block pt-2">
            Speak with an engineer →
          </a>
        </div>
      </div>

      {/* FAQs */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-neutral-200/60 shadow-sm space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1d1d1f]">
          Frequently Asked Questions
        </h2>

        <div className="divide-y divide-neutral-100">
          {FAQS.map((faq, i) => (
            <div key={i} className="py-4 space-y-1">
              <h4 className="text-sm font-semibold text-neutral-900">{faq.q}</h4>
              <p className="text-xs text-neutral-500 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Form */}
      <div id="contact-form" className="bg-white rounded-3xl p-8 sm:p-12 border border-neutral-200/60 shadow-sm space-y-6">
        <div className="border-b border-neutral-100 pb-4">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1d1d1f]">
            Submit a Support Request
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Our specialized product engineering support team typically responds within 4 business hours.
          </p>
        </div>

        {submitted ? (
          <div className="p-8 text-center bg-emerald-50 rounded-2xl border border-emerald-200 space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="text-base font-bold text-emerald-900">Your Support Ticket is Registered</h3>
            <p className="text-xs text-emerald-700 max-w-md mx-auto">
              We have dispatched a confirmation ticket to {formData.email}. A MAPPLE technical representative will get back to you shortly.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  name: '',
                  email: '',
                  order_id: '',
                  category: 'General',
                  subject: '',
                  message: '',
                });
              }}
              className="mt-4 px-6 py-2 rounded-xl bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800"
            >
              Submit Another Inquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Alex Mercer"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="alex@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-blue-500 bg-white"
                >
                  <option value="General">General Questions</option>
                  <option value="Orders">Order & Delivery Status</option>
                  <option value="Technical">Hardware & Silicon Diagnostics</option>
                  <option value="Returns">Returns & Refunds</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Order Reference ID (Optional)</label>
                <input
                  type="text"
                  value={formData.order_id}
                  onChange={(e) => setFormData({ ...formData, order_id: e.target.value })}
                  placeholder="e.g. MPL-98421"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Subject *</label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Brief summary of your question"
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Detailed Message *</label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Describe what you need assistance with..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 rounded-xl bg-[#0071e3] text-white text-xs font-semibold hover:bg-[#0077ed] transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
            >
              <Send className="w-4 h-4" /> {isSubmitting ? 'Submitting...' : 'Submit Support Ticket'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
