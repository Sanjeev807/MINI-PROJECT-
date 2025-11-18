import React, { useState, useEffect, useContext } from 'react';
import { 
  Container, 
  Grid, 
  Typography, 
  Box, 
  CircularProgress, 
  Alert,
  Button,
  ButtonGroup,
  Paper,
  IconButton
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import CarouselBanner from '../components/CarouselBanner';
import CategoryNav from '../components/CategoryNav';
import { AuthContext } from '../contexts/AuthContext';
import NotificationSetup from '../components/NotificationSetup';
import { notificationEventBus } from '../services/notificationEventBus';
import axios from 'axios';
import { Capacitor } from '@capacitor/core';
import './HomeScreen.css';

// Get API URL based on platform
const getAPIUrl = () => {
  if (Capacitor.getPlatform() === 'android') {
    return 'http://10.0.2.2:5000';
  }
  return 'http://localhost:5000';
};

const API_URL = getAPIUrl();

const HomeScreen = () => {
  const { category } = useParams(); // Get category from URL
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [priceFilter, setPriceFilter] = useState('all');
  const [showNotificationSetup, setShowNotificationSetup] = useState(false);
  const { user, token } = useContext(AuthContext);

  useEffect(() => {
    fetchProducts();
    if (user && token) {
      triggerPromotionalNotification();
      // Check if user should see notification setup
      const hasSeenNotificationSetup = localStorage.getItem('notificationSetupSeen');
      if (!hasSeenNotificationSetup && Notification.permission !== 'granted') {
        setShowNotificationSetup(true);
      }
      
      // Send welcome back notification if user hasn't been active recently
      const lastVisit = localStorage.getItem('lastHomeVisit');
      const now = new Date().getTime();
      if (!lastVisit || (now - parseInt(lastVisit)) > 3600000) { // 1 hour
        triggerEngagementNotification();
      }
      localStorage.setItem('lastHomeVisit', now.toString());
    }
  }, [category, user, token]); // Re-fetch when category changes

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let url = `${API_URL}/api/products`;
      
      // Add category filter if category param exists
      if (category) {
        url += `?category=${category}`;
      }
      
      const response = await axios.get(url);
      // API returns { products: [...], page, pages, total }
      const productsData = response.data.products || response.data || [];
      setProducts(Array.isArray(productsData) ? productsData : []);
      setError('');
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Using sample data.');
      // Fallback to mock data
      setProducts([
        { 
          _id: '1', 
          name: 'Sample Product 1', 
          price: 999, 
          originalPrice: 1299,
          image: 'https://via.placeholder.com/200',
          category: 'Electronics',
          rating: 4.5,
          reviews: 234,
          stock: 50,
          isFeatured: true
        },
        { 
          _id: '2', 
          name: 'Sample Product 2', 
          price: 1999, 
          originalPrice: 2499,
          image: 'https://via.placeholder.com/200',
          category: 'Fashion',
          rating: 4.2,
          reviews: 123,
          stock: 30
        },
        { 
          _id: '3', 
          name: 'Sample Product 3', 
          price: 2999, 
          originalPrice: 3999,
          image: 'https://via.placeholder.com/200',
          category: 'Home',
          rating: 4.7,
          reviews: 456,
          stock: 20,
          isFeatured: true
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const triggerPromotionalNotification = async () => {
    try {
      await axios.post(
        `${API_URL}/api/promotions/auto-offer-notification`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
    } catch (err) {
      // Silently fail - promotional notifications are not critical
    }
  };

  const triggerEngagementNotification = async () => {
    try {
      await axios.post(
        `${API_URL}/api/notifications/engagement`,
        { action: 'welcome_back' },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
    } catch (err) {
      // Silently fail - engagement notifications are not critical
      console.log('Engagement notification failed:', err.message);
    }
  };

  const handleNotificationSetupDismiss = () => {
    setShowNotificationSetup(false);
    localStorage.setItem('notificationSetupSeen', 'true');
  };

  const getFilteredAndSortedProducts = () => {
    // Safety check to ensure products is always an array
    if (!Array.isArray(products)) {
      console.error('Products is not an array:', products);
      return [];
    }
    
    let filtered = [...products];
    
    // Apply price filter
    switch(priceFilter) {
      case 'under1000':
        filtered = filtered.filter(p => p.price < 1000);
        break;
      case '1000-5000':
        filtered = filtered.filter(p => p.price >= 1000 && p.price < 5000);
        break;
      case '5000-20000':
        filtered = filtered.filter(p => p.price >= 5000 && p.price < 20000);
        break;
      case 'above20000':
        filtered = filtered.filter(p => p.price >= 20000);
        break;
      default:
        break;
    }
    
    // Apply sorting
    switch(sortBy) {
      case 'price-low':
        return filtered.sort((a, b) => a.price - b.price);
      case 'price-high':
        return filtered.sort((a, b) => b.price - a.price);
      case 'rating':
        return filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      default:
        return filtered;
    }
  };

  return (
    <>
      <CategoryNav />
      
      {/* Notification Setup Banner */}
      {showNotificationSetup && (
        <Container maxWidth="xl" sx={{ py: 2 }}>
          <Paper
            sx={{
              p: 3,
              backgroundColor: 'rgba(25, 118, 210, 0.05)',
              border: '1px solid rgba(25, 118, 210, 0.2)',
              borderRadius: 2,
              position: 'relative',
            }}
          >
            <IconButton
              size="small"
              onClick={handleNotificationSetupDismiss}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                color: 'primary.main',
              }}
            >
              <Close />
            </IconButton>
            <Typography variant="h6" gutterBottom color="primary">
              🔔 Stay Updated with E-Shop!
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Get instant notifications about new products, exclusive deals, flash sales, and order updates.
            </Typography>
            <NotificationSetup compact onSetupComplete={handleNotificationSetupDismiss} />
          </Paper>
        </Container>
      )}
      
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <CarouselBanner />
        
        {error && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Price Range Filters */}
        <Paper elevation={0} sx={{ p: 2, mb: 3, background: 'white', borderRadius: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
            Price Range
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant={priceFilter === 'all' ? 'contained' : 'outlined'}
              onClick={() => setPriceFilter('all')}
              sx={{
                textTransform: 'none',
                borderRadius: 1,
                ...(priceFilter === 'all' && {
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }),
              }}
            >
              All Prices
            </Button>
            <Button
              variant={priceFilter === 'under1000' ? 'contained' : 'outlined'}
              onClick={() => setPriceFilter('under1000')}
              sx={{
                textTransform: 'none',
                borderRadius: 1,
                ...(priceFilter === 'under1000' && {
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }),
              }}
            >
              Under ₹1,000
            </Button>
            <Button
              variant={priceFilter === '1000-5000' ? 'contained' : 'outlined'}
              onClick={() => setPriceFilter('1000-5000')}
              sx={{
                textTransform: 'none',
                borderRadius: 1,
                ...(priceFilter === '1000-5000' && {
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }),
              }}
            >
              ₹1,000 - ₹5,000
            </Button>
            <Button
              variant={priceFilter === '5000-20000' ? 'contained' : 'outlined'}
              onClick={() => setPriceFilter('5000-20000')}
              sx={{
                textTransform: 'none',
                borderRadius: 1,
                ...(priceFilter === '5000-20000' && {
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }),
              }}
            >
              ₹5,000 - ₹20,000
            </Button>
            <Button
              variant={priceFilter === 'above20000' ? 'contained' : 'outlined'}
              onClick={() => setPriceFilter('above20000')}
              sx={{
                textTransform: 'none',
                borderRadius: 1,
                ...(priceFilter === 'above20000' && {
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }),
              }}
            >
              Above ₹20,000
            </Button>
          </Box>
        </Paper>

        {/* Header with sorting */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
            {category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Products` : 'All Products'}
            <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 2 }}>
              ({getFilteredAndSortedProducts().length} items)
            </Typography>
          </Typography>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              onClick={() => setSortBy('price-low')}
              variant={sortBy === 'price-low' ? 'contained' : 'outlined'}
              sx={{
                textTransform: 'none',
                borderRadius: 1,
                background: sortBy === 'price-low' ? 'white' : 'transparent',
                color: sortBy === 'price-low' ? '#667eea' : '#666',
                border: '1px solid #e0e0e0',
                fontWeight: sortBy === 'price-low' ? 'bold' : 'normal',
                '&:hover': {
                  background: 'white',
                  border: '1px solid #667eea',
                },
              }}
            >
              Price: Low to High
            </Button>
            <Button 
              onClick={() => setSortBy('price-high')}
              variant={sortBy === 'price-high' ? 'contained' : 'outlined'}
              sx={{
                textTransform: 'none',
                borderRadius: 1,
                background: sortBy === 'price-high' ? 'white' : 'transparent',
                color: sortBy === 'price-high' ? '#667eea' : '#666',
                border: '1px solid #e0e0e0',
                fontWeight: sortBy === 'price-high' ? 'bold' : 'normal',
                '&:hover': {
                  background: 'white',
                  border: '1px solid #667eea',
                },
              }}
            >
              Price: High to Low
            </Button>
            <Button 
              onClick={() => setSortBy('rating')}
              variant={sortBy === 'rating' ? 'contained' : 'outlined'}
              sx={{
                textTransform: 'none',
                borderRadius: 1,
                background: sortBy === 'rating' ? 'white' : 'transparent',
                color: sortBy === 'rating' ? '#667eea' : '#666',
                border: '1px solid #e0e0e0',
                fontWeight: sortBy === 'rating' ? 'bold' : 'normal',
                '&:hover': {
                  background: 'white',
                  border: '1px solid #667eea',
                },
              }}
            >
              Rating
            </Button>
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
            <CircularProgress />
            <Typography variant="body1" sx={{ ml: 2 }}>Loading products...</Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {getFilteredAndSortedProducts().length === 0 ? (
              <Grid item xs={12}>
                <Box sx={{ textAlign: 'center', py: 8, background: 'white', borderRadius: 2 }}>
                  <Typography variant="h6" color="text.secondary">
                    No products found in this price range
                  </Typography>
                  <Button 
                    onClick={() => setPriceFilter('all')} 
                    sx={{ mt: 2 }}
                    variant="outlined"
                  >
                    View All Products
                  </Button>
                </Box>
              </Grid>
            ) : (
              getFilteredAndSortedProducts().map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product.id || product._id}>
                  <ProductCard product={product} />
                </Grid>
              ))
            )}
          </Grid>
        )}
      </Container>
    </>
  );
};

export default HomeScreen;
