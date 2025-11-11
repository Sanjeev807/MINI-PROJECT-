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
  const [searchQuery, setSearchQuery] = useState('');

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
                    border: 'none',
                  },
                },
              }}
            />
          </form>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {/* Right Section - Login/Profile & Cart */}
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
