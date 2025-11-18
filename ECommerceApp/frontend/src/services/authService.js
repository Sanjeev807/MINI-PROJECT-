import {storage} from '../utils/storage';
import {authAPI} from './api';
import {requestNotificationPermission} from './notificationService';

export const authService = {
  async login(email, password) {
    try {
      // Get FCM token before logging in
      let fcmToken = null;
      try {
        const fcmResult = await requestNotificationPermission();
        if (fcmResult.success && fcmResult.token) {
          fcmToken = fcmResult.token;
        }
      } catch (fcmError) {
        console.log('FCM token not available, logging in without it');
      }

      const response = await authAPI.login({email, password, fcmToken});
      const data = response.data;
      
      // Backend returns: { _id, name, email, phone, role, token }
      const token = data.token;
      const user = {
        _id: data._id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role
      };

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
      // Get FCM token before registering
      let fcmToken = null;
      try {
        const fcmResult = await requestNotificationPermission();
        if (fcmResult.success && fcmResult.token) {
          fcmToken = fcmResult.token;
        }
      } catch (fcmError) {
        console.log('FCM token not available, registering without it');
      }

      const response = await authAPI.register({...userData, fcmToken});
      const data = response.data;
      
      // Backend returns: { _id, name, email, phone, role, token }
      const token = data.token;
      const user = {
        _id: data._id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role
      };

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
      // Call backend logout endpoint to send notifications
      const token = await storage.getToken();
      if (token) {
        try {
          await authAPI.logout();
          console.log('✅ Backend logout called - notifications sent');
        } catch (backendError) {
          console.warn('Backend logout failed, proceeding with local logout:', backendError.message);
        }
      }
      
      // Clear local storage
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
