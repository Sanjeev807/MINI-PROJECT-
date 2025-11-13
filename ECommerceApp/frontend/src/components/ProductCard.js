import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Box, Chip, IconButton, Snackbar, Alert } from '@mui/material';
import { ShoppingCart, Star, Favorite, FavoriteBorder } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const isWishlisted = isInWishlist(product.id || product._id);

  const discountPercent = product.originalPrice 
    ? Math.round(((Number(product.originalPrice) - Number(product.price)) / Number(product.originalPrice)) * 100)
    : 0;

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    const result = await addToCart(product);
    setSnackbar({
      open: true,
      message: result.message || 'Added to cart!',
      severity: result.success ? 'success' : 'error'
    });
  };

  const handleWishlistToggle = async (e) => {
    e.stopPropagation();
    if (isWishlisted) {
      const result = await removeFromWishlist(product.id || product._id);
      setSnackbar({
        open: true,
        message: result.message || 'Removed from wishlist',
        severity: 'info'
      });
    } else {
      const result = await addToWishlist(product);
      setSnackbar({
        open: true,
        message: result.message || 'Added to wishlist!',
        severity: result.success ? 'success' : 'warning'
      });
    }
  };

  return (
    <>
      <Card 
        className="product-card"
        onClick={() => navigate(`/product/${product.id || product._id}`)}
      >
        <Box className="product-image-container">
          <CardMedia
            component="img"
            image={product.images?.[0] || product.image || 'https://via.placeholder.com/300'}
            alt={product.name}
            className="product-image"
          />
          
          {/* Wishlist Heart Icon */}
          <IconButton
            className="wishlist-icon"
            onClick={handleWishlistToggle}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'white',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.9)',
              },
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            {isWishlisted ? (
              <Favorite sx={{ color: '#f44336' }} />
            ) : (
              <FavoriteBorder sx={{ color: '#666' }} />
            )}
          </IconButton>
          
          <Box className="badge-container">
            {discountPercent > 0 && (
              <Chip 
                label={`${discountPercent}% OFF`}
                size="small"
                className="discount-badge"
              />
            )}
            {product.isFeatured && (
              <Chip 
                label="★ FEATURED"
                size="small"
                className="featured-badge"
              />
            )}
          </Box>
        </Box>
        
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
          {/* Category Tag */}
          {product.category && (
            <span className="category-tag">{product.category}</span>
          )}

          <Typography 
            variant="h6"
            sx={{ 
              fontSize: '1rem', 
              fontWeight: 600, 
              mb: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              minHeight: '3em'
            }}
          >
            {product.name}
          </Typography>

          {/* Rating */}
          {product.rating && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Box className="rating-box">
                <Star sx={{ fontSize: 16 }} />
                <span>{parseFloat(product.rating).toFixed(1)}</span>
              </Box>
              {product.reviews && (
                <span className="reviews-count">({Number(product.reviews).toLocaleString()})</span>
              )}
            </Box>
          )}

          {/* Price */}
          <Box className="price-container">
            <Typography className="current-price">
              ₹{Number(product.price).toLocaleString()}
            </Typography>
            {product.originalPrice && Number(product.originalPrice) > Number(product.price) && (
              <>
                <Typography className="original-price">
                  ₹{Number(product.originalPrice).toLocaleString()}
                </Typography>
                <Typography className="discount-percent">
                  {discountPercent}% off
                </Typography>
              </>
            )}
          </Box>

          {/* Stock Status */}
          {product.stock !== undefined && (
            <Typography 
              className={`stock-status ${Number(product.stock) > 0 ? 'stock-available' : 'stock-out'}`}
            >
              {Number(product.stock) > 0 
                ? `✓ In Stock (${Number(product.stock)} available)` 
                : '✗ Out of Stock'
              }
            </Typography>
          )}

          {/* Add to Cart Button */}
          <Button
            fullWidth
            variant="contained"
            startIcon={<ShoppingCart />}
            className="add-to-cart-btn"
            sx={{ mt: 'auto', marginTop: 2 }}
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            Add to Cart
          </Button>
        </CardContent>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ mt: 2 }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ 
            minWidth: '400px',
            fontSize: '1.25rem',
            fontWeight: 'bold',
            boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
            '& .MuiAlert-message': {
              fontSize: '1.25rem',
              fontWeight: 'bold',
              padding: '8px 0'
            },
            '& .MuiAlert-icon': {
              fontSize: '2rem'
            }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ProductCard;
