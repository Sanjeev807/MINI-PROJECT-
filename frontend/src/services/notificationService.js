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
      console.log('✅ Notification permission granted');
      return true;
    } else {
      console.log('❌ Notification permission denied');
      return false;
    }
  } catch (error) {
    console.error('Error requesting notification permission:', error);
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
      console.log('FCM Token:', fcmToken);
      await AsyncStorage.setItem('fcmToken', fcmToken);
      return fcmToken;
    }
    return null;
  } catch (error) {
    console.error('Error getting FCM token:', error);
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
      console.log('✅ FCM token saved to backend');
    }
  } catch (error) {
    console.error('Error saving FCM token to backend:', error);
  }
};

/**
 * Handle foreground notifications
 */
const handleForegroundNotification = (remoteMessage) => {
  console.log('📱 Foreground notification received:', remoteMessage);
  
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
  console.log('📱 Notification pressed with data:', data);
  
  // Deep linking logic based on notification type
  if (data?.type === 'order') {
    // Navigate to order details
    console.log('Navigate to order:', data.orderId);
  } else if (data?.type === 'product') {
    // Navigate to product details
    console.log('Navigate to product:', data.productId);
  } else if (data?.type === 'promotion') {
    // Navigate to deals/offers screen
    console.log('Navigate to promotions');
  }
};

/**
 * Handle background notification press
 */
const handleBackgroundNotificationPress = async (remoteMessage) => {
  console.log('📱 Background notification pressed:', remoteMessage);
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
      console.log('🔄 FCM Token refreshed:', token);
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
        console.log('📱 App opened from quit state by notification');
        handleBackgroundNotificationPress(remoteMessage);
      }
    });
    
    // Handle notification opened from background state
    const unsubscribeBackground = messaging().onNotificationOpenedApp(
      handleBackgroundNotificationPress
    );
    
    console.log('✅ Notification handlers setup complete');
    
    return () => {
      unsubscribeForeground();
      unsubscribeBackground();
    };
  } catch (error) {
    console.error('Error setting up notification handlers:', error);
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
    console.error('Error showing local notification:', error);
  }
};

/**
 * Subscribe to topic (for group notifications)
 */
export const subscribeToTopic = async (topic) => {
  try {
    await messaging().subscribeToTopic(topic);
    console.log(`✅ Subscribed to topic: ${topic}`);
  } catch (error) {
    console.error(`Error subscribing to topic ${topic}:`, error);
  }
};

/**
 * Unsubscribe from topic
 */
export const unsubscribeFromTopic = async (topic) => {
  try {
    await messaging().unsubscribeFromTopic(topic);
    console.log(`✅ Unsubscribed from topic: ${topic}`);
  } catch (error) {
    console.error(`Error unsubscribing from topic ${topic}:`, error);
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
    console.error('Error getting badge count:', error);
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
    console.error('Error setting badge count:', error);
  }
};
