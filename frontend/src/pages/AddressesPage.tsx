import React, { useState, useEffect } from 'react';
import { api, ApiError } from '../services/api';
import { Address } from '../types';
import { useToast } from '../contexts/ToastContext';
import { MapPin, Plus, Trash2, Edit2, CheckCircle2, ArrowLeft, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AddressesPage: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Address Form State
  const [formData, setFormData] = useState({
    full_name: '',
    street_line1: '',
    street_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'India',
    phone: '',
    is_default: false,
  });

  const { success, error } = useToast();

  const fetchAddresses = async () => {
    try {
      const data = await api.get<Address[]>('/addresses');
      setAddresses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const resetForm = () => {
    setFormData({
      full_name: '',
      street_line1: '',
      street_line2: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'India',
      phone: '',
      is_default: false,
    });
    setEditingId(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (addr: Address) => {
    setEditingId(addr.id);
    setFormData({
      full_name: addr.full_name,
      street_line1: addr.street_line1,
      street_line2: addr.street_line2 || '',
      city: addr.city,
      state: addr.state,
      postal_code: addr.postal_code,
      country: addr.country,
      phone: addr.phone,
      is_default: addr.is_default,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.patch(`/addresses/${editingId}`, formData);
        success('Address Updated', 'Shipping address has been updated.');
      } else {
        await api.post('/addresses', formData);
        success('Address Added', 'New shipping address added to your address book.');
      }
      setIsModalOpen(false);
      resetForm();
      fetchAddresses();
    } catch (err: any) {
      const msg = err instanceof ApiError ? err.message : 'Failed to save address';
      error('Error', msg);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    try {
      await api.delete(`/addresses/${id}`);
      success('Address Deleted', 'Address removed from your address book.');
      fetchAddresses();
    } catch {
      error('Error', 'Failed to delete address.');
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      await api.post(`/addresses/${id}/default`);
      success('Default Address Set', 'Default shipping address updated.');
      fetchAddresses();
    } catch {
      error('Error', 'Failed to update default address.');
    }
  };

  return (
    <div className="py-8 space-y-8 max-w-4xl mx-auto px-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/account" className="p-2 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-100">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1d1d1f]">
              Saved Addresses
            </h1>
            <p className="text-xs text-neutral-500 mt-0.5">Manage your delivery locations for fast express dispatch.</p>
          </div>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-[#0071e3] text-white text-xs font-semibold hover:bg-[#0077ed] transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Address
        </button>
      </div>

      {/* Address Cards Grid */}
      {addresses.length === 0 && !isLoading ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-neutral-200/60 max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-neutral-900">No saved addresses</h3>
          <p className="text-xs text-neutral-500">Add an address to speed through checkout.</p>
          <button
            onClick={handleOpenCreate}
            className="px-6 py-2.5 rounded-full bg-[#0071e3] text-white text-xs font-semibold hover:bg-[#0077ed]"
          >
            Add New Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`bg-white rounded-3xl p-6 border transition-all flex flex-col justify-between ${
                addr.is_default ? 'border-blue-500 shadow-md ring-1 ring-blue-500/20' : 'border-neutral-200/70 shadow-sm'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-neutral-900">{addr.full_name}</h3>
                  {addr.is_default ? (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      Default Shipping
                    </span>
                  ) : (
                    <button
                      onClick={() => handleSetDefault(addr.id)}
                      className="text-xs text-neutral-400 hover:text-blue-600 font-medium"
                    >
                      Set as Default
                    </button>
                  )}
                </div>

                <div className="text-xs text-neutral-600 leading-relaxed space-y-0.5">
                  <p>{addr.street_line1}</p>
                  {addr.street_line2 && <p>{addr.street_line2}</p>}
                  <p>{addr.city}, {addr.state} - {addr.postal_code}</p>
                  <p>{addr.country}</p>
                  <p className="text-neutral-500 pt-1">Phone: {addr.phone}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex items-center justify-end gap-3 mt-4">
                <button
                  onClick={() => handleOpenEdit(addr)}
                  className="text-xs text-neutral-500 hover:text-neutral-900 flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(addr.id)}
                  className="text-xs text-neutral-400 hover:text-rose-600 flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Add / Edit Address */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-neutral-200 space-y-6 animate-in zoom-in-95 duration-200">
            <h2 className="text-lg font-bold text-neutral-900">
              {editingId ? 'Edit Address' : 'Add New Address'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Street Address Line 1 *</label>
                <input
                  type="text"
                  required
                  value={formData.street_line1}
                  onChange={(e) => setFormData({ ...formData, street_line1: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Street Address Line 2</label>
                <input
                  type="text"
                  value={formData.street_line2}
                  onChange={(e) => setFormData({ ...formData, street_line2: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">PIN Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.postal_code}
                    onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={formData.is_default}
                  onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                  className="rounded"
                />
                <span>Set as default shipping address</span>
              </label>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-neutral-300 text-xs font-semibold hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#0071e3] text-white text-xs font-semibold hover:bg-[#0077ed]"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
