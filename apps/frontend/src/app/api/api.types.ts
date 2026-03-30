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

export interface OrderItem {
  product_id: number;
  quantity: number;
  unit_price_cents: number;
}

export interface Order {
  id: number;
  user_id: number;
  items: OrderItem[];
  status: string;
  total_cents: number;
}

export interface ApiError {
  status: number;
  code: string;
  message: string;
  details?: unknown;
}
