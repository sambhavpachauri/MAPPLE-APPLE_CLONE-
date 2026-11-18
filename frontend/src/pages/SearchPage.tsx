import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { ProductListItem } from '../types';
import { ProductCard } from '../components/product/ProductCard';
import { Search, Sparkles } from 'lucide-react';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(query);

  useEffect(() => {
    setSearchTerm(query);
  }, [query]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      setIsLoading(true);
      try {
        const url = query ? `/products?search=${encodeURIComponent(query)}&limit=50` : '/products?limit=24';
        const res = await api.get<{ items: ProductListItem[]; total: number }>(url);
        setProducts(res.items);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSearchResults();
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSearchParams({ q: searchTerm.trim() });
    }
  };

  return (
    <div className="py-8 space-y-8">
      {/* Search Header */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-neutral-200/60 shadow-sm max-w-3xl mx-auto text-center space-y-4">
        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#1d1d1f]">
          {query ? `Search Results for "${query}"` : 'Search MAPPLE Catalogue'}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 font-light">
          Find smartphones, notebooks, tablets, watches, and smart audio.
        </p>

        <form onSubmit={handleSubmit} className="flex items-center gap-2 max-w-lg mx-auto pt-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products, chips, colors..."
              className="w-full pl-11 pr-4 py-3 rounded-full bg-neutral-100 border border-neutral-200 text-sm focus:outline-none focus:bg-white focus:border-blue-500 transition-all"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-full bg-[#0071e3] text-white text-xs font-semibold hover:bg-[#0077ed] transition-colors shrink-0"
          >
            Search
          </button>
        </form>
      </div>

      {/* Results Grid */}
      <div>
        <p className="text-xs font-medium text-neutral-500 mb-6">
          Found <span className="font-semibold text-neutral-900">{products.length}</span> matching devices
        </p>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-3xl p-6 border border-neutral-200/60 animate-pulse space-y-4">
                <div className="w-full aspect-square bg-neutral-100 rounded-2xl"></div>
                <div className="h-5 bg-neutral-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-neutral-200/60 max-w-md mx-auto">
            <p className="text-lg font-semibold text-neutral-900">No results found for "{query}"</p>
            <p className="text-xs text-neutral-500 mt-1">Please try alternative search keywords.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
