import React, { useState, useEffect } from 'react';
import { Snackbar, Alert, Slide, Box, Typography, IconButton } from '@mui/material';
import { Close, LocalOffer, ShoppingCart, Whatshot } from '@mui/icons-material';

const SlideTransition = (props) => {
  return <Slide {...props} direction="left" />;
};

const NotificationToast = () => {
  const [notifications, setNotifications] = useState([]);
  const [currentNotification, setCurrentNotification] = useState(null);

  const toastMessages = [
    {
      severity: 'success',
      icon: <Whatshot />,
      title: '🔥 Hot Deal Alert!',
      message: '50% OFF on Electronics - Shop Now!',
      color: '#ff6b6b'
    },
    {
      severity: 'info',
      icon: <LocalOffer />,
      title: '⚡ Flash Sale Live!',
      message: 'Limited time offer - Hurry up!',
      color: '#4facfe'
    },
    {
      severity: 'warning',
      icon: <ShoppingCart />,
      title: '🎉 Special Discount!',
      message: 'Extra 20% OFF on your cart items',
      color: '#f093fb'
    },
    {
      severity: 'success',
      icon: <Whatshot />,
      title: '💎 Premium Sale!',
      message: 'Exclusive deals on branded products',
      color: '#26de81'
    },
    {
      severity: 'info',
      icon: <LocalOffer />,
      title: '🎁 Free Delivery!',
      message: 'Zero shipping charges today only',
      color: '#667eea'
    }
  ];

  useEffect(() => {
    // Show first notification after 3 seconds
    const initialTimer = setTimeout(() => {
      showRandomNotification();
    }, 3000);

    // Show new notification every 15 seconds
    const interval = setInterval(() => {
      showRandomNotification();
    }, 15000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  const showRandomNotification = () => {
    const randomToast = toastMessages[Math.floor(Math.random() * toastMessages.length)];
    setCurrentNotification(randomToast);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setCurrentNotification(null);
  };

  return (
    <Snackbar
      open={!!currentNotification}
      autoHideDuration={5000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      TransitionComponent={SlideTransition}
      sx={{ mb: 2, mr: 2 }}
    >
      {currentNotification && (
        <Alert
          onClose={handleClose}
          severity={currentNotification.severity}
          icon={currentNotification.icon}
          sx={{
            width: '350px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            borderRadius: 2,
            alignItems: 'center',
            background: `linear-gradient(135deg, ${currentNotification.color}20 0%, white 100%)`,
            border: `1px solid ${currentNotification.color}40`,
            '& .MuiAlert-icon': {
              color: currentNotification.color,
              fontSize: 28,
              animation: 'bounce 2s infinite',
              '@keyframes bounce': {
                '0%, 100%': { transform: 'translateY(0)' },
                '50%': { transform: 'translateY(-5px)' },
              },
            },
            '& .MuiAlert-message': {
              width: '100%',
            },
          }}
        >
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 'bold',
                color: currentNotification.color,
                mb: 0.5,
              }}
            >
              {currentNotification.title}
            </Typography>
            <Typography variant="body2" sx={{ color: '#555' }}>
              {currentNotification.message}
            </Typography>
          </Box>
        </Alert>
      )}
    </Snackbar>
  );
};

export default NotificationToast;
