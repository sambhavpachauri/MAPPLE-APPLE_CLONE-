import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { ProductCard } from '../components/product/ProductCard';
import { api } from '../services/api';
import { ProductListItem, Category } from '../types';
import { Sparkles, SlidersHorizontal, ArrowRight, ShieldCheck, Truck } from 'lucide-react';

export const CategoryPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug?: string }>();
  const location = useLocation();

  // If path is /store/iphone, extract 'iphone'
  const currentSlug = categorySlug || location.pathname.split('/').pop() || 'iphone';

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryData = async () => {
      setIsLoading(true);
      try {
        const catData = await api.get<Category>(`/categories/${currentSlug}`);
        setCategory(catData);

        const prodData = await api.get<{ items: ProductListItem[] }>(`/products?category=${currentSlug}&limit=50`);
        setProducts(prodData.items);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategoryData();
  }, [currentSlug]);

  return (
    <div className="py-6 space-y-10">
      {/* Category Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#161617] to-[#000000] text-white p-8 sm:p-14 border border-white/10 shadow-xl min-h-[360px] flex flex-col justify-center">
        <div className="max-w-2xl space-y-3 relative z-10">
          <span className="text-[10px] font-bold tracking-wider uppercase text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-400/20">
            {category?.name || 'MAPPLE Category'}
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            {category?.name}
          </h1>
          <p className="text-lg sm:text-xl text-neutral-300 font-light">
            {category?.tagline}
          </p>
          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-xl">
            {category?.description}
          </p>

          <div className="pt-2 flex items-center gap-4 text-xs text-neutral-400">
            <span className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-emerald-400" /> Complimentary Dispatch
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-400" /> 1-Year MAPPLE Warranty
            </span>
          </div>
        </div>

        {category?.hero_image && (
          <div className="hidden md:block absolute right-12 top-1/2 -translate-y-1/2 w-80 h-72 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <img
              src={category.hero_image}
              alt={category.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      {/* Product Grid */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1d1d1f]">
              All {category?.name} Models
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Select a model to configure colors, storage, and explore detailed technical specs.
            </p>
          </div>
          <Link
            to="/compare"
            className="text-xs font-semibold text-[#0071e3] hover:underline flex items-center gap-1"
          >
            Compare models <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-3xl p-6 border border-neutral-200/60 animate-pulse space-y-4">
                <div className="w-full aspect-square bg-neutral-100 rounded-2xl"></div>
                <div className="h-5 bg-neutral-200 rounded w-3/4"></div>
                <div className="h-4 bg-neutral-100 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
