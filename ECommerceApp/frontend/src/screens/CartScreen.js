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
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormControl,
  FormLabel,
} from '@mui/material';
import {
  Add,
  Remove,
  Delete,
  ShoppingCart,
  LocalOffer,
  Verified,
  CheckCircle,
  LocalShipping,
  Inventory,
  Home,
} from '@mui/icons-material';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const CartScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, updateQuantity, removeFromCart, clearCart, getCartTotal, getCartCount } = useCart();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [checkoutDialog, setCheckoutDialog] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    phone: '',
    addressLine: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');

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

  const handleOpenCheckout = () => {
    setCheckoutDialog(true);
  };

  const handlePlaceOrder = async () => {
    // Validate address
    if (!shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.addressLine || 
        !shippingAddress.city || !shippingAddress.state || !shippingAddress.pincode) {
      setSnackbar({ open: true, message: 'Please fill all address fields', severity: 'warning' });
      return;
    }

    try {
      // Prepare order items
      const orderItems = cartItems.map(item => ({
        productId: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.images?.[0] || ''
      }));

      const orderData = {
        userId: user.id,
        items: orderItems,
        shippingAddress,
        paymentMethod,
        totalAmount: totalAmount,
        status: 'pending',
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'completed'
      };

      const response = await api.post('/api/orders', orderData);
      
      setOrderDetails(response.data);
      setOrderPlaced(true);
      setCheckoutDialog(false);
      
      // Clear cart after successful order
      clearCart();
      
      setSnackbar({ 
        open: true, 
        message: '🎉 Your order has been placed successfully!', 
        severity: 'success' 
      });
    } catch (error) {
      console.error('Order placement error:', error);
      setSnackbar({ 
        open: true, 
        message: error.response?.data?.message || 'Failed to place order. Please try again.', 
        severity: 'error' 
      });
    }
  };

  const cartTotal = getCartTotal();
  const deliveryCharge = cartTotal > 500 ? 0 : 40;
  const totalAmount = cartTotal + deliveryCharge;
  const savings = cartItems.reduce((acc, item) => {
    const originalPrice = item.originalPrice || item.price;
    return acc + ((originalPrice - item.price) * item.quantity);
  }, 0);

  // Order tracking status steps
  const getOrderSteps = () => {
    const steps = ['Order Placed', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];
    return steps;
  };

  const getActiveStep = (status) => {
    const statusMap = {
      'pending': 0,
      'confirmed': 1,
      'processing': 2,
      'shipped': 3,
      'delivered': 4
    };
    return statusMap[status] || 0;
  };

  // If order is placed, show order tracking
  if (orderPlaced && orderDetails) {
    return (
      <Box sx={{ backgroundColor: '#f1f3f6', minHeight: '100vh', py: 3 }}>
        <Container maxWidth="lg">
          <Paper sx={{ p: 4 }}>
            {/* Success Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <CheckCircle sx={{ fontSize: 80, color: '#388e3c', mb: 2 }} />
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Order Placed Successfully!
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Order ID: #{orderDetails.id}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your order will be delivered soon
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Order Tracking */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Track Your Order
              </Typography>
              <Stepper activeStep={getActiveStep(orderDetails.status)} alternativeLabel sx={{ mt: 3 }}>
                {getOrderSteps().map((label, index) => (
                  <Step key={label}>
                    <StepLabel
                      StepIconProps={{
                        sx: {
                          '&.Mui-completed': { color: '#388e3c' },
                          '&.Mui-active': { color: '#2874f0' }
                        }
                      }}
                    >
                      {label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>

              <Box sx={{ mt: 3, p: 2, backgroundColor: '#e3f2fd', borderRadius: 1 }}>
                <Typography variant="body2" color="primary" fontWeight="bold">
                  Current Status: {orderDetails.status?.toUpperCase() || 'PENDING'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {orderDetails.status === 'pending' && 'Your order is waiting for admin confirmation'}
                  {orderDetails.status === 'confirmed' && 'Your order has been confirmed and will be processed soon'}
                  {orderDetails.status === 'processing' && 'Your order is being prepared for shipment'}
                  {orderDetails.status === 'shipped' && 'Your order is on the way!'}
                  {orderDetails.status === 'delivered' && 'Your order has been delivered. Thank you for shopping!'}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Order Details */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Shipping Address
                </Typography>
                <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="body2">{orderDetails.shippingAddress?.fullName}</Typography>
                  <Typography variant="body2">{orderDetails.shippingAddress?.phone}</Typography>
                  <Typography variant="body2">{orderDetails.shippingAddress?.addressLine}</Typography>
                  <Typography variant="body2">
                    {orderDetails.shippingAddress?.city}, {orderDetails.shippingAddress?.state} - {orderDetails.shippingAddress?.pincode}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Payment Details
                </Typography>
                <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="body2">
                    Payment Method: <strong>{orderDetails.paymentMethod?.toUpperCase() || 'COD'}</strong>
                  </Typography>
                  <Typography variant="body2">
                    Payment Status: <strong style={{ color: orderDetails.paymentStatus === 'completed' ? '#388e3c' : '#ff9800' }}>
                      {orderDetails.paymentStatus?.toUpperCase() || 'PENDING'}
                    </strong>
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 2, fontSize: 18, fontWeight: 'bold' }}>
                    Total Amount: ₹{(orderDetails.totalAmount || 0).toLocaleString()}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Action Buttons */}
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/orders')}
                sx={{ px: 4 }}
              >
                View All Orders
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  setOrderPlaced(false);
                  setOrderDetails(null);
                  navigate('/');
                }}
                sx={{ backgroundColor: '#2874f0', px: 4 }}
              >
                Continue Shopping
              </Button>
            </Box>
          </Paper>
        </Container>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          sx={{ mt: 2 }}
        >
          <Alert 
            severity={snackbar.severity} 
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            variant="filled"
            sx={{ 
              minWidth: '500px',
              fontSize: '1.35rem',
              fontWeight: 'bold',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
              '& .MuiAlert-message': {
                fontSize: '1.35rem',
                fontWeight: 'bold',
                padding: '10px 0'
              },
              '& .MuiAlert-icon': {
                fontSize: '2.5rem'
              }
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    );
  }

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
                  onClick={handleOpenCheckout}
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
          </Grid>
        </Grid>
      </Container>

      {/* Checkout Dialog */}
      <Dialog open={checkoutDialog} onClose={() => setCheckoutDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            Shipping & Payment Details
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Shipping Address
            </Typography>
            <TextField
              fullWidth
              label="Full Name"
              value={shippingAddress.fullName}
              onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Phone Number"
              value={shippingAddress.phone}
              onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Address Line"
              value={shippingAddress.addressLine}
              onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine: e.target.value })}
              multiline
              rows={2}
              required
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="City"
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="State"
                  value={shippingAddress.state}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                  required
                />
              </Grid>
            </Grid>
            <TextField
              fullWidth
              label="Pincode"
              value={shippingAddress.pincode}
              onChange={(e) => setShippingAddress({ ...shippingAddress, pincode: e.target.value })}
              required
            />

            <Divider sx={{ my: 2 }} />

            <FormControl component="fieldset">
              <FormLabel component="legend" sx={{ fontWeight: 'bold', mb: 1 }}>
                Payment Method
              </FormLabel>
              <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <FormControlLabel value="cod" control={<Radio />} label="Cash on Delivery (COD)" />
              </RadioGroup>
            </FormControl>

            <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Order Summary
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Total Amount:</Typography>
                <Typography variant="body2" fontWeight="bold">₹{totalAmount.toLocaleString()}</Typography>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setCheckoutDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handlePlaceOrder}
            sx={{ backgroundColor: '#fb641b', '&:hover': { backgroundColor: '#e55b16' } }}
          >
            Confirm Order
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ mt: 2 }}
      >
        <Alert 
          severity={snackbar.severity} 
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          variant="filled"
          sx={{ 
            minWidth: '500px',
            fontSize: '1.35rem',
            fontWeight: 'bold',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            '& .MuiAlert-message': {
              fontSize: '1.35rem',
              fontWeight: 'bold',
              padding: '10px 0'
            },
            '& .MuiAlert-icon': {
              fontSize: '2.5rem'
            }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CartScreen;
