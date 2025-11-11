import React, {useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';
import {useAuth} from '../context/AuthContext';
import {setupNotificationListeners} from '../services/notificationService';

// Navigators
import TabNavigator from './TabNavigator';

// Auth Screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

// Other Screens
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import OrderHistoryScreen from '../screens/OrderHistoryScreen';
import WishlistScreen from '../screens/WishlistScreen';

const Stack = createStackNavigator();

const StackNavigator = () => {
  const {isAuthenticated, loading} = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    // Setup notification listeners with navigation
    const unsubscribe = setupNotificationListeners(navigation);
    return unsubscribe;
  }, [navigation]);

  if (loading) {
    return null; // Or a loading screen
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      {!isAuthenticated ? (
        // Auth Stack
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        // Main App Stack
        <>
          <Stack.Screen name="MainTabs" component={TabNavigator} />
          <Stack.Screen
            name="ProductDetails"
            component={ProductDetailsScreen}
          />
          <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
          <Stack.Screen name="Wishlist" component={WishlistScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default StackNavigator;
