import { Brand, Order, Product } from '../models/product.model';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    title: "Fjallraven - Foldsack No. 1 Backpack",
    price: 109.95,
    description: "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday essentials in the main compartment.",
    category: "men's clothing",
    image: "https://fakestoreapi.com/img/81fAn1hwOAL._AC_UY879_.jpg",
    rating: { rate: 3.9, count: 120 }
  },
  {
    id: 2,
    title: "Mens Casual Premium Slim Fit T-Shirts",
    price: 22.3,
    description: "Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathability and a clean, refined look.",
    category: "men's clothing",
    image: "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg",
    rating: { rate: 4.1, count: 259 }
  },
  {
    id: 3,
    title: "Mens Cotton Jacket",
    price: 55.99,
    description: "Great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking, camping, mountain/rock climbing, cycling, traveling or other outdoors.",
    category: "men's clothing",
    image: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg",
    rating: { rate: 4.7, count: 500 }
  },
  {
    id: 4,
    title: "Women's 3-in-1 Snowboard Jacket",
    price: 56.99,
    description: "Note: The jacket is WR not waterproof. Mid-season jacket – perfect layering piece for transitional weathers.",
    category: "women's clothing",
    image: "https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg",
    rating: { rate: 2.6, count: 235 }
  },
  {
    id: 5,
    title: "John Hardy Women's Legends Naga Gold & Silver Dragon Bracelet",
    price: 695.0,
    description: "From our Legends Collection, the Naga Dragon Bracelet is inspired by the mythical water dragon that protects the ocean's pearl.",
    category: "jewelery",
    image: "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_FMwebp_QL65_.jpg",
    rating: { rate: 4.6, count: 400 }
  },
  {
    id: 6,
    title: "Solid Gold Petite Micropave",
    price: 168.0,
    description: "Satisfaction guaranteed. Return or exchange any order within 30 days. Designed and sold by Hafeez Center in the United States.",
    category: "jewelery",
    image: "https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_FMwebp_QL65_.jpg",
    rating: { rate: 3.9, count: 70 }
  },
  {
    id: 7,
    title: "Silicon Power 256GB SSD",
    price: 109.0,
    description: "3D NAND flash are applied to deliver high transfer speeds. Provides 256GB of unique storage space. Sequential read and write speeds of up to 450MB/s and 425MB/s.",
    category: "electronics",
    image: "https://fakestoreapi.com/img/71kEqp3aZaL._AC_SX679_.jpg",
    rating: { rate: 4.8, count: 319 }
  },
  {
    id: 8,
    title: "WD 4TB Black My Passport Portable External Hard Drive",
    price: 64.0,
    description: "USB 3.0 and USB 2.0 Compatibility. Fast data transfers. Integrate easily with Mac and Windows PC. One year limited warranty.",
    category: "electronics",
    image: "https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg",
    rating: { rate: 3.3, count: 203 }
  },
  {
    id: 9,
    title: "Acer SB220Q bi 21.5 inches Full HD (1920 x 1080) IPS Ultra-Thin Monitor",
    price: 599.0,
    description: "21.5 inches Full HD (1920 x 1080) widescreen IPS display. And Infinity-style ultra-thin bezel with 3-sided micro-border.",
    category: "electronics",
    image: "https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_.jpg",
    rating: { rate: 2.9, count: 250 }
  },
  {
    id: 10,
    title: "MBJ Women's Solid Short Sleeve Boat Neck V Notch",
    price: 9.85,
    description: "95% RAYON 5% SPANDEX, Made in USA or Imported, Do Not Bleach, Lightweight fabric.",
    category: "women's clothing",
    image: "https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_.jpg",
    rating: { rate: 4.7, count: 130 }
  }
];

export const MOCK_BRANDS: Brand[] = [
  { id: 1, name: 'Nike', category: "men's clothing" },
  { id: 2, name: 'Adidas', category: "men's clothing" },
  { id: 3, name: 'Apple', category: 'electronics' },
  { id: 4, name: 'Samsung', category: 'electronics' },
  { id: 5, name: 'Sony', category: 'electronics' },
  { id: 6, name: 'Zara', category: "women's clothing" },
  { id: 7, name: 'H&M', category: "women's clothing" },
  { id: 8, name: 'Gucci', category: 'jewelery' },
  { id: 9, name: 'Puma', category: "men's clothing" },
  { id: 10, name: "Levi's", category: "men's clothing" },
  { id: 11, name: 'LG', category: 'electronics' },
  { id: 12, name: 'Under Armour', category: "men's clothing" },
];

export const MOCK_CATEGORIES: string[] = [
  "men's clothing",
  "women's clothing",
  "jewelery",
  "electronics"
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-001',
    lines: [
      { productId: 1, title: "Fjallraven Backpack", image: "https://fakestoreapi.com/img/81fAn1hwOAL._AC_UY879_.jpg", price: 109.95, quantity: 1 },
      { productId: 2, title: "Mens Casual T-Shirts", image: "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg", price: 22.3, quantity: 2 }
    ],
    shipping: { fullName: 'Demo User', address: '123 Main St', city: 'New York', postalCode: '10001', country: 'US' },
    status: 'delivered',
    total: 154.55,
    createdAt: '2026-03-15T10:30:00Z'
  },
  {
    id: 'ORD-002',
    lines: [
      { productId: 7, title: "Silicon Power 256GB SSD", image: "https://fakestoreapi.com/img/71kEqp3aZaL._AC_SX679_.jpg", price: 109.0, quantity: 1 }
    ],
    shipping: { fullName: 'Demo User', address: '123 Main St', city: 'New York', postalCode: '10001', country: 'US' },
    status: 'shipped',
    total: 109.0,
    createdAt: '2026-04-01T14:00:00Z'
  }
];
