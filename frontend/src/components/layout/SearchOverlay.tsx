import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Clock, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { ProductListItem } from '../../types';
import { formatINR } from '../../lib/utils';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const QUICK_LINKS = [
  { label: 'MAPPLE Phone Pro', query: 'Phone Pro' },
  { label: 'MAPPLE MacBook Pro', query: 'MacBook Pro' },
  { label: 'MAPPLE iPad Pro', query: 'iPad Pro' },
  { label: 'MAPPLE Watch Ultra', query: 'Watch Ultra' },
  { label: 'MAPPLE Pods Pro', query: 'Pods Pro' },
];

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ProductListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('mapple_recent_searches') || '[]');
    } catch {
      return [];
    }
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setResults([]);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const data = await api.get<{ items: ProductListItem[] }>(`/products?search=${encodeURIComponent(query)}&limit=6`);
        setResults(data.items);
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSearchSubmit = (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    const updated = [searchTerm, ...recentSearches.filter((s) => s !== searchTerm)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('mapple_recent_searches', JSON.stringify(updated));
    onClose();
    navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
  };

  const handleSelectProduct = (slug: string) => {
    onClose();
    navigate(`/product/${slug}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#000000]/60 backdrop-blur-2xl transition-all animate-in fade-in duration-200">
      <div className="max-w-4xl w-full mx-auto px-6 pt-12 pb-8">
        {/* Search Input Bar */}
        <div className="relative flex items-center border-b border-neutral-700/60 pb-3">
          <Search className="w-6 h-6 text-neutral-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit(query)}
            placeholder="Search MAPPLE devices, accessories, and specs..."
            className="w-full bg-transparent text-xl md:text-2xl text-white placeholder-neutral-500 font-normal focus:outline-none tracking-tight"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 mr-2 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-sm font-medium text-neutral-400 hover:text-white px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-all"
          >
            Cancel
          </button>
        </div>

        {/* Search content area */}
        <div className="mt-8 overflow-y-auto max-h-[70vh] pr-2">
          {isLoading && (
            <div className="py-12 text-center text-neutral-400 text-sm">Searching MAPPLE catalogue...</div>
          )}

          {!isLoading && query && results.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">Products</span>
                <button
                  onClick={() => handleSearchSubmit(query)}
                  className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
                >
                  View all results <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {results.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleSelectProduct(product.slug)}
                    className="flex items-center gap-4 p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 cursor-pointer transition-all group"
                  >
                    <div className="w-16 h-16 rounded-xl bg-neutral-900/80 overflow-hidden flex items-center justify-center p-1 shrink-0">
                      {product.primary_image ? (
                        <img
                          src={product.primary_image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <Sparkles className="w-6 h-6 text-neutral-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white truncate group-hover:text-blue-400 transition-colors">
                          {product.name}
                        </span>
                        {product.badge && (
                          <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300">
                            {product.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-400 truncate mt-0.5">{product.short_description}</p>
                      <p className="text-xs font-medium text-neutral-200 mt-1">{formatINR(product.price_paise)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!isLoading && query && results.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-lg text-white font-medium">No results found for "{query}"</p>
              <p className="text-sm text-neutral-400 mt-1">Check spelling or explore our popular collections.</p>
              <div className="flex flex-wrap justify-center gap-2 mt-6">
                {QUICK_LINKS.map((link) => (
                  <button
                    key={link.label}
                    onClick={() => {
                      setQuery(link.query);
                      handleSearchSubmit(link.query);
                    }}
                    className="px-4 py-2 rounded-full text-xs font-medium bg-white/10 hover:bg-white/20 text-neutral-200 transition-colors"
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!query && (
            <div className="space-y-8">
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs uppercase tracking-wider text-neutral-400 font-semibold flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> Recent Searches
                    </span>
                    <button
                      onClick={() => {
                        setRecentSearches([]);
                        localStorage.removeItem('mapple_recent_searches');
                      }}
                      className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => {
                          setQuery(term);
                          handleSearchSubmit(term);
                        }}
                        className="px-3.5 py-1.5 rounded-full text-xs bg-white/[0.06] hover:bg-white/[0.12] text-neutral-300 transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <span className="text-xs uppercase tracking-wider text-neutral-400 font-semibold block mb-3">
                  Quick Links
                </span>
                <div className="flex flex-wrap gap-2">
                  {QUICK_LINKS.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => {
                        setQuery(item.query);
                        handleSearchSubmit(item.query);
                      }}
                      className="px-4 py-2 rounded-full text-xs font-medium bg-white/[0.06] hover:bg-white/[0.12] text-neutral-200 border border-white/5 transition-all"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
