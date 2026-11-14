export interface User {
  id: number;
  email: string;
  full_name: string | null;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export interface CartItemResponse {
  product_id: number;
  title: string;
  image: string;
  price: number;
  quantity: number;
}

export interface CartResponse {
  user_id: string;
  items: CartItemResponse[];
  total: number;
}

export interface AddCartItemRequest {
  product_id: number;
  quantity?: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface ShippingAddress {
  full_name: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
}

export interface OrderLineResponse {
  product_id: number;
  title: string;
  image: string;
  price: number;
  quantity: number;
}

export interface OrderResponse {
  id: string;
  user_id: string;
  lines: OrderLineResponse[];
  shipping: ShippingAddress;
  status: string;
  total: number;
  created_at: string;
}

export interface CreateOrderRequest {
  shipping: ShippingAddress;
}

export interface ApiError {
  status: number;
  code: string;
  message: string;
  details?: unknown;
}

// Type aliases for backward compatibility
export type Cart = CartResponse;
export type Order = OrderResponse;

