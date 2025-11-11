import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Box, Chip } from '@mui/material';
import { ShoppingCart, Star } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const discountPercent = product.originalPrice 
    ? Math.round(((Number(product.originalPrice) - Number(product.price)) / Number(product.originalPrice)) * 100)
    : 0;

  return (
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
          onClick={(e) => {
            e.stopPropagation();
            // Add to cart logic here
          }}
          disabled={product.stock === 0}
        >
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
