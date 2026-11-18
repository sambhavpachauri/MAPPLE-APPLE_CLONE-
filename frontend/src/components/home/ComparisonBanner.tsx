import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, SlidersHorizontal, Check } from 'lucide-react';

export const ComparisonBanner: React.FC = () => {
  return (
    <section className="my-12 rounded-3xl bg-gradient-to-br from-[#161617] to-[#000000] text-white p-8 sm:p-12 border border-white/10 shadow-2xl overflow-hidden relative">
      <div className="max-w-2xl space-y-4 relative z-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold uppercase tracking-wider text-neutral-300">
          <SlidersHorizontal className="w-3.5 h-3.5 text-blue-400" /> Interactive Spec Engine
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
          Which MAPPLE device is right for you?
        </h2>
        <p className="text-sm sm:text-base text-neutral-400 leading-relaxed font-light">
          Compare models side-by-side. Inspect processors, displays, battery longevity, camera arrays, and dimensional metrics to find your ideal fit.
        </p>

        <div className="pt-2 flex flex-wrap gap-4">
          <Link
            to="/compare"
            className="px-7 py-3 rounded-full bg-white text-black text-xs sm:text-sm font-semibold hover:bg-neutral-200 transition-all hover:scale-105 shadow-md flex items-center gap-1.5"
          >
            Launch Comparison Matrix <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/store"
            className="px-6 py-3 rounded-full border border-neutral-700 text-white text-xs sm:text-sm font-medium hover:border-neutral-500 transition-all"
          >
            Browse All Products
          </Link>
        </div>
      </div>

      <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 w-80 opacity-60 pointer-events-none">
        <div className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-3 backdrop-blur-md">
          <div className="h-4 bg-white/20 rounded w-3/4"></div>
          <div className="h-3 bg-white/10 rounded w-1/2"></div>
          <div className="grid grid-cols-2 gap-2 pt-2">
            <div className="h-16 bg-white/10 rounded-xl"></div>
            <div className="h-16 bg-white/10 rounded-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
