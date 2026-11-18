import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Wishlist } from '../types';
import { api } from '../services/api';
import { useToast } from './ToastContext';

interface WishlistContextType {
  wishlist: Wishlist | null;
  totalItems: number;
  isInWishlist: (productId: number) => boolean;
  toggleWishlist: (productId: number) => Promise<void>;
  removeFromWishlist: (productId: number) => Promise<void>;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const { success, info } = useToast();

  const fetchWishlist = useCallback(async () => {
    try {
      const data = await api.get<Wishlist>('/wishlist');
      setWishlist(data);
    } catch {
      // Wishlist fallback
    }
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const isInWishlist = (productId: number): boolean => {
    if (!wishlist || !wishlist.items) return false;
    return wishlist.items.some((item) => item.product_id === productId);
  };

  const toggleWishlist = async (productId: number) => {
    try {
      if (isInWishlist(productId)) {
        const updated = await api.delete<Wishlist>(`/wishlist/items/${productId}`);
        setWishlist(updated);
        info('Removed from Saved', 'Product removed from your saved list.');
      } else {
        const updated = await api.post<Wishlist>('/wishlist/items', { product_id: productId });
        setWishlist(updated);
        success('Saved to Wishlist', 'Product added to your saved list.');
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  const removeFromWishlist = async (productId: number) => {
    try {
      const updated = await api.delete<Wishlist>(`/wishlist/items/${productId}`);
      setWishlist(updated);
      info('Item Removed', 'Product removed from saved items.');
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        totalItems: wishlist?.total_items || 0,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        refreshWishlist: fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
