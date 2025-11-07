import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Platform } from 'react-native';
import { authAPI } from './api';

/**
 * Request notification permission from user
 */
export const requestNotificationPermission = async () => {
  try {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      // Notification permission granted
      return true;
    } else {
      // Notification permission denied
      return false;
    }
  } catch (error) {
    // Error requesting notification permission - fail silently
    return false;
  }
};

/**
 * Get FCM token
 */
export const getFCMToken = async () => {
  try {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      await AsyncStorage.setItem('fcmToken', fcmToken);
      return fcmToken;
    }
    return null;
  } catch (error) {
    return null;
  }
};

/**
 * Save FCM token to backend
 */
export const saveFCMToken = async (authToken) => {
  try {
    const fcmToken = await getFCMToken();
    if (fcmToken && authToken) {
      await authAPI.updateFCMToken(fcmToken, authToken);
    }
  } catch (error) {
    // Error saving FCM token - fail silently in production
  }
};

/**
 * Handle foreground notifications
 */
const handleForegroundNotification = (remoteMessage) => {
  const { notification, data } = remoteMessage;
  
  if (notification) {
    Alert.alert(
      notification.title || 'New Notification',
      notification.body || '',
      [
        {
          text: 'Dismiss',
          style: 'cancel',
        },
        {
          text: 'View',
          onPress: () => handleNotificationPress(data),
        },
      ]
    );
  }
};

/**
 * Handle notification press (when user taps on notification)
 */
export const handleNotificationPress = (data) => {
  // Deep linking logic based on notification type
  if (data?.type === 'order') {
    // Navigate to order details
  } else if (data?.type === 'product') {
    // Navigate to product details
  } else if (data?.type === 'promotion') {
    // Navigate to deals/offers screen
  }
};

/**
 * Handle background notification press
 */
const handleBackgroundNotificationPress = async (remoteMessage) => {
  if (remoteMessage?.data) {
    handleNotificationPress(remoteMessage.data);
  }
};

/**
 * Setup all notification handlers
 */
export const setupNotificationHandlers = async () => {
  try {
    // Get FCM token
    await getFCMToken();
    
    // Listen for token refresh
    messaging().onTokenRefresh(async token => {
      await AsyncStorage.setItem('fcmToken', token);
      
      // Update token on backend if user is logged in
      const authToken = await AsyncStorage.getItem('authToken');
      if (authToken) {
        await authAPI.updateFCMToken(token, authToken);
      }
    });
    
    // Handle foreground messages
    const unsubscribeForeground = messaging().onMessage(handleForegroundNotification);
    
    // Handle notification opened from quit state
    messaging().getInitialNotification().then(remoteMessage => {
      if (remoteMessage) {
        handleBackgroundNotificationPress(remoteMessage);
      }
    });
    
    // Handle notification opened from background state
    const unsubscribeBackground = messaging().onNotificationOpenedApp(
      handleBackgroundNotificationPress
    );
    
    return () => {
      unsubscribeForeground();
      unsubscribeBackground();
    };
  } catch (error) {
    // Error setting up notification handlers - fail silently in production
  }
};

/**
 * Display local notification (for testing)
 */
export const showLocalNotification = async (title, body) => {
  try {
    await messaging().displayNotification({
      title,
      body,
    });
  } catch (error) {
    // Error showing local notification - fail silently in production
  }
};

/**
 * Subscribe to topic (for group notifications)
 */
export const subscribeToTopic = async (topic) => {
  try {
    await messaging().subscribeToTopic(topic);
  } catch (error) {
    // Error subscribing to topic - fail silently in production
  }
};

/**
 * Unsubscribe from topic
 */
export const unsubscribeFromTopic = async (topic) => {
  try {
    await messaging().unsubscribeFromTopic(topic);
  } catch (error) {
    // Error unsubscribing from topic - fail silently in production
  }
};

/**
 * Get notification badge count
 */
export const getBadgeCount = async () => {
  try {
    if (Platform.OS === 'ios') {
      const count = await messaging().getAPNSToken();
      return count;
    }
    return 0;
  } catch (error) {
    return 0;
  }
};

/**
 * Set notification badge count
 */
export const setBadgeCount = async (count) => {
  try {
    if (Platform.OS === 'ios') {
      await messaging().setApplicationIconBadgeNumber(count);
    }
  } catch (error) {
    // Error setting badge count - fail silently in production
  }
};
