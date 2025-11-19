import React, {createContext, useState, useContext, useEffect} from 'react';
import {authService} from '../services/authService';
import {setupFCMForUser, setupForegroundListener, clearAllNotifications} from '../services/notificationService';
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
      console.log('   Token available:', !!token);
      console.log('   User:', user?.name || 'Unknown');
      
      // Clear any existing cached notifications first
      await clearAllNotifications();
      
      const fcmResult = await setupFCMForUser(token);
      console.log('📊 FCM setup result:', fcmResult);
      
      if (fcmResult.success) {
        console.log('✅ FCM setup completed for user');
        setFcmSetup(true);
        
        // Setup foreground message listener WITHOUT event bus (browser notifications only)
        console.log('🎧 Setting up foreground listener...');
        setupForegroundListener();
        console.log('✅ Foreground listener setup complete');
        
        // Clear any residual notifications after setup
        setTimeout(() => {
          clearAllNotifications();
        }, 1000);
        
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
        
        // Store user info for better notifications
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        
        // Backend will send all notifications via FCM
        console.log('✅ Login successful. Backend will send FCM notifications.');
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
      
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Backend sends all logout notifications via FCM
      console.log('✅ Logout successful. Backend sent FCM notifications.');
      
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
