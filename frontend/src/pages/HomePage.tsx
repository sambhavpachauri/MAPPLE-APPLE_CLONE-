import React, { useState, useEffect } from 'react';
import { HeroCampaigns } from '../components/home/HeroCampaigns';
import { CategoryTiles } from '../components/home/CategoryTiles';
import { BenefitsBanner } from '../components/home/BenefitsBanner';
import { ComparisonBanner } from '../components/home/ComparisonBanner';
import { ProductCard } from '../components/product/ProductCard';
import { api } from '../services/api';
import { ProductListItem } from '../types';
import { Sparkles, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const FILTER_TABS = [
  { label: 'All Flagships', slug: 'all' },
  { label: 'Smartphones', slug: 'iphone' },
  { label: 'Mac Laptops', slug: 'mac' },
  { label: 'Tablets', slug: 'ipad' },
  { label: 'Watch', slug: 'watch' },
  { label: 'Audio', slug: 'audio' },
  { label: 'Accessories', slug: 'accessories' },
];

export const HomePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const url = activeTab === 'all' ? '/products?limit=12' : `/products?category=${activeTab}&limit=12`;
        const res = await api.get<{ items: ProductListItem[] }>(url);
        setProducts(res.items);
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [activeTab]);

  return (
    <div className="space-y-12 pb-16">
      {/* 4 Distinct Editorial Hero Campaigns */}
      <HeroCampaigns />

      {/* Category Icons Showcase */}
      <CategoryTiles />

      {/* Explore the MAPPLE Collection Product Grid */}
      <section className="py-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-[10px] font-bold tracking-wider uppercase text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              Curated Hardware
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#1d1d1f] mt-2">
              Explore the MAPPLE Collection
            </h2>
            <p className="text-sm text-neutral-500 mt-1">
              Precision titanium craft, state-of-the-art silicon, and sensory delight.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.slug}
                onClick={() => setActiveTab(tab.slug)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab.slug
                    ? 'bg-[#1d1d1f] text-white shadow-sm'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
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
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            to="/store"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#1d1d1f] text-white text-xs font-semibold hover:bg-neutral-800 transition-all shadow-md hover:scale-105"
          >
            Explore Complete MAPPLE Store <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Comparison Matrix CTA */}
      <ComparisonBanner />

      {/* Customer Trust Benefits */}
      <BenefitsBanner />
    </div>
  );
};
