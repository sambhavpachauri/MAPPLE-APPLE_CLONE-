import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Cart } from '../types';
import { api, ApiError } from '../services/api';
import { useToast } from './ToastContext';

interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  isCartOpen: boolean;
  totalItems: number;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (productId: number, quantity?: number, selectedColor?: string, selectedConfig?: string) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  applyDiscount: (code: string) => Promise<void>;
  removeDiscount: () => Promise<void>;
  setDeliveryMethod: (method: 'standard' | 'express') => Promise<void>;
  deliveryMethod: 'standard' | 'express';
  discountCode: string;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [deliveryMethod, setDeliveryMethodState] = useState<'standard' | 'express'>('standard');
  const [discountCode, setDiscountCodeState] = useState<string>('');
  const { success, error } = useToast();

  const fetchCart = useCallback(async () => {
    try {
      const queryParams = new URLSearchParams();
      if (discountCode) queryParams.append('discount_code', discountCode);
      if (deliveryMethod) queryParams.append('delivery_method', deliveryMethod);

      const qs = queryParams.toString() ? `?${queryParams.toString()}` : '';
      const data = await api.get<Cart>(`/cart${qs}`);
      setCart(data);
    } catch {
      // Cart init fallback
    } finally {
      setIsLoading(false);
    }
  }, [discountCode, deliveryMethod]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addItem = async (
    productId: number,
    quantity: number = 1,
    selectedColor?: string,
    selectedConfig?: string
  ) => {
    try {
      const updatedCart = await api.post<Cart>('/cart/items', {
        product_id: productId,
        quantity,
        selected_color: selectedColor,
        selected_config: selectedConfig,
      });
      setCart(updatedCart);
      setIsCartOpen(true);
      success('Added to Bag', 'Product added to your shopping bag.');
    } catch (err: any) {
      const msg = err instanceof ApiError ? err.message : 'Could not add product to bag';
      error('Bag Error', msg);
      throw err;
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    try {
      const updatedCart = await api.patch<Cart>(`/cart/items/${itemId}`, { quantity });
      setCart(updatedCart);
    } catch (err: any) {
      const msg = err instanceof ApiError ? err.message : 'Failed to update quantity';
      error('Bag Error', msg);
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      const updatedCart = await api.delete<Cart>(`/cart/items/${itemId}`);
      setCart(updatedCart);
      success('Item removed', 'Item removed from your shopping bag.');
    } catch (err: any) {
      const msg = err instanceof ApiError ? err.message : 'Failed to remove item';
      error('Bag Error', msg);
    }
  };

  const applyDiscount = async (code: string) => {
    try {
      const testCode = code.trim().toUpperCase();
      const queryParams = new URLSearchParams({
        discount_code: testCode,
        delivery_method: deliveryMethod,
      });
      const updatedCart = await api.get<Cart>(`/cart?${queryParams.toString()}`);
      if (updatedCart.discount_code) {
        setDiscountCodeState(testCode);
        setCart(updatedCart);
        success('Discount Applied', `Promo code ${testCode} has been applied.`);
      } else {
        error('Invalid Code', 'Promo code is invalid or does not meet minimum order requirements.');
      }
    } catch (err: any) {
      error('Discount Error', 'Failed to apply discount code.');
    }
  };

  const removeDiscount = async () => {
    setDiscountCodeState('');
    const queryParams = new URLSearchParams({ delivery_method: deliveryMethod });
    const updatedCart = await api.get<Cart>(`/cart?${queryParams.toString()}`);
    setCart(updatedCart);
    success('Discount Removed', 'Promo code removed.');
  };

  const setDeliveryMethod = async (method: 'standard' | 'express') => {
    setDeliveryMethodState(method);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        isCartOpen,
        totalItems: cart?.total_items || 0,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        toggleCart: () => setIsCartOpen((prev) => !prev),
        addItem,
        updateQuantity,
        removeItem,
        applyDiscount,
        removeDiscount,
        setDeliveryMethod,
        deliveryMethod,
        discountCode,
        refreshCart: fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
