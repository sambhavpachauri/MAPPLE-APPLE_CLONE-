import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ProductDetail, ProductListItem } from '../types';
import { formatINR } from '../lib/utils';
import { Link } from 'react-router-dom';
import { Plus, X, ShoppingBag, CheckCircle2, ChevronDown } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

export const ComparePage: React.FC = () => {
  const [allProducts, setAllProducts] = useState<ProductListItem[]>([]);
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([
    'mapple-phone-pro',
    'mapple-phone',
    'mapple-phone-air',
  ]);
  const [comparedProducts, setComparedProducts] = useState<ProductDetail[]>([]);
  const [specGroups, setSpecGroups] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { addItem } = useCart();

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const res = await api.get<{ items: ProductListItem[] }>('/products?limit=50');
        setAllProducts(res.items);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAllProducts();
  }, []);

  useEffect(() => {
    const fetchComparison = async () => {
      if (selectedSlugs.length === 0) {
        setComparedProducts([]);
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const data = await api.get<{ products: ProductDetail[]; spec_groups: string[] }>(
          `/products/compare?slugs=${selectedSlugs.join(',')}`
        );
        setComparedProducts(data.products);
        setSpecGroups(data.spec_groups || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchComparison();
  }, [selectedSlugs]);

  const handleProductChange = (index: number, newSlug: string) => {
    const updated = [...selectedSlugs];
    updated[index] = newSlug;
    setSelectedSlugs(updated);
  };

  const handleRemoveColumn = (index: number) => {
    setSelectedSlugs(selectedSlugs.filter((_, i) => i !== index));
  };

  const handleAddColumn = () => {
    const unused = allProducts.find((p) => !selectedSlugs.includes(p.slug));
    if (unused) {
      setSelectedSlugs([...selectedSlugs, unused.slug]);
    }
  };

  return (
    <div className="py-8 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-[10px] font-bold tracking-wider uppercase text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          Side-by-Side Evaluation
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#1d1d1f]">
          Compare MAPPLE Models
        </h1>
        <p className="text-sm text-neutral-500 font-light">
          Inspect key differences in computational silicon, display engineering, battery stamina, and optical systems.
        </p>
      </div>

      {/* Comparison Grid */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-neutral-200/60 shadow-sm overflow-x-auto">
        {/* Device Selectors Header Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 min-w-[700px] border-b border-neutral-200 pb-8 items-start">
          <div className="hidden lg:block pt-6">
            <h3 className="text-base font-semibold text-neutral-900">Comparing Models</h3>
            <p className="text-xs text-neutral-500 mt-1">Select up to 4 models from the dropdowns.</p>
            {selectedSlugs.length < 4 && (
              <button
                onClick={handleAddColumn}
                className="mt-4 px-4 py-2 rounded-full border border-neutral-300 text-xs font-semibold hover:bg-neutral-50 flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add Column
              </button>
            )}
          </div>

          {comparedProducts.map((p, idx) => (
            <div key={p.id} className="space-y-4 text-center relative flex flex-col justify-between">
              {comparedProducts.length > 1 && (
                <button
                  onClick={() => handleRemoveColumn(idx)}
                  className="absolute -top-2 right-0 p-1 text-neutral-400 hover:text-neutral-700 rounded-full"
                  title="Remove column"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Product Selector Dropdown */}
              <select
                value={p.slug}
                onChange={(e) => handleProductChange(idx, e.target.value)}
                className="w-full text-xs font-semibold py-1.5 px-2 bg-neutral-100 rounded-lg border border-neutral-200 text-neutral-800 focus:outline-none"
              >
                {allProducts.map((item) => (
                  <option key={item.id} value={item.slug}>
                    {item.name}
                  </option>
                ))}
              </select>

              {/* Product Thumbnail */}
              <div className="w-full aspect-square bg-[#fbfbfd] rounded-2xl p-4 flex items-center justify-center">
                {p.primary_image && (
                  <img src={p.primary_image} alt={p.name} className="max-h-full object-contain mix-blend-multiply" />
                )}
              </div>

              <div>
                <h4 className="text-base font-bold text-neutral-900">{p.name}</h4>
                <p className="text-sm font-semibold text-neutral-800 mt-1">{formatINR(p.price_paise)}</p>
                <p className="text-xs text-neutral-500 mt-0.5 line-clamp-2">{p.short_description}</p>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => addItem(p.id, 1)}
                  className="w-full py-2 px-3 rounded-full bg-[#0071e3] text-white text-xs font-semibold hover:bg-[#0077ed] transition-colors"
                >
                  Buy Now
                </button>
                <Link
                  to={`/product/${p.slug}`}
                  className="block text-xs text-[#0071e3] hover:underline font-medium"
                >
                  View Full Details
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Specifications Comparison Rows */}
        <div className="min-w-[700px] divide-y divide-neutral-100 mt-6">
          {/* Colors Row */}
          <div className="py-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-center">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider hidden lg:block">
              Available Finishes
            </span>
            {comparedProducts.map((p) => (
              <div key={p.id} className="flex justify-center gap-1.5 flex-wrap">
                {p.colors?.map((c) => (
                  <span
                    key={c.id}
                    title={c.name}
                    className="w-4 h-4 rounded-full border border-black/10 shadow-inner"
                    style={{ backgroundColor: c.hex_code }}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Grouped Specs Rows */}
          {specGroups.map((group) => (
            <div key={group} className="py-6 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50/70 px-3 py-1.5 rounded-lg inline-block">
                {group}
              </h4>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 text-xs text-neutral-800 pt-2">
                <span className="font-semibold text-neutral-500 hidden lg:block">Details</span>
                {comparedProducts.map((p) => {
                  const groupSpecs = p.specs?.filter((s) => s.group_name === group) || [];
                  return (
                    <div key={p.id} className="space-y-2 text-center sm:text-left">
                      {groupSpecs.length > 0 ? (
                        groupSpecs.map((sp) => (
                          <div key={sp.id} className="pb-1 border-b border-neutral-100 last:border-b-0">
                            <span className="text-[11px] text-neutral-500 block">{sp.spec_name}</span>
                            <span className="font-medium text-neutral-900">{sp.spec_value}</span>
                          </div>
                        ))
                      ) : (
                        <span className="text-neutral-400">—</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
