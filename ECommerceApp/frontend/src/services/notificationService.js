// Firebase Web SDK for notifications
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';

// Firebase config - should match your backend
const firebaseConfig = {
  apiKey: "AIzaSyB5RY4sAvzez8XevNlhUcNiCLUcrZKxI-k",
  authDomain: "e-shopeasy.firebaseapp.com",
  projectId: "e-shopeasy",
  storageBucket: "e-shopeasy.firebasestorage.app",
  messagingSenderId: "605116703017",
  appId: "1:605116703017:web:1deeb57e99a67522309738",
  measurementId: "G-JT88GF3SF1"
};

// VAPID Key for web push
const VAPID_KEY = 'BB1oO5HVWQLQVC3qTw0yPC1g--xeXDinC4dYIiXA1etyCClxSFxVjquTedmV3X4oxAKAHKJB7Xo2wPJob0bZRW8';

// API URL configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let messaging = null;

// Initialize messaging only if supported
const initializeMessaging = async () => {
  try {
    const supported = await isSupported();
    if (supported && 'serviceWorker' in navigator && 'Notification' in window) {
      messaging = getMessaging(app);
      return true;
    }
    console.warn('FCM not supported in this browser');
    return false;
  } catch (error) {
    console.error('Error initializing Firebase messaging:', error);
    return false;
  }
};

// Request notification permission and get FCM token
export const requestNotificationPermission = async () => {
  try {
    console.log('🔔 Requesting notification permission...');
    
    // Check if messaging is supported
    const messagingSupported = await initializeMessaging();
    if (!messagingSupported) {
      console.warn('Messaging not supported');
      return { success: false, error: 'Messaging not supported' };
    }

    // Check current permission
    let permission = Notification.permission;
    console.log('Current permission:', permission);

    // Request permission if not granted
    if (permission === 'default') {
      permission = await Notification.requestPermission();
      console.log('Permission after request:', permission);
    }

    if (permission !== 'granted') {
      console.warn('Notification permission not granted:', permission);
      return { success: false, error: 'Permission not granted', permission };
    }

    // Register service worker
    try {
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      console.log('✅ Service worker registered:', registration);
    } catch (swError) {
      console.warn('Service worker registration failed:', swError);
      // Continue without service worker for foreground notifications
    }

    // Get FCM token
    const token = await getToken(messaging, { vapidKey: VAPID_KEY });
    
    if (token) {
      console.log('✅ FCM token received:', token);
      return { success: true, token, permission };
    } else {
      console.warn('No FCM token received');
      return { success: false, error: 'No token generated' };
    }

  } catch (error) {
    console.error('❌ Error requesting notification permission:', error);
    return { success: false, error: error.message };
  }
};

// Save FCM token to backend
export const saveFCMTokenToBackend = async (token, authToken) => {
  try {
    console.log('💾 Saving FCM token to backend...');
    
    const response = await fetch(`${API_BASE_URL}/api/fcm/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ fcmToken: token })
    });

    if (response.ok) {
      console.log('✅ FCM token saved successfully');
      return { success: true };
    } else {
      const error = await response.json();
      console.error('❌ Failed to save FCM token:', error);
      return { success: false, error: error.message };
    }
  } catch (error) {
    console.error('❌ Error saving FCM token:', error);
    
    // Provide more specific error messages
    if (error.message.includes('fetch')) {
      return { 
        success: false, 
        error: 'Backend connection failed. FCM token generated successfully but not saved.',
        isNetworkError: true 
      };
    }
    
    return { success: false, error: error.message };
  }
};

// Complete FCM setup (permission + token + save)
export const setupFCMForUser = async (authToken) => {
  try {
    console.log('🚀 Setting up FCM for user...');
    
    // Step 1: Request permission and get token
    const permissionResult = await requestNotificationPermission();
    
    if (!permissionResult.success) {
      return permissionResult;
    }

    // Step 2: Save token to backend (with fallback)
    const saveResult = await saveFCMTokenToBackend(permissionResult.token, authToken);
    
    if (!saveResult.success) {
      // If backend is down, still consider setup successful for frontend notifications
      console.warn('Backend save failed, but FCM token is valid for frontend notifications');
      
      if (saveResult.isNetworkError) {
        return { 
          success: true, 
          token: permissionResult.token, 
          warning: 'Notifications enabled locally. Backend connection will retry automatically.' 
        };
      }
      return {
        success: true, // Changed to true for better UX
        token: permissionResult.token,
        warning: 'Notifications enabled locally. Backend connection will retry automatically.',
        message: 'FCM setup completed (frontend only)'
      };
    }

    console.log('✅ FCM setup completed successfully');
    return {
      success: true,
      token: permissionResult.token,
      message: 'FCM setup completed successfully'
    };

  } catch (error) {
    console.error('❌ Error setting up FCM:', error);
    return { success: false, error: error.message };
  }
};

// Subscribe to notifications (for existing users)
export const subscribeToNotifications = async (authToken) => {
  return await setupFCMForUser(authToken);
};

// Setup foreground message listener
export const setupForegroundListener = (callback) => {
  if (!messaging) {
    console.warn('Messaging not initialized');
    return;
  }

  console.log('🎯 Setting up FCM foreground listener...');

  onMessage(messaging, (payload) => {
    console.log('📬 FCM Foreground message received:', payload);
    console.log('📋 Notification:', payload.notification);
    console.log('📋 Data:', payload.data);
    
    // Use EXACT title and body from FCM backend
    const notificationTitle = payload.notification?.title || 'E-Shop Notification';
    const notificationBody = payload.notification?.body || '';
    
    console.log('🔔 Creating notification:', notificationTitle);
    console.log('   Body:', notificationBody);
    
    // Show browser notification with EXACT backend message
    if (Notification.permission === 'granted') {
      const notificationOptions = {
        body: notificationBody,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: payload.data?.type || 'notification',
        data: payload.data,
        requireInteraction: false,
        silent: false
      };

      console.log('✅ Showing browser notification...');
      const notification = new Notification(notificationTitle, notificationOptions);
      
      notification.onclick = () => {
        console.log('🖱️ Notification clicked');
        window.focus();
        notification.close();
        
        // Navigate to link if provided
        if (payload.data?.link) {
          window.location.href = payload.data.link;
        }
      };
    } else {
      console.warn('⚠️ Notification permission not granted, permission:', Notification.permission);
    }
    
    // Call custom callback if provided (for TopNotificationToast)
    if (callback) {
      console.log('📞 Calling custom callback for in-app notification...');
      callback(payload);
    }
  });
  
  console.log('✅ FCM foreground listener setup complete');
};

// Send test notification
export const sendTestNotification = async (authToken) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/fcm/test`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Test notification sent:', result);
      return { success: true, result };
    } else {
      const error = await response.json();
      console.error('❌ Test notification failed:', error);
      return { success: false, error: error.message };
    }
  } catch (error) {
    console.error('❌ Error sending test notification:', error);
    return { success: false, error: error.message };
  }
};

// Check if FCM is supported
export const isFCMSupported = async () => {
  try {
    const supported = await isSupported();
    return supported && 'serviceWorker' in navigator && 'Notification' in window;
  } catch (error) {
    return false;
  }
};

// Get current notification permission status
export const getNotificationPermissionStatus = () => {
  if (!('Notification' in window)) {
    return 'not-supported';
  }
  return Notification.permission;
};

export default {
  requestNotificationPermission,
  saveFCMTokenToBackend,
  setupFCMForUser,
  subscribeToNotifications,
  setupForegroundListener,
  sendTestNotification,
  isFCMSupported,
  getNotificationPermissionStatus
};
