import React, {createContext, useState, useContext, useEffect} from 'react';
import {authService} from '../services/authService';
import {setupFCMForUser, setupForegroundListener} from '../services/notificationService';
import {notificationEventBus} from '../services/notificationEventBus';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [fcmSetup, setFcmSetup] = useState(false);

  useEffect(() => {
    checkAuthentication();
  }, []);

  // Setup FCM when user is authenticated
  useEffect(() => {
    if (isAuthenticated && token && !fcmSetup) {
      setupNotifications();
    }
  }, [isAuthenticated, token, fcmSetup]);

  const setupNotifications = async () => {
    try {
      console.log('🔔 Setting up notifications for authenticated user...');
      
      const fcmResult = await setupFCMForUser(token);
      
      if (fcmResult.success) {
        console.log('✅ FCM setup completed for user');
        setFcmSetup(true);
        
        // Setup foreground message listener
        setupForegroundListener((payload) => {
          console.log('📬 Received notification:', payload.notification?.title);
          
          // Use the event bus to show top notification
          notificationEventBus.showFCMNotification(payload);
        });
        
      } else if (fcmResult.isNetworkError) {
        console.warn('⚠️ FCM setup postponed: Backend not available, will retry when connected');
        // Don't block user experience, will retry on next interaction
      } else {
        console.warn('⚠️ FCM setup failed:', fcmResult.error);
        // Don't block user experience, just log the issue
      }
    } catch (error) {
      console.error('❌ Error setting up notifications:', error);
    }
  };

  const checkAuthentication = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      const isAuth = await authService.isAuthenticated();
      
      setUser(currentUser);
      setIsAuthenticated(isAuth);
    } catch (error) {
      console.error('Error checking authentication:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const result = await authService.login(email, password);
      if (result.success) {
        setUser(result.user);
        setToken(result.token);
        setIsAuthenticated(true);
        setFcmSetup(false); // Reset FCM setup to trigger notification setup
        
        // Show welcome back notification locally (immediate)
        setTimeout(() => {
          notificationEventBus.showWelcome(
            `👋 Welcome back, ${result.user.name}!`,
            'Notifications are automatically enabled. You\'ll receive updates for orders, offers, and more!'
          );
        }, 1000);

        // Show additional info about backend notifications
        setTimeout(() => {
          notificationEventBus.showAccount(
            '🔐 Login Confirmed',
            'Backend notifications are active. You\'ll receive FCM push alerts automatically.'
          );
        }, 4000);
      }
      return result;
    } catch (error) {
      console.error('Login error:', error);
      return {success: false, message: 'Login failed'};
    }
  };

  const register = async userData => {
    try {
      const result = await authService.register(userData);
      if (result.success) {
        setUser(result.user);
        setToken(result.token);
        setIsAuthenticated(true);
        setFcmSetup(false); // Reset FCM setup to trigger notification setup
        
        // Show welcome notification for new users
        setTimeout(() => {
          notificationEventBus.showWelcome(
            `🎉 Welcome to E-Shop, ${result.user.name}!`,
            'Your account is ready! Notifications are enabled automatically for the best shopping experience.'
          );
        }, 3000);
      }
      return result;
    } catch (error) {
      console.error('Register error:', error);
      return {success: false, message: 'Registration failed'};
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      setFcmSetup(false);
      
      // Show local logout notification
      notificationEventBus.showSuccess(
        '👋 Logged out successfully',
        'Thank you for shopping with E-Shop! Come back soon.'
      );
      
      return {success: true};
    } catch (error) {
      console.error('Logout error:', error);
      return {success: false, message: 'Logout failed'};
    }
  };

  const updateUser = userData => {
    setUser(userData);
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    fcmSetup,
    login,
    register,
    logout,
    updateUser,
    setupNotifications, // Expose for manual trigger
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthContext };
