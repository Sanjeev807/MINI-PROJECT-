import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  IconButton,
  Divider,
  Card,
  CardContent,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Add,
  Remove,
  Delete,
  ShoppingCart,
  LocalOffer,
  Verified,
} from '@mui/icons-material';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const CartScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, getCartCount } = useCart();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    if (newQuantity > 10) {
      setSnackbar({ open: true, message: 'Maximum quantity is 10', severity: 'warning' });
      return;
    }
    updateQuantity(productId, newQuantity);
  };

  const handleRemove = (productId, productName) => {
    removeFromCart(productId);
    setSnackbar({ open: true, message: `${productName} removed from cart`, severity: 'info' });
  };

  const handlePlaceOrder = () => {
    setSnackbar({ 
      open: true, 
      message: '🎉 Your order has been placed successfully!', 
      severity: 'success' 
    });
    // TODO: Implement actual order placement API call
    // For now, just show success message
  };

  const cartTotal = getCartTotal();
  const deliveryCharge = cartTotal > 500 ? 0 : 40;
  const totalAmount = cartTotal + deliveryCharge;
  const savings = cartItems.reduce((acc, item) => {
    const originalPrice = item.originalPrice || item.price;
    return acc + ((originalPrice - item.price) * item.quantity);
  }, 0);

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <ShoppingCart sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Please login to view your cart
        </Typography>
        <Button variant="contained" onClick={() => navigate('/login')} sx={{ mt: 2 }}>
          Login
        </Button>
      </Container>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <ShoppingCart sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Your cart is empty!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Add items to it now
        </Typography>
        <Button variant="contained" onClick={() => navigate('/')} sx={{ backgroundColor: '#2874f0' }}>
          Shop Now
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#f1f3f6', minHeight: '100vh', py: 3 }}>
      <Container maxWidth="lg">
        <Grid container spacing={2}>
          {/* Left Section - Cart Items */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ mb: 2 }}>
              <Box sx={{ p: 2, backgroundColor: '#fff', borderBottom: '1px solid #f0f0f0' }}>
                <Typography variant="h6" fontWeight="bold">
                  My Cart ({getCartCount()})
                </Typography>
              </Box>

              {cartItems.map((item, index) => (
                <Box key={item.id || index}>
                  <Box sx={{ p: 2, display: 'flex', gap: 2 }}>
                    {/* Product Image */}
                    <Box
                      sx={{
                        width: 112,
                        height: 112,
                        flexShrink: 0,
                        backgroundColor: '#f5f5f5',
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                      onClick={() => navigate(`/product/${item.id}`)}
                    >
                      <img
                        src={item.images?.[0] || 'https://via.placeholder.com/112'}
                        alt={item.name}
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                      />
                    </Box>

                    {/* Product Details */}
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="subtitle1"
                        fontWeight="500"
                        sx={{
                          cursor: 'pointer',
                          '&:hover': { color: '#2874f0' }
                        }}
                        onClick={() => navigate(`/product/${item.id}`)}
                      >
                        {item.name}
                      </Typography>

                      {/* Price */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                        <Typography variant="h6" fontWeight="bold">
                          ₹{item.price.toLocaleString()}
                        </Typography>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ textDecoration: 'line-through' }}
                            >
                              ₹{item.originalPrice.toLocaleString()}
                            </Typography>
                            <Typography variant="body2" color="#388e3c" fontWeight="bold">
                              {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% off
                            </Typography>
                          </>
                        )}
                      </Box>

                      {/* Delivery Info */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                        <Verified sx={{ fontSize: 16, color: '#388e3c' }} />
                        <Typography variant="caption" color="text.secondary">
                          Delivery by Tomorrow | <strong>Free</strong>
                        </Typography>
                      </Box>

                      {/* Quantity Controls */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #e0e0e0', borderRadius: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Remove fontSize="small" />
                          </IconButton>
                          <Box
                            sx={{
                              px: 2,
                              py: 0.5,
                              minWidth: 40,
                              textAlign: 'center',
                              borderLeft: '1px solid #e0e0e0',
                              borderRight: '1px solid #e0e0e0',
                            }}
                          >
                            <Typography variant="body2" fontWeight="bold">
                              {item.quantity}
                            </Typography>
                          </Box>
                          <IconButton
                            size="small"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            disabled={item.quantity >= 10}
                          >
                            <Add fontSize="small" />
                          </IconButton>
                        </Box>

                        <Button
                          size="small"
                          startIcon={<Delete />}
                          onClick={() => handleRemove(item.id, item.name)}
                          sx={{ color: '#878787', textTransform: 'uppercase', fontWeight: 'bold' }}
                        >
                          Remove
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                  {index < cartItems.length - 1 && <Divider />}
                </Box>
              ))}

              <Box sx={{ p: 2, borderTop: '1px solid #f0f0f0', textAlign: 'right' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handlePlaceOrder}
                  sx={{
                    backgroundColor: '#fb641b',
                    fontWeight: 'bold',
                    px: 4,
                    '&:hover': { backgroundColor: '#e55b16' }
                  }}
                >
                  PLACE ORDER
                </Button>
              </Box>
            </Paper>

            {/* Offers Section */}
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <LocalOffer sx={{ color: '#388e3c' }} />
                <Typography variant="subtitle1" fontWeight="bold">
                  Available Offers
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2">
                  • 10% Instant Discount on HDFC Bank Credit Cards
                </Typography>
                <Typography variant="body2">
                  • Get extra 20% cashback on prepaid orders above ₹999
                </Typography>
                <Typography variant="body2">
                  • No Cost EMI available on orders above ₹3,000
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Right Section - Price Details */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ position: 'sticky', top: 80 }}>
              <Box sx={{ p: 2, borderBottom: '1px solid #f0f0f0' }}>
                <Typography variant="subtitle1" fontWeight="bold" color="text.secondary">
                  PRICE DETAILS
                </Typography>
              </Box>

              <Box sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body1">
                    Price ({getCartCount()} item{getCartCount() > 1 ? 's' : ''})
                  </Typography>
                  <Typography variant="body1">
                    ₹{(cartTotal + savings).toLocaleString()}
                  </Typography>
                </Box>

                {savings > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body1">Discount</Typography>
                    <Typography variant="body1" color="#388e3c" fontWeight="bold">
                      − ₹{savings.toLocaleString()}
                    </Typography>
                  </Box>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body1">Delivery Charges</Typography>
                  <Typography variant="body1" color={deliveryCharge === 0 ? '#388e3c' : 'inherit'}>
                    {deliveryCharge === 0 ? (
                      <span style={{ textDecoration: 'line-through', marginRight: 4 }}>₹40</span>
                    ) : null}
                    {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" fontWeight="bold">
                    Total Amount
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    ₹{totalAmount.toLocaleString()}
                  </Typography>
                </Box>

                {savings > 0 && (
                  <Typography variant="body2" color="#388e3c" fontWeight="bold">
                    You will save ₹{savings.toLocaleString()} on this order
                  </Typography>
                )}
              </Box>
            </Paper>

            {/* Safe and Secure */}
            <Card sx={{ mt: 2, backgroundColor: '#fafafa' }}>
              <CardContent>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  Safe and Secure Payments
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  100% Payment Protection. Easy Returns. SSL Encrypted
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CartScreen;
