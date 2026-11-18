import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="py-24 max-w-lg mx-auto px-4 text-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mx-auto">
        <Compass className="w-8 h-8" />
      </div>

      <span className="text-xs font-bold tracking-wider uppercase text-neutral-400">
        404 Error
      </span>

      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1d1d1f]">
        The page you’re looking for can’t be found.
      </h1>

      <p className="text-sm text-neutral-500 max-w-md mx-auto font-light leading-relaxed">
        The destination address may have been decommissioned or the URL was entered with a typographical discrepancy.
      </p>

      <div className="pt-4 flex flex-wrap justify-center gap-3">
        <Link
          to="/"
          className="px-6 py-3 rounded-full bg-[#0071e3] text-white text-xs font-semibold hover:bg-[#0077ed] transition-colors"
        >
          Return to MAPPLE Home
        </Link>
        <Link
          to="/store"
          className="px-6 py-3 rounded-full border border-neutral-300 text-neutral-800 text-xs font-semibold hover:bg-neutral-50 transition-colors"
        >
          Explore Store
        </Link>
      </div>
    </div>
  );
};
