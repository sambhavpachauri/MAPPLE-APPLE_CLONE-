import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { ProductListItem } from '../../types';
import { formatINR } from '../../lib/utils';
import { useWishlist } from '../../contexts/WishlistContext';
import { useCart } from '../../contexts/CartContext';

interface ProductCardProps {
  product: ProductListItem;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addItem } = useCart();
  const navigate = useNavigate();

  const isSaved = isInWishlist(product.id);

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultColor = product.colors.length > 0 ? product.colors[0].name : undefined;
    await addItem(product.id, 1, defaultColor);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      onClick={() => navigate(`/product/${product.slug}`)}
      className="group relative bg-white rounded-3xl p-6 border border-neutral-200/60 shadow-sm product-card-hover cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Top Badges & Wishlist */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5 flex-wrap">
            {product.badge && (
              <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-neutral-900 text-white">
                {product.badge}
              </span>
            )}
            {product.is_new && !product.badge && (
              <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-[#0071e3] text-white">
                New
              </span>
            )}
          </div>

          <button
            onClick={handleWishlistToggle}
            className={`p-2 rounded-full transition-all ${
              isSaved
                ? 'bg-rose-50 text-rose-500'
                : 'bg-neutral-100/80 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200'
            }`}
            title={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
            aria-label="Wishlist toggle"
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500' : ''}`} />
          </button>
        </div>

        {/* Product Image */}
        <div className="w-full aspect-square bg-[#fbfbfd] rounded-2xl mb-6 p-4 flex items-center justify-center overflow-hidden">
          {product.primary_image ? (
            <img
              src={product.primary_image}
              alt={product.name}
              className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-300">
              <ShoppingBag className="w-8 h-8" />
            </div>
          )}
        </div>

        {/* Color Swatches */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center justify-center gap-1.5 mb-3">
            {product.colors.slice(0, 5).map((c) => (
              <span
                key={c.id}
                title={c.name}
                className="w-3.5 h-3.5 rounded-full border border-black/15 shadow-inner"
                style={{ backgroundColor: c.hex_code }}
              />
            ))}
            {product.colors.length > 5 && (
              <span className="text-[10px] text-neutral-400 font-medium">+{product.colors.length - 5}</span>
            )}
          </div>
        )}

        {/* Product Details */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-[#1d1d1f] tracking-tight group-hover:text-[#0071e3] transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
            {product.short_description}
          </p>
        </div>
      </div>

      {/* Pricing & CTA */}
      <div className="mt-6 pt-4 border-t border-neutral-100 flex flex-col items-center">
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-xs text-neutral-500">From</span>
          <span className="text-base font-bold text-[#1d1d1f] tracking-tight">
            {formatINR(product.price_paise)}
          </span>
          {product.original_price_paise && (
            <span className="text-xs text-neutral-400 line-through">
              {formatINR(product.original_price_paise)}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 w-full">
          <Link
            to={`/product/${product.slug}`}
            onClick={(e) => e.stopPropagation()}
            className="py-2 px-3 rounded-full border border-neutral-300 text-neutral-800 text-xs font-semibold hover:bg-neutral-100 transition-colors text-center"
          >
            Explore
          </Link>

          <button
            onClick={handleQuickAdd}
            className="py-2 px-3 rounded-full bg-[#0071e3] text-white text-xs font-semibold hover:bg-[#0077ed] transition-colors flex items-center justify-center gap-1 shadow-sm"
          >
            Buy
          </button>
        </div>
      </div>
    </div>
  );
};
