import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Chip,
  Button,
  Card,
  CardContent,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress
} from '@mui/material';
import {
  ShoppingBag,
  LocalShipping,
  CheckCircle,
  Schedule,
  Cancel
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const OrderHistoryScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsDialog, setDetailsDialog] = useState(false);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'warning',
      'confirmed': 'info',
      'processing': 'primary',
      'shipped': 'secondary',
      'delivered': 'success',
      'cancelled': 'error'
    };
    return colors[status] || 'default';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'pending': <Schedule />,
      'confirmed': <CheckCircle />,
      'processing': <ShoppingBag />,
      'shipped': <LocalShipping />,
      'delivered': <CheckCircle />,
      'cancelled': <Cancel />
    };
    return icons[status] || <ShoppingBag />;
  };

  const getOrderSteps = () => {
    return ['Order Placed', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];
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

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setDetailsDialog(true);
  };

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Please login to view your orders
        </Typography>
        <Button variant="contained" onClick={() => navigate('/login')} sx={{ mt: 2 }}>
          Login
        </Button>
      </Container>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        My Orders
      </Typography>

      {orders.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', mt: 3 }}>
          <ShoppingBag sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No orders yet
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Looks like you haven't placed any orders yet
          </Typography>
          <Button variant="contained" onClick={() => navigate('/')} sx={{ mt: 2 }}>
            Start Shopping
          </Button>
        </Paper>
      ) : (
        <Box sx={{ mt: 3 }}>
          {orders.map((order) => (
            <Card key={order.id} sx={{ mb: 3, boxShadow: 3 }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={3}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Order ID
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      #{order.id}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(order.createdAt || order.orderDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Items
                    </Typography>
                    <Typography variant="body1">
                      {order.items?.length || 0} item(s)
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={2}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Total Amount
                    </Typography>
                    <Typography variant="body1" fontWeight="bold" color="primary">
                      ₹{(order.totalAmount || 0).toLocaleString()}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={2}>
                    <Chip
                      icon={getStatusIcon(order.status)}
                      label={order.status?.toUpperCase() || 'PENDING'}
                      color={getStatusColor(order.status)}
                      size="medium"
                    />
                  </Grid>

                  <Grid item xs={12} md={2}>
                    <Button
                      variant="outlined"
                      size="small"
                      fullWidth
                      onClick={() => viewOrderDetails(order)}
                    >
                      View Details
                    </Button>
                  </Grid>
                </Grid>

                {order.items && order.items.length > 0 && (
                  <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                    <Grid container spacing={1}>
                      {order.items.slice(0, 3).map((item, index) => (
                        <Grid item key={index} xs={4} sm={2}>
                          <Box
                            component="img"
                            src={item.image || 'https://via.placeholder.com/100'}
                            alt={item.name}
                            sx={{
                              width: '100%',
                              height: 80,
                              objectFit: 'cover',
                              borderRadius: 1,
                              border: '1px solid #e0e0e0'
                            }}
                          />
                        </Grid>
                      ))}
                      {order.items.length > 3 && (
                        <Grid item xs={4} sm={2}>
                          <Box
                            sx={{
                              width: '100%',
                              height: 80,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: '#f5f5f5',
                              borderRadius: 1,
                              border: '1px solid #e0e0e0'
                            }}
                          >
                            <Typography variant="body2" color="text.secondary">
                              +{order.items.length - 3} more
                            </Typography>
                          </Box>
                        </Grid>
                      )}
                    </Grid>
                  </Box>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Order Details Dialog */}
      <Dialog
        open={detailsDialog}
        onClose={() => setDetailsDialog(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedOrder && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Order Details</Typography>
                <Chip
                  icon={getStatusIcon(selectedOrder.status)}
                  label={selectedOrder.status?.toUpperCase() || 'PENDING'}
                  color={getStatusColor(selectedOrder.status)}
                />
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              {/* Order Tracking */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Order Tracking
                </Typography>
                <Stepper activeStep={getActiveStep(selectedOrder.status)} alternativeLabel>
                  {getOrderSteps().map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Order Items */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Items Ordered
                </Typography>
                {selectedOrder.items?.map((item, index) => (
                  <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2, p: 2, backgroundColor: '#f9f9f9', borderRadius: 1 }}>
                    <Box
                      component="img"
                      src={item.image || 'https://via.placeholder.com/80'}
                      alt={item.name}
                      sx={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 1 }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body1" fontWeight="bold">
                        {item.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Quantity: {item.quantity}
                      </Typography>
                      <Typography variant="body2" color="primary" fontWeight="bold">
                        ₹{(item.price || 0).toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Shipping Address */}
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Shipping Address
                  </Typography>
                  <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                    <Typography variant="body2">{selectedOrder.shippingAddress?.fullName || 'N/A'}</Typography>
                    <Typography variant="body2">{selectedOrder.shippingAddress?.phone || 'N/A'}</Typography>
                    <Typography variant="body2">{selectedOrder.shippingAddress?.addressLine || 'N/A'}</Typography>
                    <Typography variant="body2">
                      {selectedOrder.shippingAddress?.city || 'N/A'}, {selectedOrder.shippingAddress?.state || 'N/A'} - {selectedOrder.shippingAddress?.pincode || 'N/A'}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Payment Details
                  </Typography>
                  <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                    <Typography variant="body2">
                      Payment Method: <strong>{selectedOrder.paymentMethod?.toUpperCase() || 'COD'}</strong>
                    </Typography>
                    <Typography variant="body2">
                      Payment Status: <strong style={{ color: selectedOrder.paymentStatus === 'completed' ? '#388e3c' : '#ff9800' }}>
                        {selectedOrder.paymentStatus?.toUpperCase() || 'PENDING'}
                      </strong>
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 2, fontSize: 18, fontWeight: 'bold' }}>
                      Total Amount: ₹{(selectedOrder.totalAmount || 0).toLocaleString()}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailsDialog(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default OrderHistoryScreen;
