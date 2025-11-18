import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Alert,
  CircularProgress,
  Chip
} from '@mui/material';
import {
  Notifications,
  ShoppingCart,
  LocalShipping,
  CheckCircle,
  Cancel,
  Login,
  Person,
  Lock,
  LocalOffer,
  Favorite,
  TrendingUp,
  Home,
  Celebration
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const NotificationTester = () => {
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState('');

  const sendTestNotification = async (type, action, label) => {
    if (!token) {
      setMessage('Please login first');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/api/notifications/test`,
        { type, action },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setResults(prev => [...prev, { type, action, label, status: 'success' }]);
        setMessage(`✅ ${label} sent successfully!`);
      } else {
        setResults(prev => [...prev, { type, action, label, status: 'failed' }]);
        setMessage(`❌ ${label} failed`);
      }
    } catch (error) {
      setResults(prev => [...prev, { type, action, label, status: 'error' }]);
      setMessage(`❌ Error: ${error.response?.data?.message || error.message}`);
    }
    setLoading(false);
  };

  const sendAllTestNotifications = async () => {
    if (!token) {
      setMessage('Please login first');
      return;
    }

    setLoading(true);
    setResults([]);
    
    try {
      const response = await axios.post(
        `${API_URL}/api/notifications/test-all`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setMessage(`✅ All notifications sent! ${response.data.message}`);
        setResults(response.data.results.map(r => ({
          type: r.type,
          status: r.result.success ? 'success' : 'failed'
        })));
      } else {
        setMessage(`❌ Failed to send notifications`);
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.response?.data?.message || error.message}`);
    }
    setLoading(false);
  };

  const notificationTypes = [
    {
      category: '🔑 Account Notifications',
      items: [
        { type: 'account', action: 'login', label: 'Login Success', icon: <Login /> },
        { type: 'account', action: 'profile_update', label: 'Profile Updated', icon: <Person /> },
        { type: 'account', action: 'password_change', label: 'Password Changed', icon: <Lock /> }
      ]
    },
    {
      category: '📦 Order Notifications',
      items: [
        { type: 'order', action: 'placed', label: 'Order Placed', icon: <ShoppingCart /> },
        { type: 'order', action: 'shipped', label: 'Order Shipped', icon: <LocalShipping /> },
        { type: 'order', action: 'delivered', label: 'Order Delivered', icon: <CheckCircle /> },
        { type: 'order', action: 'cancelled', label: 'Order Cancelled', icon: <Cancel /> }
      ]
    },
    {
      category: '🔥 Promotional Notifications',
      items: [
        { type: 'promotional', action: 'flash_sale', label: 'Flash Sale', icon: <LocalOffer /> },
        { type: 'promotional', action: 'discount_offer', label: 'Discount Offer', icon: <LocalOffer /> },
        { type: 'promotional', action: 'festive_offer', label: 'Festive Offer', icon: <Celebration /> }
      ]
    },
    {
      category: '💖 Wishlist Notifications',
      items: [
        { type: 'wishlist', action: 'back_in_stock', label: 'Back in Stock', icon: <Favorite /> },
        { type: 'wishlist', action: 'price_drop', label: 'Price Drop Alert', icon: <Favorite /> }
      ]
    },
    {
      category: '🚀 Engagement Notifications',
      items: [
        { type: 'engagement', action: 'welcome_back', label: 'Welcome Back', icon: <Home /> },
        { type: 'engagement', action: 'trending_products', label: 'Trending Products', icon: <TrendingUp /> },
        { type: 'engagement', action: 'cart_reminder', label: 'Cart Reminder', icon: <ShoppingCart /> }
      ]
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Notifications />
        Notification Tester
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Test all notification types to ensure your FCM system is working correctly.
        {user && <Chip label={`Logged in as: ${user.name || user.email}`} sx={{ ml: 2 }} />}
      </Typography>

      {message && (
        <Alert 
          severity={message.includes('✅') ? 'success' : 'error'} 
          sx={{ mb: 3 }}
          onClose={() => setMessage('')}
        >
          {message}
        </Alert>
      )}

      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          size="large"
          onClick={sendAllTestNotifications}
          disabled={loading || !token}
          startIcon={loading ? <CircularProgress size={20} /> : <Notifications />}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
            }
          }}
        >
          {loading ? 'Sending...' : 'Test All Notifications'}
        </Button>
      </Box>

      {notificationTypes.map((category, categoryIndex) => (
        <Paper key={categoryIndex} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {category.category}
          </Typography>
          <Grid container spacing={2}>
            {category.items.map((item, itemIndex) => {
              const result = results.find(r => r.type === item.type && r.action === item.action);
              return (
                <Grid item xs={12} sm={6} md={4} key={itemIndex}>
                  <Button
                    fullWidth
                    variant={result ? (result.status === 'success' ? 'contained' : 'outlined') : 'outlined'}
                    color={result?.status === 'success' ? 'success' : result?.status === 'failed' ? 'error' : 'primary'}
                    startIcon={item.icon}
                    onClick={() => sendTestNotification(item.type, item.action, item.label)}
                    disabled={loading || !token}
                    sx={{ 
                      height: 56,
                      textTransform: 'none',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        transition: 'transform 0.2s ease-in-out'
                      }
                    }}
                  >
                    {item.label}
                    {result && (
                      <Box sx={{ ml: 1 }}>
                        {result.status === 'success' ? '✅' : '❌'}
                      </Box>
                    )}
                  </Button>
                </Grid>
              );
            })}
          </Grid>
        </Paper>
      ))}

      {results.length > 0 && (
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            📊 Test Results
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ✅ Successful: {results.filter(r => r.status === 'success').length} | 
            ❌ Failed: {results.filter(r => r.status !== 'success').length}
          </Typography>
        </Paper>
      )}

      {!token && (
        <Alert severity="warning" sx={{ mt: 3 }}>
          Please login to test notifications. The notification system requires authentication.
        </Alert>
      )}
    </Box>
  );
};

export default NotificationTester;