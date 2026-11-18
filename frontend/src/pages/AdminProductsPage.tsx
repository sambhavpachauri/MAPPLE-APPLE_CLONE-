import React, { useState, useEffect } from 'react';
import { api, ApiError } from '../services/api';
import { ProductListItem, Category } from '../types';
import { formatINR } from '../lib/utils';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  ArrowLeft,
  Search,
  CheckCircle2,
  AlertTriangle,
  X,
} from 'lucide-react';

export const AdminProductsPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    slug: '',
    category_id: 1,
    price_inr: 79900,
    short_description: '',
    full_description: '',
    stock_quantity: 50,
    badge: 'New',
    primary_image_url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=80',
  });

  const { success, error } = useToast();

  const fetchProducts = async () => {
    try {
      const [prods, cats] = await Promise.all([
        api.get<ProductListItem[]>('/admin/products'),
        api.get<Category[]>('/categories'),
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchProducts();
    }
  }, [isAdmin]);

  const handleUpdateStock = async (id: number, currentStock: number, delta: number) => {
    const newStock = Math.max(0, currentStock + delta);
    try {
      await api.patch(`/admin/products/${id}/stock?stock=${newStock}`);
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, stock_quantity: newStock } : p))
      );
      success('Stock Updated', `Stock quantity adjusted to ${newStock}.`);
    } catch {
      error('Error', 'Failed to update stock.');
    }
  };

  const handleToggleActive = async (id: number, currentActive: boolean) => {
    try {
      await api.patch(`/admin/products/${id}`, { is_active: !currentActive });
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, is_active: !currentActive } : p))
      );
      success('Status Changed', `Product is now ${!currentActive ? 'Active' : 'Inactive'}.`);
    } catch {
      error('Error', 'Failed to change product status.');
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/admin/products', {
        ...newProduct,
        price_paise: Math.round(newProduct.price_inr * 100),
      });
      success('Product Created', `Added ${newProduct.name} to catalogue.`);
      setIsModalOpen(false);
      fetchProducts();
    } catch (err: any) {
      const msg = err instanceof ApiError ? err.message : 'Failed to create product';
      error('Error', msg);
    }
  };

  if (!isAdmin) {
    return <div className="py-24 text-center">Admin credentials required.</div>;
  }

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase()) ||
      (p.category_name && p.category_name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="py-8 space-y-8 max-w-6xl mx-auto px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link to="/admin" className="p-2 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-100">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1d1d1f]">
              Product Catalogue Management
            </h1>
            <p className="text-xs text-neutral-500 mt-0.5">Manage live device inventory, prices, and status.</p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#0071e3] text-white text-xs font-semibold hover:bg-[#0077ed] transition-colors flex items-center gap-1.5 shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add New Model
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-neutral-200/60 shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-neutral-400 ml-2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by name, slug, or category..."
          className="w-full text-xs bg-transparent focus:outline-none text-neutral-800"
        />
        {search && (
          <button onClick={() => setSearch('')} className="p-1 text-neutral-400 hover:text-neutral-700">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Products Table Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/60 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs min-w-[700px]">
          <thead>
            <tr className="border-b border-neutral-200 pb-3 text-neutral-400 font-semibold uppercase tracking-wider text-[10px]">
              <th className="py-2">Device</th>
              <th className="py-2">Category</th>
              <th className="py-2">Retail Price</th>
              <th className="py-2">Stock Level</th>
              <th className="py-2">State</th>
              <th className="py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 text-neutral-800">
            {filtered.map((product) => (
              <tr key={product.id} className="hover:bg-neutral-50/60 transition-colors">
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-neutral-100 p-1 shrink-0 flex items-center justify-center">
                      {product.primary_image && (
                        <img src={product.primary_image} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-neutral-900">{product.name}</p>
                      <p className="text-[11px] text-neutral-400 font-mono">{product.slug}</p>
                    </div>
                  </div>
                </td>

                <td className="py-3 font-medium text-neutral-600">
                  {product.category_name || 'Flagship'}
                </td>

                <td className="py-3 font-bold text-neutral-900">
                  {formatINR(product.price_paise)}
                </td>

                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpdateStock(product.id, product.stock_quantity, -5)}
                      className="w-5 h-5 rounded bg-neutral-100 text-neutral-600 hover:bg-neutral-200 flex items-center justify-center text-xs font-bold"
                    >
                      -
                    </button>
                    <span
                      className={`font-semibold ${
                        product.stock_quantity <= 5 ? 'text-amber-600 font-bold' : 'text-neutral-900'
                      }`}
                    >
                      {product.stock_quantity}
                    </span>
                    <button
                      onClick={() => handleUpdateStock(product.id, product.stock_quantity, 5)}
                      className="w-5 h-5 rounded bg-neutral-100 text-neutral-600 hover:bg-neutral-200 flex items-center justify-center text-xs font-bold"
                    >
                      +
                    </button>
                  </div>
                </td>

                <td className="py-3">
                  <button
                    onClick={() => handleToggleActive(product.id, product.is_active)}
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      product.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-neutral-600'
                    }`}
                  >
                    {product.is_active ? 'Active' : 'Inactive'}
                  </button>
                </td>

                <td className="py-3 text-right">
                  <Link
                    to={`/product/${product.slug}`}
                    className="text-blue-600 hover:underline font-semibold ml-3"
                  >
                    Live Preview
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-neutral-200 space-y-6 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h2 className="text-lg font-bold text-neutral-900">Add New MAPPLE Product</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                    setNewProduct({ ...newProduct, name, slug });
                  }}
                  placeholder="e.g. MAPPLE Phone Ultra"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={newProduct.slug}
                    onChange={(e) => setNewProduct({ ...newProduct, slug: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Category</label>
                  <select
                    value={newProduct.category_id}
                    onChange={(e) => setNewProduct({ ...newProduct, category_id: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Price in INR (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newProduct.price_inr}
                    onChange={(e) => setNewProduct({ ...newProduct, price_inr: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Initial Stock *</label>
                  <input
                    type="number"
                    required
                    value={newProduct.stock_quantity}
                    onChange={(e) => setNewProduct({ ...newProduct, stock_quantity: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Badge</label>
                <input
                  type="text"
                  value={newProduct.badge}
                  onChange={(e) => setNewProduct({ ...newProduct, badge: e.target.value })}
                  placeholder="e.g. Pro Flagship, New, Popular"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Short Description *</label>
                <input
                  type="text"
                  required
                  value={newProduct.short_description}
                  onChange={(e) => setNewProduct({ ...newProduct, short_description: e.target.value })}
                  placeholder="One-sentence editorial summary"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Full Description *</label>
                <textarea
                  required
                  rows={3}
                  value={newProduct.full_description}
                  onChange={(e) => setNewProduct({ ...newProduct, full_description: e.target.value })}
                  placeholder="Detailed architecture and features"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={newProduct.primary_image_url}
                  onChange={(e) => setNewProduct({ ...newProduct, primary_image_url: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-neutral-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#0071e3] text-white text-xs font-semibold hover:bg-[#0077ed]"
                >
                  Create Model
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
