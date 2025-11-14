import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Slide, Paper, Chip } from '@mui/material';
import { Close, LocalOffer, Bolt, Star, CardGiftcard } from '@mui/icons-material';

const PromotionalBanner = () => {
  const [open, setOpen] = useState(false);
  const [currentPromo, setCurrentPromo] = useState(null);

  const promotions = [
    {
      id: 1,
      icon: <Bolt sx={{ fontSize: 20 }} />,
      title: '🔥 Hot Deal!',
      message: 'Flat 50% Off on Electronics! Limited time offer',
      color: '#ff6b6b',
      bgColor: '#ffe3e3'
    },
    {
      id: 2,
      icon: <LocalOffer sx={{ fontSize: 20 }} />,
      title: '🎉 Big Sale Alert!',
      message: 'Get 70% OFF on Fashion & Accessories',
      color: '#f093fb',
      bgColor: '#fce4ff'
    },
    {
      id: 3,
      icon: <Star sx={{ fontSize: 20 }} />,
      title: '⚡ Flash Sale Live!',
      message: 'Upto 60% discount on Home & Living items',
      color: '#4facfe',
      bgColor: '#e3f4ff'
    },
    {
      id: 4,
      icon: <CardGiftcard sx={{ fontSize: 20 }} />,
      title: '🎁 Special Offer!',
      message: 'Extra 30% cashback on your first purchase',
      color: '#26de81',
      bgColor: '#d4ffe8'
    },
    {
      id: 5,
      icon: <Bolt sx={{ fontSize: 20 }} />,
      title: '📱 Trending Now!',
      message: 'New arrivals in Smartphones & Gadgets',
      color: '#667eea',
      bgColor: '#e8ebff'
    },
    {
      id: 6,
      icon: <LocalOffer sx={{ fontSize: 20 }} />,
      title: '🛍️ Weekend Special!',
      message: 'Buy 1 Get 1 Free on selected items',
      color: '#f5576c',
      bgColor: '#ffe8ec'
    },
    {
      id: 7,
      icon: <Star sx={{ fontSize: 20 }} />,
      title: '💎 Premium Collection!',
      message: 'Exclusive designer wear now available',
      color: '#9b59b6',
      bgColor: '#f3e5f5'
    },
    {
      id: 8,
      icon: <CardGiftcard sx={{ fontSize: 20 }} />,
      title: '🏃 Fitness Sale!',
      message: 'Up to 60% off on Sports & Fitness equipment',
      color: '#e74c3c',
      bgColor: '#fadbd8'
    },
    {
      id: 9,
      icon: <Bolt sx={{ fontSize: 20 }} />,
      title: '📚 Book Lovers Paradise!',
      message: 'Best-selling books at unbeatable prices',
      color: '#16a085',
      bgColor: '#d1f2eb'
    },
    {
      id: 10,
      icon: <LocalOffer sx={{ fontSize: 20 }} />,
      title: '🎮 Gamers Alert!',
      message: 'Hot deals on gaming consoles & accessories',
      color: '#3498db',
      bgColor: '#d6eaf8'
    },
    {
      id: 11,
      icon: <Star sx={{ fontSize: 20 }} />,
      title: '🌟 Mega Sale!',
      message: 'Amazing deals across all categories',
      color: '#f39c12',
      bgColor: '#fef5e7'
    },
    {
      id: 12,
      icon: <CardGiftcard sx={{ fontSize: 20 }} />,
      title: '🚚 Free Delivery!',
      message: 'Zero shipping charges on all orders today',
      color: '#27ae60',
      bgColor: '#d5f4e6'
    }
  ];

  useEffect(() => {
    // Show first notification after 2 seconds
    const initialTimer = setTimeout(() => {
      showRandomPromotion();
    }, 2000);

    // Show new notification every 12 seconds
    const interval = setInterval(() => {
      showRandomPromotion();
    }, 12000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  const showRandomPromotion = () => {
    const randomPromo = promotions[Math.floor(Math.random() * promotions.length)];
    setCurrentPromo(randomPromo);
    setOpen(true);

    // Auto hide after 6 seconds
    setTimeout(() => {
      setOpen(false);
    }, 6000);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (!currentPromo) return null;

  return (
    <Slide direction="down" in={open} mountOnEnter unmountOnExit>
      <Paper
        elevation={4}
        sx={{
          position: 'fixed',
          top: 70,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1300,
          maxWidth: '600px',
          width: '90%',
          borderRadius: 2,
          overflow: 'hidden',
          background: `linear-gradient(135deg, ${currentPromo.bgColor} 0%, white 100%)`,
          border: `2px solid ${currentPromo.color}`,
          boxShadow: `0 8px 24px rgba(0,0,0,0.2)`,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 2,
            position: 'relative',
          }}
        >
          {/* Icon */}
          <Box
            sx={{
              backgroundColor: currentPromo.color,
              color: 'white',
              borderRadius: '50%',
              width: 50,
              height: 50,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%': {
                  transform: 'scale(1)',
                  boxShadow: `0 0 0 0 ${currentPromo.color}80`,
                },
                '50%': {
                  transform: 'scale(1.05)',
                  boxShadow: `0 0 0 10px ${currentPromo.color}00`,
                },
                '100%': {
                  transform: 'scale(1)',
                  boxShadow: `0 0 0 0 ${currentPromo.color}00`,
                },
              },
            }}
          >
            {currentPromo.icon}
          </Box>

          {/* Content */}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 'bold',
                color: currentPromo.color,
                mb: 0.5,
                fontSize: '1rem',
              }}
            >
              {currentPromo.title}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#333',
                fontSize: '0.9rem',
              }}
            >
              {currentPromo.message}
            </Typography>
          </Box>

          {/* Offer Badge */}
          <Chip
            label="LIVE"
            size="small"
            sx={{
              backgroundColor: currentPromo.color,
              color: 'white',
              fontWeight: 'bold',
              fontSize: '0.75rem',
              animation: 'blink 1.5s infinite',
              '@keyframes blink': {
                '0%, 100%': { opacity: 1 },
                '50%': { opacity: 0.6 },
              },
            }}
          />

          {/* Close Button */}
          <IconButton
            onClick={handleClose}
            size="small"
            sx={{
              position: 'absolute',
              top: 4,
              right: 4,
              color: currentPromo.color,
              '&:hover': {
                backgroundColor: currentPromo.bgColor,
              },
            }}
          >
            <Close fontSize="small" />
          </IconButton>
        </Box>

        {/* Progress Bar */}
        <Box
          sx={{
            height: 4,
            width: '100%',
            backgroundColor: currentPromo.bgColor,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              height: '100%',
              backgroundColor: currentPromo.color,
              animation: 'progress 6s linear',
              '@keyframes progress': {
                '0%': { width: '100%' },
                '100%': { width: '0%' },
              },
            }}
          />
        </Box>
      </Paper>
    </Slide>
  );
};

export default PromotionalBanner;
