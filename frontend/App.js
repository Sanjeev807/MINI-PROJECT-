import React, { useEffect } from 'react';
import { StatusBar, PermissionsAndroid, Platform, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';
import AppNavigator from './src/navigation/AppNavigator';
import { requestNotificationPermission, setupNotificationHandlers } from './src/services/notificationService';

const App = () => {
  useEffect(() => {
    // Request notification permissions and setup handlers
    const initializeNotifications = async () => {
      try {
        const hasPermission = await requestNotificationPermission();
        if (hasPermission) {
          await setupNotificationHandlers();
        }
      } catch (error) {
        console.error('Failed to initialize notifications:', error);
      }
    };

    initializeNotifications();
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <NavigationContainer>
          <StatusBar barStyle="light-content" backgroundColor="#2874f0" />
          <AppNavigator />
        </NavigationContainer>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
