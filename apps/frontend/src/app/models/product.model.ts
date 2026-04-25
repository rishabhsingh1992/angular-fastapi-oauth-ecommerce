export interface ProductRating {
  rate: number;
  count: number;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: ProductRating;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface OrderLine {
  productId: number;
  title: string;
  image: string;
  price: number;
  quantity: number;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  lines: OrderLine[];
  shipping: ShippingAddress;
  status: OrderStatus;
  total: number;
  createdAt: string;
}

export interface Brand {
  id: number;
  name: string;
  category: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatarUrl: string;
}
