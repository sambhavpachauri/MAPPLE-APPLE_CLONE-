export interface User {
  id: number;
  email: string;
  full_name: string;
  phone?: string;
  role: 'customer' | 'admin';
  is_active: boolean;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  tagline?: string;
  description?: string;
  hero_image?: string;
  sort_order: number;
  product_count?: number;
}

export interface ProductColor {
  id: number;
  name: string;
  hex_code: string;
  image_url?: string;
}

export interface ProductImage {
  id: number;
  image_url: string;
  alt_text?: string;
  is_primary: boolean;
  sort_order: number;
}

export interface ProductConfig {
  id: number;
  config_type: string;
  label: string;
  value: string;
  price_delta_paise: number;
}

export interface ProductSpec {
  id: number;
  group_name: string;
  spec_name: string;
  spec_value: string;
  sort_order: number;
}

export interface ProductListItem {
  id: number;
  category_id?: number;
  category_slug?: string;
  category_name?: string;
  name: string;
  slug: string;
  short_description: string;
  price_paise: number;
  original_price_paise?: number;
  stock_quantity: number;
  is_featured: boolean;
  is_new: boolean;
  is_active: boolean;
  badge?: string;
  rating: number;
  review_count: number;
  primary_image?: string;
  colors: ProductColor[];
}

export interface ProductDetail extends ProductListItem {
  full_description: string;
  created_at: string;
  images: ProductImage[];
  configs: ProductConfig[];
  specs: ProductSpec[];
}

export interface CartItem {
  id: number;
  cart_id: number;
  product_id: number;
  product_name: string;
  product_slug: string;
  product_image?: string;
  quantity: number;
  selected_color?: string;
  selected_config?: string;
  unit_price_paise: number;
  total_price_paise: number;
  in_stock: boolean;
  stock_quantity: number;
}

export interface Cart {
  id: number;
  guest_token?: string;
  items: CartItem[];
  total_items: number;
  subtotal_paise: number;
  discount_paise: number;
  shipping_paise: number;
  tax_paise: number;
  total_paise: number;
  discount_code?: string;
}

export interface WishlistItem {
  id: number;
  product_id: number;
  product: ProductListItem;
  created_at: string;
}

export interface Wishlist {
  id: number;
  items: WishlistItem[];
  total_items: number;
}

export interface Address {
  id: number;
  user_id: number;
  full_name: string;
  street_line1: string;
  street_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
  is_default: boolean;
  created_at: string;
}

export interface OrderItem {
  id: number;
  product_id?: number;
  product_name_snapshot: string;
  product_slug_snapshot: string;
  product_image_snapshot?: string;
  selected_color?: string;
  selected_config?: string;
  unit_price_paise: number;
  quantity: number;
  total_price_paise: number;
}

export interface Order {
  id: string;
  user_id?: number;
  customer_email: string;
  customer_name: string;
  customer_phone: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_method: string;
  payment_id?: string;
  subtotal_paise: number;
  discount_paise: number;
  shipping_paise: number;
  tax_paise: number;
  total_paise: number;
  delivery_method: string;
  shipping_address_json: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

export interface SupportTicket {
  id: number;
  user_id?: number;
  order_id?: string;
  name: string;
  email: string;
  category: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved';
  created_at: string;
}

export interface AdminStats {
  total_sales_paise: number;
  total_orders: number;
  total_customers: number;
  total_products: number;
  low_stock_count: number;
  recent_orders: Order[];
}
