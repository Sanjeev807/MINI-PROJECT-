import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  Paper,
  Divider,
  Link,
  Alert,
} from '@mui/material';
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import Loader from '../components/Loader';
import NotificationWelcomeDialog from '../components/NotificationWelcomeDialog';
import { validateEmail, validatePassword } from '../utils/helpers';
import './LoginScreen.css';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showNotificationDialog, setShowNotificationDialog] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!email || !password) {
      setError('Please fill all fields');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email');
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      // Check if user should see notification setup
      const hasSeenNotificationSetup = localStorage.getItem('notificationSetupSeen');
      const shouldShowNotifications = !hasSeenNotificationSetup && Notification.permission !== 'granted';
      
      // Redirect admin users to admin dashboard
      if (result.user && result.user.role === 'admin') {
        navigate('/admin');
      } else {
        if (shouldShowNotifications) {
          setShowNotificationDialog(true);
        } else {
          navigate('/');
        }
      }
    } else {
      setError(result.message || 'Login failed');
    }
  };

  const handleNotificationDialogClose = () => {
    setShowNotificationDialog(false);
    navigate('/');
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="login-screen">
      <Container maxWidth="sm">
        <Box className="login-container">
          <Paper elevation={3} className="login-paper">
            <Box className="login-header">
              <Typography variant="h3" className="logo">
                ShopApp
              </Typography>
              <Typography variant="h6" className="subtitle">
                Login to your account
              </Typography>
            </Box>

            <form onSubmit={handleLogin} className="login-form">
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                variant="outlined"
                autoComplete="email"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                variant="outlined"
                autoComplete="current-password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box className="forgot-password-container">
                <Link href="#" className="forgot-password-link">
                  Forgot Password?
                </Link>
              </Box>

              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                className="login-button"
              >
                Login
              </Button>

              <Divider sx={{ my: 3 }}>OR</Divider>

              <Box className="signup-container">
                <Typography variant="body1">
                  Don't have an account?{' '}
                  <Link
                    component="button"
                    type="button"
                    onClick={() => navigate('/register')}
                    className="signup-link"
                  >
                    Sign Up
                  </Link>
                </Typography>
              </Box>
            </form>
          </Paper>
        </Box>
      </Container>

      {/* Notification Welcome Dialog */}
      <NotificationWelcomeDialog 
        open={showNotificationDialog}
        onClose={handleNotificationDialogClose}
        userName={user?.name || 'User'}
      />
    </div>
  );
};

export default LoginScreen;
