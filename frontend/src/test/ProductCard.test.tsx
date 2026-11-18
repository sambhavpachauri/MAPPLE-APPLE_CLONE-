import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ProductCard } from '../components/product/ProductCard';
import { WishlistProvider } from '../contexts/WishlistContext';
import { ToastProvider } from '../contexts/ToastContext';
import { CartProvider } from '../contexts/CartContext';
import { AuthProvider } from '../contexts/AuthContext';
import type { ProductListItem } from '../types';

const mockProduct: ProductListItem = {
  id: 1,
  name: 'Mapple Phone 16 Pro',
  short_description: 'Titanium. Precision engineered flagship smartphone.',
  slug: 'phone-16-pro',
  badge: 'New Flagship',
  price_paise: 13490000, // ₹1,34,900
  original_price_paise: 14490000,
  stock_quantity: 45,
  is_featured: true,
  is_new: true,
  is_active: true,
  rating: 4.9,
  review_count: 342,
  primary_image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80',
  category_name: 'Smartphones',
  category_slug: 'smartphones',
  colors: [
    { id: 1, name: 'Natural Titanium', hex_code: '#BEB8AD' },
    { id: 2, name: 'Black Titanium', hex_code: '#2B2B2B' },
  ],
};

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <MemoryRouter>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              {ui}
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </MemoryRouter>
  );
}

describe('ProductCard Component', () => {
  it('renders product name, short description, badge, and formatted INR price', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);

    expect(screen.getByText('Mapple Phone 16 Pro')).toBeInTheDocument();
    expect(screen.getByText('Titanium. Precision engineered flagship smartphone.')).toBeInTheDocument();
    expect(screen.getByText('New Flagship')).toBeInTheDocument();
    expect(screen.getByText('₹1,34,900')).toBeInTheDocument();
  });

  it('renders color swatches', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });
});
