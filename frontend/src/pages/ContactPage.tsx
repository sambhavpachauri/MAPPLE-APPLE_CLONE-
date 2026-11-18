import React, { useState } from 'react';
import { api, ApiError } from '../services/api';
import { useToast } from '../contexts/ToastContext';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
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
      await api.post('/support/contact', formData);
      setSubmitted(true);
      success('Message Sent', 'Thank you for reaching out. We will get back to you shortly.');
    } catch (err: any) {
      const msg = err instanceof ApiError ? err.message : 'Failed to send message';
      error('Error', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-8 space-y-12 max-w-4xl mx-auto px-4">
      <div className="text-center space-y-3">
        <span className="text-[10px] font-bold tracking-wider uppercase text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          Get in Touch
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1d1d1f]">
          Contact MAPPLE
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 max-w-lg mx-auto font-light">
          Have an inquiry regarding flagship products, corporate fleet partnerships, or press inquiries?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Contact Info Sidebar */}
        <div className="space-y-6 bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/60 shadow-sm">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <p className="font-bold text-neutral-900">MAPPLE Headquarters</p>
              <p className="text-neutral-500">Titanium Towers, Cyber City</p>
              <p className="text-neutral-500">Bengaluru, Karnataka 560100</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <p className="font-bold text-neutral-900">Toll-Free Phone</p>
              <p className="text-neutral-500">+91 1800 200 6277</p>
              <p className="text-[11px] text-neutral-400">Mon - Sat: 9:00 AM - 8:00 PM IST</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <p className="font-bold text-neutral-900">Electronic Mail</p>
              <p className="text-neutral-500">contact@mapple.com</p>
              <p className="text-neutral-500">press@mapple.com</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2 bg-white rounded-3xl p-8 border border-neutral-200/60 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-neutral-900">Send an Electronic Inquiry</h2>

          {submitted ? (
            <div className="p-8 text-center bg-emerald-50 rounded-2xl border border-emerald-200 space-y-3">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h3 className="text-sm font-bold text-emerald-900">Message Delivered</h3>
              <p className="text-xs text-emerald-700">A MAPPLE liaison will respond to your inquiry shortly.</p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', email: '', category: 'General', subject: '', message: '' });
                }}
                className="mt-2 px-5 py-2 rounded-xl bg-emerald-700 text-white text-xs font-semibold"
              >
                Send Another
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-blue-500"
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Message *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 rounded-xl bg-[#0071e3] text-white text-xs font-semibold hover:bg-[#0077ed] transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
              >
                <Send className="w-4 h-4" /> {isSubmitting ? 'Sending...' : 'Transmit Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
