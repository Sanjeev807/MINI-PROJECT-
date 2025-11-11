import {storage} from '../utils/storage';
import {authAPI} from './api';

export const authService = {
  async login(email, password) {
    try {
      const response = await authAPI.login({email, password});
      const {token, user} = response.data;

      // Save token and user data
      await storage.saveToken(token);
      await storage.saveUserData(user);

      return {success: true, user, token};
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  },

  async register(userData) {
    try {
      const response = await authAPI.register(userData);
      const {token, user} = response.data;

      // Save token and user data
      await storage.saveToken(token);
      await storage.saveUserData(user);

      return {success: true, user, token};
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
      };
    }
  },

  async logout() {
    try {
      await storage.removeToken();
      await storage.removeUserData();
      await storage.removeCartData();
      return {success: true};
    } catch (error) {
      return {success: false, message: 'Logout failed'};
    }
  },

  async getCurrentUser() {
    try {
      const token = await storage.getToken();
      if (!token) return null;

      const userData = await storage.getUserData();
      return userData;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  async isAuthenticated() {
    const token = await storage.getToken();
    return !!token;
  },
};
