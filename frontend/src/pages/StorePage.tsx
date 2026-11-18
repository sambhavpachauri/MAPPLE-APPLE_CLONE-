import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/product/ProductCard';
import { api } from '../services/api';
import { ProductListItem, Category } from '../types';
import { SlidersHorizontal, ArrowUpDown, Filter, X } from 'lucide-react';

export const StorePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';

  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [priceRange, setPriceRange] = useState('all');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await api.get<Category[]>('/categories');
        setCategories(cats);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (categoryParam !== 'all') {
          params.append('category', categoryParam);
        }
        if (sortBy) {
          params.append('sort_by', sortBy);
        }
        if (inStockOnly) {
          params.append('in_stock', 'true');
        }

        if (priceRange === 'under_30k') {
          params.append('max_price', '3000000');
        } else if (priceRange === '30k_75k') {
          params.append('min_price', '3000000');
          params.append('max_price', '7500000');
        } else if (priceRange === '75k_150k') {
          params.append('min_price', '7500000');
          params.append('max_price', '15000000');
        } else if (priceRange === 'above_150k') {
          params.append('min_price', '15000000');
        }

        const res = await api.get<{ items: ProductListItem[]; total: number }>(`/products?${params.toString()}`);
        setProducts(res.items);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [categoryParam, sortBy, inStockOnly, priceRange]);

  const handleCategoryChange = (slug: string) => {
    if (slug === 'all') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: slug });
    }
  };

  return (
    <div className="py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-neutral-200/60 shadow-sm text-center max-w-5xl mx-auto space-y-3">
        <span className="text-[10px] font-bold tracking-wider uppercase text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          MAPPLE Store
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#1d1d1f]">
          The Best Way to Buy the Products You Love
        </h1>
        <p className="text-base text-neutral-500 max-w-2xl mx-auto font-light">
          Explore all MAPPLE smartphones, laptops, tablets, wearables, audio, and power accessories.
        </p>
      </div>

      {/* Filter and Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200/80 pb-6">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => handleCategoryChange('all')}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              categoryParam === 'all'
                ? 'bg-[#1d1d1f] text-white shadow-sm'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            All Products
          </button>
          {categories.map((c) => (
            <button
              key={c.slug}
              onClick={() => handleCategoryChange(c.slug)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                categoryParam === c.slug
                  ? 'bg-[#1d1d1f] text-white shadow-sm'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {c.name} {c.product_count !== undefined && `(${c.product_count})`}
            </button>
          ))}
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          {/* Price Range Filter */}
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="text-xs font-medium px-3.5 py-2 rounded-xl bg-white border border-neutral-300 text-neutral-800 focus:outline-none cursor-pointer"
          >
            <option value="all">All Prices</option>
            <option value="under_30k">Under ₹30,000</option>
            <option value="30k_75k">₹30,000 - ₹75,000</option>
            <option value="75k_150k">₹75,000 - ₹1,50,000</option>
            <option value="above_150k">Above ₹1,50,000</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs font-medium px-3.5 py-2 rounded-xl bg-white border border-neutral-300 text-neutral-800 focus:outline-none cursor-pointer"
          >
            <option value="featured">Featured First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="newest">Newest Arrivals</option>
            <option value="rating">Top Customer Rated</option>
          </select>

          {/* Stock Toggle */}
          <button
            onClick={() => setInStockOnly((prev) => !prev)}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-colors flex items-center gap-1.5 ${
              inStockOnly
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold'
                : 'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-50'
            }`}
          >
            In Stock Only
          </button>
        </div>
      </div>

      {/* Product Results */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs font-medium text-neutral-500">
            Showing <span className="font-semibold text-neutral-900">{products.length}</span> devices
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white rounded-3xl p-6 border border-neutral-200/60 animate-pulse space-y-4">
                <div className="h-4 bg-neutral-200 rounded w-1/3"></div>
                <div className="w-full aspect-square bg-neutral-100 rounded-2xl"></div>
                <div className="h-5 bg-neutral-200 rounded w-3/4"></div>
                <div className="h-3 bg-neutral-100 rounded w-full"></div>
                <div className="h-8 bg-neutral-200 rounded-full mt-4"></div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-neutral-200/60 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-neutral-900">No products match your filters</h3>
            <p className="text-xs text-neutral-500 mt-1">Try clearing price or category filters.</p>
            <button
              onClick={() => {
                setPriceRange('all');
                setInStockOnly(false);
                handleCategoryChange('all');
              }}
              className="mt-6 px-6 py-2.5 rounded-full bg-[#0071e3] text-white text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
