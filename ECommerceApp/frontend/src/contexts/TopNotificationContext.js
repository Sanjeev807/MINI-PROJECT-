import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import TopNotificationToast from '../components/TopNotificationToast';
import { notificationEventBus } from '../services/notificationEventBus';

const TopNotificationContext = createContext();

export const useTopNotification = () => {
  const context = useContext(TopNotificationContext);
  if (!context) {
    throw new Error('useTopNotification must be used within TopNotificationProvider');
  }
  return context;
};

export const TopNotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Subscribe to global notification events
  useEffect(() => {
    const unsubscribe = notificationEventBus.subscribe((notification) => {
      const newNotification = {
        id: Date.now() + Math.random(),
        ...notification
      };

      setNotifications(prev => [...prev, newNotification]);

      // Auto remove after 6 seconds
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, 6000);
    });

    return unsubscribe;
  }, []);

  const showNotification = useCallback((title, body, type = 'info', options = {}) => {
    notificationEventBus.emit(type, title, body, options);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Helper methods for different types
  const showSuccess = useCallback((title, body, options = {}) => {
    return showNotification(title, body, 'success', options);
  }, [showNotification]);

  const showError = useCallback((title, body, options = {}) => {
    return showNotification(title, body, 'error', options);
  }, [showNotification]);

  const showWarning = useCallback((title, body, options = {}) => {
    return showNotification(title, body, 'warning', options);
  }, [showNotification]);

  const showWelcome = useCallback((title, body, options = {}) => {
    return showNotification(title, body, 'welcome', options);
  }, [showNotification]);

  const showOrder = useCallback((title, body, options = {}) => {
    return showNotification(title, body, 'order', options);
  }, [showNotification]);

  const showPromotion = useCallback((title, body, options = {}) => {
    return showNotification(title, body, 'promotional', options);
  }, [showNotification]);

  const showAccount = useCallback((title, body, options = {}) => {
    return showNotification(title, body, 'account', options);
  }, [showNotification]);

  const showWishlist = useCallback((title, body, options = {}) => {
    return showNotification(title, body, 'wishlist', options);
  }, [showNotification]);

  const showEngagement = useCallback((title, body, options = {}) => {
    return showNotification(title, body, 'engagement', options);
  }, [showNotification]);

  const value = {
    notifications,
    showNotification,
    removeNotification,
    clearAllNotifications,
    showSuccess,
    showError,
    showWarning,
    showWelcome,
    showOrder,
    showPromotion,
    showAccount,
    showWishlist,
    showEngagement,
  };

  return (
    <TopNotificationContext.Provider value={value}>
      {children}
      <TopNotificationToast
        notifications={notifications}
        onClose={() => {
          if (notifications.length > 0) {
            removeNotification(notifications[notifications.length - 1].id);
          }
        }}
      />
    </TopNotificationContext.Provider>
  );
};

export default TopNotificationContext;