import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Avatar,
  Divider,
  LinearProgress,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  CircularProgress,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People,
  Inventory,
  Notifications,
  TrendingUp,
  ShoppingCart,
  AttachMoney,
  Send,
  Refresh,
  Analytics,
  BarChart,
  Logout,
  Campaign,
  Person,
  Email,
  LocalOffer,
  Search,
  Edit,
  Delete,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  // Check if user is admin
  useEffect(() => {
    console.log('Current user:', user); // Debug log
    if (!user) {
      console.log('No user, redirecting to login');
      navigate('/login');
    } else if (user.role !== 'admin') {
      console.log('User is not admin, role:', user.role);
      navigate('/');
    } else {
      console.log('Admin user verified:', user.email);
    }
  }, [user, navigate]);

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  
  // Product Management
  const [productDialog, setProductDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    images: '',
    rating: '4.5'
  });
  
  // Notification Dialog
  const [notificationDialog, setNotificationDialog] = useState(false);
  const [notificationType, setNotificationType] = useState('broadcast');
  const [notificationForm, setNotificationForm] = useState({
    title: '',
    message: '',
    discount: '',
    category: ''
  });
  
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      console.log('Fetching admin dashboard data...');
      
      // Fetch each endpoint separately to identify which one fails
      let statsData = null;
      let usersData = { users: [] };
      let productsData = { products: [] };
      let notificationsData = [];

      try {
        const statsRes = await api.get('/api/admin/stats');
        console.log('✅ Stats Response:', statsRes.data);
        statsData = statsRes.data;
      } catch (err) {
        console.error('❌ Stats Error:', err.response?.data || err.message);
      }

      try {
        const usersRes = await api.get('/api/admin/users?limit=10');
        console.log('✅ Users Response:', usersRes.data);
        usersData = usersRes.data;
      } catch (err) {
        console.error('❌ Users Error:', err.response?.data || err.message);
      }

      try {
        const productsRes = await api.get('/api/admin/products?limit=10');
        console.log('✅ Products Response:', productsRes.data);
        productsData = productsRes.data;
      } catch (err) {
        console.error('❌ Products Error:', err.response?.data || err.message);
      }

      try {
        const notificationsRes = await api.get('/api/admin/notifications/recent?limit=15');
        console.log('✅ Notifications Response:', notificationsRes.data);
        notificationsData = notificationsRes.data;
      } catch (err) {
        console.error('❌ Notifications Error:', err.response?.data || err.message);
      }

      setStats(statsData);
      setUsers(usersData.users || []);
      setProducts(productsData.products || []);
      setNotifications(notificationsData || []);

      console.log('📊 Final Stats State:', statsData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setSnackbar({ open: true, message: 'Failed to load dashboard data', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSendNotification = async (type) => {
    try {
      // Validate input
      if (!notificationForm.title || !notificationForm.message) {
        setSnackbar({ open: true, message: 'Please fill in title and message', severity: 'warning' });
        return;
      }

      const endpoint = type === 'broadcast' 
        ? '/api/admin/notifications/broadcast'
        : '/api/admin/notifications/offer';

      console.log(`📢 Sending ${type} notification to endpoint:`, endpoint);
      console.log('Notification data:', notificationForm);

      const response = await api.post(endpoint, {
        title: notificationForm.title,
        message: notificationForm.message,
        discount: notificationForm.discount || '',
        category: notificationForm.category || ''
      });

      console.log('✅ Notification sent successfully:', response.data);

      setSnackbar({ 
        open: true, 
        message: `${type === 'broadcast' ? 'Broadcast' : 'Promotional'} notification sent to ${response.data.recipientCount || 'all'} users!`, 
        severity: 'success' 
      });
      
      // Clear form
      setNotificationForm({ title: '', message: '', discount: '', category: '' });
      
      // Refresh dashboard data
      fetchDashboardData();
    } catch (error) {
      console.error('❌ Error sending notification:', error);
      console.error('Error response:', error.response?.data);
      setSnackbar({ 
        open: true, 
        message: error.response?.data?.message || 'Failed to send notification', 
        severity: 'error' 
      });
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      description: '',
      price: '',
      category: '',
      stock: '',
      images: '',
      rating: '4.5'
    });
    setProductDialog(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),
      images: Array.isArray(product.images) ? product.images.join(', ') : '',
      rating: product.rating?.toString() || '4.5'
    });
    setProductDialog(true);
  };

  const handleSaveProduct = async () => {
    try {
      const productData = {
        name: productForm.name,
        description: productForm.description,
        price: parseFloat(productForm.price),
        category: productForm.category,
        stock: parseInt(productForm.stock),
        images: productForm.images.split(',').map(img => img.trim()).filter(img => img),
        rating: parseFloat(productForm.rating) || 4.5
      };

      if (editingProduct) {
        // Update existing product
        await api.put(`/api/products/${editingProduct.id}`, productData);
        setSnackbar({ open: true, message: 'Product updated successfully!', severity: 'success' });
      } else {
        // Create new product
        await api.post('/api/products', productData);
        setSnackbar({ open: true, message: 'Product added successfully!', severity: 'success' });
      }

      setProductDialog(false);
      fetchDashboardData();
    } catch (error) {
      console.error('Error saving product:', error);
      setSnackbar({ open: true, message: 'Failed to save product', severity: 'error' });
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/api/products/${productId}`);
        setSnackbar({ open: true, message: 'Product deleted successfully!', severity: 'success' });
        fetchDashboardData();
      } catch (error) {
        console.error('Error deleting product:', error);
        setSnackbar({ open: true, message: 'Failed to delete product', severity: 'error' });
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="xl">
          {/* Header Section */}
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                🎯 Admin Dashboard
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Welcome back, {user?.name}! Here's what's happening with your store.
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={fetchDashboardData}
              sx={{ height: 'fit-content' }}
            >
              Refresh
            </Button>
          </Box>

          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="h4" fontWeight="bold">
                        {stats?.totalUsers || 0}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Total Users
                      </Typography>
                      <Chip
                        icon={<TrendingUp />}
                        label={`+${stats?.growth?.users || 0}%`}
                        size="small"
                        sx={{ mt: 1, backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                      />
                    </Box>
                    <People sx={{ fontSize: 60, opacity: 0.3 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="h4" fontWeight="bold">
                        {stats?.totalProducts || 0}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Total Products
                      </Typography>
                      <Chip
                        label="Active"
                        size="small"
                        sx={{ mt: 1, backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                      />
                    </Box>
                    <Inventory sx={{ fontSize: 60, opacity: 0.3 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="h4" fontWeight="bold">
                        {stats?.totalNotifications || 0}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Notifications
                      </Typography>
                      <Chip
                        icon={<TrendingUp />}
                        label={`+${stats?.recent?.notifications || 0} today`}
                        size="small"
                        sx={{ mt: 1, backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                      />
                    </Box>
                    <Notifications sx={{ fontSize: 60, opacity: 0.3 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="h4" fontWeight="bold">
                        {stats?.activeSessions || 0}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Active Sessions
                      </Typography>
                      <Chip
                        label="Live"
                        size="small"
                        sx={{ mt: 1, backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                      />
                    </Box>
                    <Analytics sx={{ fontSize: 60, opacity: 0.3 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Tabs Section */}
          <Paper sx={{ mb: 3 }}>
            <Tabs
              value={tabValue}
              onChange={(e, newValue) => setTabValue(newValue)}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab icon={<DashboardIcon />} label="Overview" />
              <Tab icon={<People />} label="Users" />
              <Tab icon={<Inventory />} label="Products" />
              <Tab icon={<Notifications />} label="Notifications" />
              <Tab icon={<Campaign />} label="Send Notification" />
            </Tabs>
          </Paper>

          {/* Tab Content */}
          {tabValue === 0 && (
            <Grid container spacing={3}>
              {/* Recent Users */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    👥 Recent Users
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell>Email</TableCell>
                          <TableCell>Joined</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {users.slice(0, 5).map((user) => (
                          <TableRow key={user.id} hover>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Avatar sx={{ width: 32, height: 32, bgcolor: '#2874f0' }}>
                                  {user.name?.charAt(0).toUpperCase()}
                                </Avatar>
                                {user.name}
                              </Box>
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              {new Date(user.createdAt).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>

              {/* Recent Notifications */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    🔔 Recent Notifications
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                    {notifications.length === 0 ? (
                      <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="body2" color="text.secondary">
                          No notifications yet
                        </Typography>
                      </Box>
                    ) : (
                      notifications.slice(0, 5).map((notif) => (
                        <Box
                          key={notif.id}
                          sx={{
                            p: 2,
                            mb: 1,
                            backgroundColor: '#f9f9f9',
                            borderRadius: 1,
                            borderLeft: '4px solid #2874f0'
                          }}
                        >
                          <Typography variant="subtitle2" fontWeight="bold">
                            {notif.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12 }}>
                            {notif.body}
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                            <Chip label={notif.type} size="small" variant="outlined" />
                            <Typography variant="caption" color="text.secondary">
                              {new Date(notif.createdAt).toLocaleString()}
                            </Typography>
                          </Box>
                        </Box>
                      ))
                    )}
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          )}

          {tabValue === 1 && (
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">
                  👥 All Users ({stats?.totalUsers || 0})
                </Typography>
                <TextField
                  size="small"
                  placeholder="Search users..."
                  InputProps={{
                    startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell><strong>User</strong></TableCell>
                      <TableCell><strong>Email</strong></TableCell>
                      <TableCell><strong>Role</strong></TableCell>
                      <TableCell><strong>Joined</strong></TableCell>
                      <TableCell><strong>Status</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: '#667eea' }}>
                              {user.name?.charAt(0).toUpperCase()}
                            </Avatar>
                            <Typography>{user.name}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Chip
                            label={user.role || 'user'}
                            size="small"
                            color={user.role === 'admin' ? 'secondary' : 'default'}
                          />
                        </TableCell>
                        <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Chip label="Active" size="small" color="success" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}

          {tabValue === 2 && (
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">
                  📦 All Products ({stats?.totalProducts || 0})
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<Inventory />}
                  onClick={handleAddProduct}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5568d3 0%, #63408b 100%)',
                    }
                  }}
                >
                  Add Product
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell><strong>Product</strong></TableCell>
                      <TableCell><strong>Category</strong></TableCell>
                      <TableCell><strong>Price</strong></TableCell>
                      <TableCell><strong>Stock</strong></TableCell>
                      <TableCell><strong>Rating</strong></TableCell>
                      <TableCell align="center"><strong>Actions</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <img
                              src={product.images?.[0] || 'https://via.placeholder.com/50'}
                              alt={product.name}
                              style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
                            />
                            <Typography>{product.name}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip label={product.category} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell>₹{product.price.toLocaleString()}</TableCell>
                        <TableCell>
                          <Chip
                            label={`${product.stock} in stock`}
                            size="small"
                            color={product.stock > 10 ? 'success' : 'warning'}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            {product.rating} ⭐
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                            <IconButton
                              size="small"
                              onClick={() => handleEditProduct(product)}
                              sx={{ color: '#2874f0' }}
                            >
                              <Edit />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteProduct(product.id)}
                              sx={{ color: '#f5576c' }}
                            >
                              <Delete />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}

          {tabValue === 3 && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                🔔 Notification History
              </Typography>
              <Divider sx={{ mb: 3 }} />
              {notifications.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Notifications sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No Notifications Yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Notifications sent to users will appear here
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={2}>
                  {notifications.map((notif) => (
                    <Grid item xs={12} md={6} key={notif.id}>
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 2,
                          borderLeft: '4px solid',
                          borderLeftColor: 
                            notif.type === 'promotion' ? '#ff9800' :
                            notif.type === 'order_placed' ? '#4caf50' :
                            notif.type === 'login_alert' ? '#2196f3' : '#9e9e9e'
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {notif.title}
                          </Typography>
                          <Chip label={notif.type} size="small" />
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {notif.body}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Person sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            User ID: {notif.userId}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                            {new Date(notif.createdAt).toLocaleString()}
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Paper>
          )}

          {tabValue === 4 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    📢 Broadcast Notification
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Send announcement to all users
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                      fullWidth
                      label="Title"
                      placeholder="Important Announcement"
                      value={notificationForm.title}
                      onChange={(e) => setNotificationForm({ ...notificationForm, title: e.target.value })}
                    />
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Message"
                      placeholder="Enter your announcement message here..."
                      value={notificationForm.message}
                      onChange={(e) => setNotificationForm({ ...notificationForm, message: e.target.value })}
                    />
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      startIcon={<Campaign />}
                      onClick={() => handleSendNotification('broadcast')}
                      disabled={!notificationForm.title || !notificationForm.message}
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    >
                      Send to All Users
                    </Button>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    🎁 Promotional Offer
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Send special offers and discounts
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                      fullWidth
                      label="Offer Title"
                      placeholder="Flash Sale - 50% OFF"
                      value={notificationForm.title}
                      onChange={(e) => setNotificationForm({ ...notificationForm, title: e.target.value })}
                    />
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Offer Message"
                      placeholder="Limited time offer! Get huge discounts..."
                      value={notificationForm.message}
                      onChange={(e) => setNotificationForm({ ...notificationForm, message: e.target.value })}
                    />
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="Discount %"
                          placeholder="50"
                          type="number"
                          value={notificationForm.discount}
                          onChange={(e) => setNotificationForm({ ...notificationForm, discount: e.target.value })}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="Category"
                          placeholder="Electronics"
                          value={notificationForm.category}
                          onChange={(e) => setNotificationForm({ ...notificationForm, category: e.target.value })}
                        />
                      </Grid>
                    </Grid>
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      startIcon={<LocalOffer />}
                      onClick={() => handleSendNotification('offer')}
                      disabled={!notificationForm.title || !notificationForm.message}
                      sx={{
                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    >
                      Send Promotional Offer
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          )}
        </Container>
      </Box>

      {/* Product Dialog */}
      <Dialog 
        open={productDialog} 
        onClose={() => setProductDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingProduct ? '✏️ Edit Product' : '➕ Add New Product'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              fullWidth
              label="Product Name"
              placeholder="e.g., Smart TV 55 inch"
              value={productForm.name}
              onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
              required
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              placeholder="Detailed product description..."
              value={productForm.description}
              onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
              required
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Price (₹)"
                  type="number"
                  placeholder="29999"
                  value={productForm.price}
                  onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Stock Quantity"
                  type="number"
                  placeholder="50"
                  value={productForm.stock}
                  onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                  required
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Category"
                  placeholder="Electronics"
                  value={productForm.category}
                  onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Rating"
                  type="number"
                  placeholder="4.5"
                  value={productForm.rating}
                  onChange={(e) => setProductForm({ ...productForm, rating: e.target.value })}
                  inputProps={{ min: 0, max: 5, step: 0.1 }}
                />
              </Grid>
            </Grid>
            <TextField
              fullWidth
              label="Image URLs"
              placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
              helperText="Enter multiple image URLs separated by commas"
              value={productForm.images}
              onChange={(e) => setProductForm({ ...productForm, images: e.target.value })}
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProductDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleSaveProduct}
            disabled={!productForm.name || !productForm.price || !productForm.category}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5568d3 0%, #63408b 100%)',
              }
            }}
          >
            {editingProduct ? 'Update Product' : 'Add Product'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AdminDashboard;
