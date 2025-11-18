import React, {useEffect} from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import {AuthProvider} from './contexts/AuthContext';
import {CartProvider} from './contexts/CartContext';
import {TopNotificationProvider} from './contexts/TopNotificationContext';
import AppRoutes from './navigation/AppRoutes';
import {requestNotificationPermission} from './services/notificationService';
import './styles/global.css';

const App = () => {
  useEffect(() => {
    // Request notification permissions on app load
    requestNotificationPermission();
  }, []);

  return (
    <TopNotificationProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <AppRoutes />
          </Router>
        </CartProvider>
      </AuthProvider>
    </TopNotificationProvider>
  );
};

export default App;
