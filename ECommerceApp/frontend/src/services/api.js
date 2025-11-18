import axios from 'axios';
import {storage} from '../utils/storage';
import { Capacitor } from '@capacitor/core';

// Detect if running on Android and use appropriate URL
const getAPIUrl = () => {
  if (Capacitor.getPlatform() === 'android') {
    // Android emulator uses 10.0.2.2 to access host machine's localhost
    // For real device, use your computer's local IP (e.g., 192.168.1.100)
    return process.env.REACT_APP_API_URL || 'http://10.0.2.2:5000';
  }
  return process.env.REACT_APP_API_URL || 'http://localhost:5000';
};

const API_URL = getAPIUrl();

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async config => {
    const token = await storage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.data);
      
      // Handle 401 Unauthorized - token expired
      if (error.response.status === 401) {
        storage.removeToken();
        storage.removeUserData();
      }
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.request);
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  },
);

// Auth APIs
export const authAPI = {
  login: credentials => api.post('/api/auth/login', credentials),
  register: userData => api.post('/api/auth/register', userData),
  logout: () => api.post('/api/auth/logout'),
  getProfile: () => api.get('/api/auth/profile'),
};

// Products APIs
export const productsAPI = {
  getAllProducts: () => api.get('/api/products'),
  getProductById: id => api.get(`/api/products/${id}`),
  searchProducts: query => api.get(`/api/products/search?q=${query}`),
  getProductsByCategory: category =>
    api.get(`/api/products/category/${category}`),
};

// Cart APIs
export const cartAPI = {
  getCart: () => api.get('/api/cart'),
  addToCart: data => api.post('/api/cart/add', data),
  updateCartItem: (itemId, quantity) =>
    api.put(`/api/cart/update/${itemId}`, {quantity}),
  removeFromCart: itemId => api.delete(`/api/cart/remove/${itemId}`),
  clearCart: () => api.delete('/api/cart/clear'),
};

// Orders APIs
export const ordersAPI = {
  createOrder: orderData => api.post('/api/orders/create', orderData),
  getOrders: () => api.get('/api/orders'),
  getOrderById: id => api.get(`/api/orders/${id}`),
};

// Notifications APIs
export const notificationsAPI = {
  sendNotification: data => api.post('/api/notifications/send', data),
  getNotifications: () => api.get('/api/notifications'),
};

export default api;
