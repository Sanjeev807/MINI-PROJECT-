import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import firebaseConfig from './config';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging
const messaging = getMessaging(app);

/**
 * Request permission for notifications and get FCM token
 * @returns {Promise<string|null>} FCM token or null if permission denied
 */
export const requestNotificationPermission = async () => {
  try {
    console.log('Requesting notification permission...');
    
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      console.log('✅ Notification permission granted');
      
      // Get FCM token
      const token = await getToken(messaging, {
        vapidKey: 'BB1oO5HVWQLQVC3qTw0yPC1g--xeXDinC4dYIiXA1etyCClxSFxVjquTedmV3X4oxAKAHKJB7Xo2wPJob0bZRW8'
      });
      
      if (token) {
        console.log('✅ FCM Token:', token);
        return token;
      } else {
        console.warn('⚠️ No FCM token available');
        return null;
      }
    } else if (permission === 'denied') {
      console.warn('❌ Notification permission denied');
      return null;
    } else {
      console.warn('⚠️ Notification permission dismissed');
      return null;
    }
  } catch (error) {
    console.error('❌ Error getting notification permission:', error);
    return null;
  }
};

/**
 * Save FCM token to backend
 * @param {string} token - FCM token
 * @param {string} authToken - User's JWT auth token
 * @returns {Promise<boolean>} Success status
 */
export const saveFCMTokenToBackend = async (token, authToken) => {
  try {
    const response = await fetch('http://localhost:5000/api/fcm/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ fcmToken: token })
    });

    if (response.ok) {
      console.log('✅ FCM token saved to backend');
      return true;
    } else {
      console.error('❌ Failed to save FCM token to backend');
      return false;
    }
  } catch (error) {
    console.error('❌ Error saving FCM token:', error);
    return false;
  }
};

/**
 * Setup foreground message listener
 * @param {Function} callback - Callback function to handle messages
 */
export const onForegroundMessage = (callback) => {
  onMessage(messaging, (payload) => {
    console.log('📬 Foreground message received:', payload);
    
    const notificationTitle = payload.notification?.title || 'New Notification';
    const notificationBody = payload.notification?.body || 'You have a new message';
    
    // Show browser notification
    if (Notification.permission === 'granted') {
      new Notification(notificationTitle, {
        body: notificationBody,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: payload.data?.type || 'notification',
        data: payload.data,
        requireInteraction: true
      });
    }
    
    // Call custom callback
    if (callback) {
      callback(payload);
    }
  });
};

/**
 * Initialize FCM for the application
 * @param {string} authToken - User's JWT auth token
 * @returns {Promise<string|null>} FCM token or null
 */
export const initializeFCM = async (authToken) => {
  try {
    // Check if browser supports notifications
    if (!('Notification' in window)) {
      console.warn('⚠️ This browser does not support notifications');
      return null;
    }

    // Check if service worker is supported
    if (!('serviceWorker' in navigator)) {
      console.warn('⚠️ Service Worker not supported');
      return null;
    }

    // Register service worker
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    console.log('✅ Service Worker registered:', registration);

    // Request notification permission and get token
    const fcmToken = await requestNotificationPermission();
    
    if (fcmToken && authToken) {
      // Save token to backend
      await saveFCMTokenToBackend(fcmToken, authToken);
    }

    return fcmToken;
  } catch (error) {
    console.error('❌ Error initializing FCM:', error);
    return null;
  }
};

/**
 * Send a test notification
 * @param {string} authToken - User's JWT auth token
 */
export const sendTestNotification = async (authToken) => {
  try {
    const response = await fetch('http://localhost:5000/api/fcm/test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    });

    if (response.ok) {
      console.log('✅ Test notification sent');
      return true;
    } else {
      console.error('❌ Failed to send test notification');
      return false;
    }
  } catch (error) {
    console.error('❌ Error sending test notification:', error);
    return false;
  }
};

export { messaging, app };
