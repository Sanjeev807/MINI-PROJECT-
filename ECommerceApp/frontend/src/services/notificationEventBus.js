// Global notification event system to avoid circular dependencies
class NotificationEventBus {
  constructor() {
    this.listeners = [];
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  emit(type, title, body, options = {}) {
    const notification = {
      type,
      title,
      body,
      timestamp: Date.now(),
      ...options
    };

    this.listeners.forEach(callback => {
      try {
        callback(notification);
      } catch (error) {
        console.error('Error in notification listener:', error);
      }
    });
  }

  // Helper methods
  showSuccess(title, body, options = {}) {
    this.emit('success', title, body, options);
  }

  showError(title, body, options = {}) {
    this.emit('error', title, body, options);
  }

  showWarning(title, body, options = {}) {
    this.emit('warning', title, body, options);
  }

  showWelcome(title, body, options = {}) {
    this.emit('welcome', title, body, options);
  }

  showOrder(title, body, options = {}) {
    this.emit('order', title, body, options);
  }

  showPromotion(title, body, options = {}) {
    this.emit('promotional', title, body, options);
  }

  showAccount(title, body, options = {}) {
    this.emit('account', title, body, options);
  }

  showWishlist(title, body, options = {}) {
    this.emit('wishlist', title, body, options);
  }

  showEngagement(title, body, options = {}) {
    this.emit('engagement', title, body, options);
  }

  showFCMNotification(payload) {
    const type = payload.data?.type || 'info';
    this.emit(type, 
      payload.notification?.title || 'E-Shop Notification',
      payload.notification?.body || 'You have a new notification',
      payload.data || {}
    );
  }
}

export const notificationEventBus = new NotificationEventBus();
export default notificationEventBus;