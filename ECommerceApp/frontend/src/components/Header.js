import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  TextField,
  Box,
  InputAdornment,
  Menu,
  MenuItem,
  Avatar,
  Button,
} from '@mui/material';
import {
  Search,
  ShoppingCart,
  AccountCircle,
  ArrowBack,
  Person,
  Notifications,
} from '@mui/icons-material';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import './Header.css';

const Header = ({
  showCart = true,
  onBackPress,
  showBack = false,
}) => {
  const { getCartCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const cartCount = getCartCount();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: '🟢 Order Placed Successfully!',
  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;  isRead: false,
      type: 'order_placed'
    },
    {
      id: 2,
      title: '🎉 Special Offer: 20% off on Electronics!',
      body: 'Limited time offer on all electronics. Shop now!',
      createdAt: new Date(Date.now() - 1000 * 60 * 30),
      isRead: false,
      type: 'promotion'
    }
  ]);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    handleProfileMenuClose();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results or filter products
      console.log('Searching for:', searchQuery);
    }
  };

  return (
    <AppBar position="sticky" className="header">
      <Toolbar className="toolbar">
        {showBack && (
          <IconButton
            edge="start"
            color="inherit"
            onClick={onBackPress}
            sx={{ mr: 2 }}
          >
            <ArrowBack />
          </IconButton>
        )}

        {/* Logo Section */}
        <Box 
          className="logo-container" 
          onClick={() => navigate('/')}
          sx={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', mr: 4 }}
        >
          <Typography variant="h5" className="logo-title">
            E-Shop
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography className="explore-text">
              Explore
            </Typography>
            <Typography className="plus-text">
              Plus
            </Typography>
          </Box>
        </Box>

        {/* Search Bar */}
        <Box className="search-container">
          <form onSubmit={handleSearch} style={{ width: '100%' }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search for products, brands and more..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="small"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton type="submit" edge="end" sx={{ color: '#2874f0' }}>
                      <Search />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  backgroundColor: 'white',
                  borderRadius: 1,
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        {/* Right Section - Login/Profile & Cart */}
        <Box className="header-icons">
          {user ? (
            <>
              {/* Notifications Icon */}
              <IconButton 
                color="inherit" 
                onClick={handleNotificationMenuOpen}
                sx={{ mr: 1 }}
              >
                <Badge badgeContent={unreadCount} color="error">
                  <Notifications sx={{ fontSize: 28 }} />
                </Badge>
              </IconButton>

              <Menu
                anchorEl={notificationAnchorEl}
                open={Boolean(notificationAnchorEl)}
                onClose={handleNotificationMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                PaperProps={{
                  sx: {
                    width: 380,
                    maxHeight: 500,
                    overflow: 'auto',
                  }
                }}
              >
                <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
                  <Typography variant="h6" fontWeight="bold">
                    Notifications
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {unreadCount} unread
                  </Typography>
                </Box>

                {notifications.length === 0 ? (
                  <Box sx={{ p: 4, textAlign: 'center' }}>
                    <Notifications sx={{ fontSize: 48, color: '#ccc', mb: 1 }} />
                    <Typography color="text.secondary">
                      No notifications yet
                    </Typography>
                  </Box>
                ) : (
                  notifications.map((notification) => (
                    <MenuItem
                      key={notification.id}
                      onClick={handleNotificationMenuClose}
                      sx={{
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        borderBottom: '1px solid #f0f0f0',
                        backgroundColor: !notification.isRead ? '#f8f9ff' : 'transparent',
                        '&:hover': {
                          backgroundColor: !notification.isRead ? '#eff1ff' : '#f5f5f5',
                        },
                        py: 1.5,
                        px: 2,
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 0.5 }}>
                        {notification.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        {notification.body}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(notification.createdAt).toLocaleString()}
                      </Typography>
                    </MenuItem>
                  ))
                )}

                <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0', textAlign: 'center' }}>
                  <Button
                    size="small"
                    onClick={() => {
                      handleNotificationMenuClose();
                      // Navigate to all notifications page
                    }}
                    sx={{ textTransform: 'none', color: '#2874f0' }}
                  >
                    View All Notifications
                  </Button>
                </Box>
              </Menu>

              <IconButton color="inherit" onClick={handleProfileMenuOpen}>
                {user?.avatar ? (
                  <Avatar src={user.avatar} sx={{ width: 32, height: 32 }} />
                ) : (
                  <AccountCircle sx={{ fontSize: 28 }} />
                )}
              </IconButton> Login/Profile & Cart */}
        <Box className="header-icons">
          {user ? (
            <>
              <IconButton color="inherit" onClick={handleProfileMenuOpen}>
                {user?.avatar ? (
                  <Avatar src={user.avatar} sx={{ width: 32, height: 32 }} />
                ) : (
                  <AccountCircle sx={{ fontSize: 28 }} />
                )}
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleProfileMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem onClick={() => { navigate('/profile'); handleProfileMenuClose(); }}>
                  Profile
                </MenuItem>
                <MenuItem onClick={() => { navigate('/orders'); handleProfileMenuClose(); }}>
                  My Orders
                </MenuItem>
                <MenuItem onClick={() => { navigate('/wishlist'); handleProfileMenuClose(); }}>
                  Wishlist
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <Button 
              variant="contained" 
              onClick={() => navigate('/login')}
              startIcon={<Person />}
              sx={{ 
                backgroundColor: 'white',
                color: '#2874f0',
                fontWeight: 'bold',
                textTransform: 'none',
                px: 3,
                borderRadius: 1,
                '&:hover': {
                  backgroundColor: '#f0f0f0',
                },
              }}
            >
              Login
            </Button>
          )}

          {showCart && (
            <IconButton 
              color="inherit" 
              onClick={() => navigate('/cart')}
              sx={{ ml: 2 }}
            >
              <Badge badgeContent={cartCount} color="error">
                <ShoppingCart sx={{ fontSize: 28 }} />
              </Badge>
            </IconButton>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
