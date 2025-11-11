export const COLORS = {
  primary: '#2874f0',
  secondary: '#fb641b',
  white: '#ffffff',
  black: '#000000',
  gray: '#878787',
  lightGray: '#f1f3f6',
  darkGray: '#212121',
  success: '#388e3c',
  error: '#d32f2f',
  warning: '#f57c00',
  rating: '#ff9f00',
  border: '#e0e0e0',
};

export const SIZES = {
  base: 8,
  font: 14,
  radius: 4,
  padding: 16,
  margin: 16,

  // Font sizes
  h1: 32,
  h2: 24,
  h3: 20,
  h4: 16,
  body1: 16,
  body2: 14,
  body3: 12,
};

export const CATEGORIES = [
  'Electronics',
  'Fashion',
  'Home & Furniture',
  'Books',
  'Sports',
  'Toys',
  'Grocery',
  'Beauty',
];

export const API_ENDPOINTS = {
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  PRODUCTS: '/api/products',
  PRODUCT_DETAILS: '/api/products',
  CART: '/api/cart',
  ADD_TO_CART: '/api/cart/add',
  UPDATE_CART: '/api/cart/update',
  REMOVE_FROM_CART: '/api/cart/remove',
  ORDERS: '/api/orders',
  CREATE_ORDER: '/api/orders/create',
  NOTIFICATIONS: '/api/notifications/send',
};
