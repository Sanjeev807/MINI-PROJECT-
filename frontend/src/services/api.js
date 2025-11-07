import axios from 'axios';
import { Platform } from 'react-native';

// Use 10.0.2.2 for Android emulator, localhost for iOS simulator
const API_BASE_URL = Platform.OS === 'android' 
  ? 'http://10.0.2.2:5000/api' 
  : 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  config => {
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    // API Error - fail silently in production
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (email, password, fcmToken = null) =>
    api.post('/auth/login', { email, password, fcmToken }),
  
  register: (name, email, password, phone, fcmToken = null) =>
    api.post('/auth/register', { name, email, password, phone, fcmToken }),
  
  getProfile: (token) =>
    api.get('/auth/profile', {
      headers: { Authorization: `Bearer ${token}` },
    }),
  
  updateProfile: (userData, token) =>
    api.put('/auth/profile', userData, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  
  updateFCMToken: (fcmToken, token) =>
    api.put('/auth/fcm-token', { fcmToken }, {
      headers: { Authorization: `Bearer ${token}` },
    }),
};

// Product APIs
export const productAPI = {
  getProducts: (params = {}) =>
    api.get('/products', { params }),
  
  getFeaturedProducts: () =>
    api.get('/products/featured'),
  
  getProductById: (id) =>
    api.get(`/products/${id}`),
  
  searchProducts: (query) =>
    api.get('/products', { params: { search: query } }),
};

// Cart APIs
export const cartAPI = {
  getCart: (token) =>
    api.get('/cart', {
      headers: { Authorization: `Bearer ${token}` },
    }),
  
  addToCart: (productId, quantity, token) =>
    api.post('/cart', { productId, quantity }, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  
  updateCartItem: (itemId, quantity, token) =>
    api.put(`/cart/${itemId}`, { quantity }, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  
  removeFromCart: (itemId, token) =>
    api.delete(`/cart/${itemId}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  
  clearCart: (token) =>
    api.delete('/cart', {
      headers: { Authorization: `Bearer ${token}` },
    }),
};

// Order APIs
export const orderAPI = {
  createOrder: (orderData, token) =>
    api.post('/orders', orderData, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  
  getMyOrders: (token) =>
    api.get('/orders', {
      headers: { Authorization: `Bearer ${token}` },
    }),
  
  getOrderById: (id, token) =>
    api.get(`/orders/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  
  cancelOrder: (id, token) =>
    api.put(`/orders/${id}/cancel`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    }),
};

// Notification APIs
export const notificationAPI = {
  getNotifications: (token) =>
    api.get('/notifications', {
      headers: { Authorization: `Bearer ${token}` },
    }),
  
  markAsRead: (id, token) =>
    api.put(`/notifications/${id}/read`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  
  markAllAsRead: (token) =>
    api.put('/notifications/read-all', {}, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  
  deleteNotification: (id, token) =>
    api.delete(`/notifications/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
};

export default api;
