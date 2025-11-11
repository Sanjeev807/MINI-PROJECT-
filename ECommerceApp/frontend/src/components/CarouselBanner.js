import React, { useState, useEffect } from 'react';
import { Box, IconButton, Button, Typography } from '@mui/material';
import { ChevronLeft, ChevronRight, ShoppingBag, LocalOffer } from '@mui/icons-material';
import './CarouselBanner.css';

const CarouselBanner = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const banners = [
    {
      title: 'Welcome to E-Shop!',
      subtitle: 'Discover amazing deals on your favorite products',
      gradient: 'transparent',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&h=500&fit=crop',
      color: '#fff'
    },
    {
      title: 'Shop the Latest Electronics',
      subtitle: 'Amazing deals on laptops, phones & more',
      gradient: 'transparent',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1600&h=500&fit=crop',
      color: '#fff'
    },
    {
      title: 'Exclusive Fashion Offers',
      subtitle: 'Up to 70% off on trending styles',
      gradient: 'transparent',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1600&h=500&fit=crop',
      color: '#fff'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToPrevious = () => {
    setActiveIndex((current) => (current - 1 + banners.length) % banners.length);
  };

  const goToNext = () => {
    setActiveIndex((current) => (current + 1) % banners.length);
  };

  return (
    <Box className="carousel-container">
      <Box className="carousel-slide" sx={{ background: banners[activeIndex].gradient }}>
        {/* Background Image */}
        <Box
          className="carousel-background"
          sx={{
            backgroundImage: `url(${banners[activeIndex].image})`,
          }}
        />
        
        {/* Dark overlay for better text contrast - using gradient */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.5) 100%)',
            zIndex: 1.5,
          }}
        />

        {/* Content */}
        <Box className="carousel-content">
          <Typography 
            className="carousel-title"
            sx={{ color: banners[activeIndex].color || 'white' }}
          >
            {banners[activeIndex].title}
          </Typography>
          
          {banners[activeIndex].subtitle && (
            <Typography 
              sx={{ 
                fontSize: { xs: '1.1rem', md: '1.35rem' },
                color: banners[activeIndex].color || 'white',
                mb: 3,
                textShadow: '2px 2px 6px rgba(0,0,0,0.4)',
                fontWeight: 500,
                lineHeight: 1.5
              }}
            >
              {banners[activeIndex].subtitle}
            </Typography>
          )}

          <Box className="carousel-buttons">
            <Button
              variant="contained"
              size="large"
              startIcon={<ShoppingBag />}
              className="carousel-button-primary"
            >
              🛒 Start Shopping
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<LocalOffer />}
              className="carousel-button-secondary"
            >
              🏷️ View Deals
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="carousel-nav-button carousel-nav-left"
        aria-label="Previous slide"
      >
        <ChevronLeft sx={{ fontSize: 32 }} />
      </button>

      <button
        onClick={goToNext}
        className="carousel-nav-button carousel-nav-right"
        aria-label="Next slide"
      >
        <ChevronRight sx={{ fontSize: 32 }} />
      </button>

      {/* Dots Indicator */}
      <Box className="carousel-dots">
        {banners.map((_, index) => (
          <Box
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`carousel-dot ${index === activeIndex ? 'active' : ''}`}
          />
        ))}
      </Box>
    </Box>
  );
};

export default CarouselBanner;
