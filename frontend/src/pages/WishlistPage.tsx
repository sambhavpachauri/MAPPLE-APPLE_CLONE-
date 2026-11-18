import React from 'react';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { formatINR } from '../lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addItem } = useCart();
  const navigate = useNavigate();

  const items = wishlist?.items || [];

  const handleMoveToBag = async (productId: number) => {
    await addItem(productId, 1);
    await removeFromWishlist(productId);
  };

  return (
    <div className="py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-neutral-200/60 shadow-sm text-center max-w-3xl mx-auto space-y-2">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center mb-2">
          <Heart className="w-6 h-6 fill-rose-500" />
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#1d1d1f]">
          Your Saved Wishlist
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 font-light">
          Products you're considering. Move them to your bag or configure variations anytime.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-neutral-200/60 max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900">Your wishlist is empty</h3>
          <p className="text-xs text-neutral-500 max-w-xs mx-auto">
            Explore MAPPLE devices and tap the heart icon on any card to save it for later.
          </p>
          <Link
            to="/store"
            className="inline-block mt-4 px-6 py-2.5 rounded-full bg-[#0071e3] text-white text-xs font-semibold hover:bg-[#0077ed] transition-colors"
          >
            Discover Devices
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => {
            const product = item.product;
            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-6 border border-neutral-200/60 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="w-full aspect-square bg-[#fbfbfd] rounded-2xl p-4 flex items-center justify-center mb-4">
                    {product.primary_image ? (
                      <img
                        src={product.primary_image}
                        alt={product.name}
                        className="w-full h-full object-contain mix-blend-multiply"
                      />
                    ) : (
                      <ShoppingBag className="w-8 h-8 text-neutral-300" />
                    )}
                  </div>

                  <h3 className="text-base font-semibold text-neutral-900">{product.name}</h3>
                  <p className="text-xs text-neutral-500 mt-1 line-clamp-2">{product.short_description}</p>
                  <p className="text-sm font-bold text-neutral-900 mt-2">{formatINR(product.price_paise)}</p>
                </div>

                <div className="pt-6 border-t border-neutral-100 space-y-2 mt-4">
                  <button
                    onClick={() => handleMoveToBag(product.id)}
                    className="w-full py-2.5 px-4 rounded-full bg-[#0071e3] text-white text-xs font-semibold hover:bg-[#0077ed] transition-colors flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag className="w-4 h-4" /> Move to Bag
                  </button>

                  <div className="flex items-center justify-between pt-1">
                    <Link
                      to={`/product/${product.slug}`}
                      className="text-xs text-[#0071e3] hover:underline font-medium"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="text-xs text-neutral-400 hover:text-rose-500 flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
