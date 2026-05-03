export interface User {
  id: number;
  email: string;
  full_name: string | null;
}

export interface Product {
  id: number;
  name: string;
  price_cents: number;
  currency: string;
}

export interface CartItem {
  product_id: number;
  quantity: number;
}

export interface Cart {
  id: number;
  user_id: number;
  items: CartItem[];
}

export interface ShippingAddress {
  full_name: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
}

export interface OrderItem {
  product_id: number;
  title: string;
  image: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  user_id: string;
  lines: OrderItem[];
  shipping: ShippingAddress;
  status: string;
  total: number;
  created_at: string;
}

export interface ApiError {
  status: number;
  code: string;
  message: string;
  details?: unknown;
}
