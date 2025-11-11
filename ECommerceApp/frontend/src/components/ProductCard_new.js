import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, IconButton, Button } from '@mui/material';
import { Favorite, FavoriteBorder, ShoppingCart } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart, isInWishlist, addToWishlist, removeFromWishlist } = useCart();
  const inWishlist = isInWishlist(product._id);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  const handleProductClick = () => {
    navigate(`/product/${product._id}`);
  };

  return (
    <Card className="product-card" onClick={handleProductClick}>
      <Box className="product-image-container">
        <CardMedia
          component="img"
          height="200"
          image={product.image || 'https://via.placeholder.com/200'}
          alt={product.name}
          className="product-image"
        />
        <IconButton
          className="wishlist-button"
          onClick={handleWishlistToggle}
          size="small"
        >
          {inWishlist ? (
            <Favorite sx={{ color: '#ff6161' }} />
          ) : (
            <FavoriteBorder />
          )}
        </IconButton>
      </Box>

      <CardContent>
        <Typography variant="h6" className="product-name" noWrap>
          {product.name}
        </Typography>

        <Box className="product-price-container">
          <Typography variant="h6" className="product-price">
            ₹{product.price}
          </Typography>
          {product.originalPrice && product.originalPrice > product.price && (
            <>
              <Typography variant="body2" className="product-original-price">
                ₹{product.originalPrice}
              </Typography>
              <Typography variant="body2" className="product-discount">
                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
              </Typography>
            </>
          )}
        </Box>

        {product.rating && (
          <Box className="product-rating">
            <Typography variant="body2">
              ★ {product.rating} ({product.reviews || 0})
            </Typography>
          </Box>
        )}

        <Button
          fullWidth
          variant="contained"
          startIcon={<ShoppingCart />}
          className="add-to-cart-button"
          onClick={handleAddToCart}
        >
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
