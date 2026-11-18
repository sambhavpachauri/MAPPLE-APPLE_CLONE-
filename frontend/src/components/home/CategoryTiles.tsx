import React from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, Laptop, Tablet, Watch, Headphones, Cable, ArrowRight } from 'lucide-react';

const CATEGORIES = [
  {
    name: 'Smartphones',
    slug: 'iphone',
    tagline: 'Titanium precision',
    icon: Smartphone,
    color: 'from-blue-500/10 to-indigo-500/10',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Mac',
    slug: 'mac',
    tagline: 'M-Compute silicon',
    icon: Laptop,
    color: 'from-neutral-500/10 to-zinc-500/10',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Tablets',
    slug: 'ipad',
    tagline: 'Tandem OLED canvas',
    icon: Tablet,
    color: 'from-purple-500/10 to-violet-500/10',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Watch',
    slug: 'watch',
    tagline: 'Precision health metrics',
    icon: Watch,
    color: 'from-orange-500/10 to-amber-500/10',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Audio',
    slug: 'audio',
    tagline: 'Spatial acoustic sound',
    icon: Headphones,
    color: 'from-emerald-500/10 to-teal-500/10',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    tagline: 'Magnetic wireless power',
    icon: Cable,
    color: 'from-sky-500/10 to-cyan-500/10',
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=600&q=80',
  },
];

export const CategoryTiles: React.FC = () => {
  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1d1d1f]">
            Browse by Category
          </h2>
          <p className="text-sm text-neutral-500 mt-1">
            Engineered from ground up with unified architectural cohesion.
          </p>
        </div>
        <Link
          to="/store"
          className="text-xs font-semibold text-[#0071e3] hover:underline flex items-center gap-1"
        >
          All categories <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {CATEGORIES.map((cat) => {
          const IconComponent = cat.icon;
          return (
            <Link
              key={cat.slug}
              to={`/store/${cat.slug}`}
              className="group bg-white rounded-2xl p-5 border border-neutral-200/60 shadow-sm hover:shadow-md product-card-hover flex flex-col items-center text-center justify-between"
            >
              <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-800 mb-3 group-hover:scale-110 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                <IconComponent className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-neutral-400 mt-0.5">{cat.tagline}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
