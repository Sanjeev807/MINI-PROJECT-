import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  LocationOn,
  Edit,
  PowerSettingsNew,
  ShoppingBag,
  Favorite,
  AccountCircle,
  Security,
  Payment,
  Notifications,
  Help,
  KeyboardArrowRight,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import NotificationSetup from '../components/NotificationSetup';

const ProfileScreen = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    if (user) {
      setEditedUser({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleEditProfile = () => {
    setEditDialogOpen(true);
  };

  const handleSaveProfile = () => {
    updateUser(editedUser);
    setEditDialogOpen(false);
  };

  const handleChange = (field) => (e) => {
    setEditedUser({ ...editedUser, [field]: e.target.value });
  };

  const menuItems = [
    { icon: <ShoppingBag />, text: 'My Orders', path: '/orders', badge: null },
    { icon: <Favorite />, text: 'Wishlist', path: '/wishlist', badge: null },
    { icon: <AccountCircle />, text: 'Account Settings', action: handleEditProfile },
    { icon: <Payment />, text: 'Payment Methods', path: '/payments' },
    { icon: <LocationOn />, text: 'My Addresses', path: '/addresses' },
    { icon: <Notifications />, text: 'Notifications', path: '/notifications' },
    { icon: <Security />, text: 'Privacy & Security', path: '/security' },
    { icon: <Help />, text: 'Help & Support', path: '/help' },
  ];

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ mt: 8, mb: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Please Login
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            You need to login to view your profile
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/login')}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              px: 4,
              py: 1.5,
            }}
          >
            Login Now
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Left Sidebar - User Info */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: 2,
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  margin: '0 auto 16px',
                  bgcolor: 'white',
                  color: '#667eea',
                  fontSize: '3rem',
                  fontWeight: 'bold',
                  border: '4px solid rgba(255,255,255,0.3)',
                }}
              >
                {user.name?.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                {user.name}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
                {user.email}
              </Typography>
              <Chip
                label={user.role === 'admin' ? 'Admin' : 'Customer'}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 'bold',
                }}
              />
            </Box>

            <Divider sx={{ my: 3, bgcolor: 'rgba(255,255,255,0.2)' }} />

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Email sx={{ mr: 2, opacity: 0.8 }} />
              <Box>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Email
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {user.email}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Phone sx={{ mr: 2, opacity: 0.8 }} />
              <Box>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Phone
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {user.phone || 'Not provided'}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocationOn sx={{ mr: 2, opacity: 0.8 }} />
              <Box>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Address
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {user.address || 'Not provided'}
                </Typography>
              </Box>
            </Box>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<Edit />}
              onClick={handleEditProfile}
              sx={{
                mt: 3,
                color: 'white',
                borderColor: 'white',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              Edit Profile
            </Button>
          </Paper>
        </Grid>

        {/* Right Side - Menu Options */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Box
              sx={{
                p: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Account & Settings
              </Typography>
            </Box>

            <List sx={{ p: 0 }}>
              {menuItems.map((item, index) => (
                <React.Fragment key={index}>
                  <ListItem
                    button
                    onClick={() => {
                      if (item.action) {
                        item.action();
                      } else if (item.path) {
                        navigate(item.path);
                      }
                    }}
                    sx={{
                      py: 2,
                      px: 3,
                      '&:hover': {
                        bgcolor: '#f8f9ff',
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: '#667eea', minWidth: 48 }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontWeight: 500,
                        fontSize: '0.95rem',
                      }}
                    />
                    {item.badge && (
                      <Chip
                        label={item.badge}
                        size="small"
                        sx={{
                          bgcolor: '#667eea',
                          color: 'white',
                          fontWeight: 'bold',
                          mr: 1,
                        }}
                      />
                    )}
                    <KeyboardArrowRight sx={{ color: '#aaa' }} />
                  </ListItem>
                  {index < menuItems.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>

          {/* Logout Button */}
          <Paper elevation={2} sx={{ mt: 2, borderRadius: 2, overflow: 'hidden' }}>
            <ListItem
              button
              onClick={handleLogout}
              sx={{
                py: 2,
                px: 3,
                '&:hover': {
                  bgcolor: '#ffebee',
                },
              }}
            >
              <ListItemIcon sx={{ color: '#f44336', minWidth: 48 }}>
                <PowerSettingsNew />
              </ListItemIcon>
              <ListItemText
                primary="Logout"
                primaryTypographyProps={{
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  color: '#f44336',
                }}
              />
            </ListItem>
          </Paper>

          {/* Notification Setup Section */}
          <Box sx={{ mt: 2 }}>
            <NotificationSetup />
          </Box>

          {/* Quick Stats */}
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={4}>
              <Card
                sx={{
                  textAlign: 'center',
                  p: 2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  0
                </Typography>
                <Typography variant="caption">Orders</Typography>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card
                sx={{
                  textAlign: 'center',
                  p: 2,
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  color: 'white',
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  0
                </Typography>
                <Typography variant="caption">Wishlist</Typography>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card
                sx={{
                  textAlign: 'center',
                  p: 2,
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  color: 'white',
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  ₹0
                </Typography>
                <Typography variant="caption">Total Spent</Typography>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Edit Profile Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
          Edit Profile
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Full Name"
            value={editedUser.name}
            onChange={handleChange('name')}
            margin="normal"
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Email"
            value={editedUser.email}
            onChange={handleChange('email')}
            margin="normal"
            variant="outlined"
            disabled
          />
          <TextField
            fullWidth
            label="Phone Number"
            value={editedUser.phone}
            onChange={handleChange('phone')}
            margin="normal"
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Address"
            value={editedUser.address}
            onChange={handleChange('address')}
            margin="normal"
            variant="outlined"
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setEditDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleSaveProfile}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              px: 3,
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProfileScreen;
