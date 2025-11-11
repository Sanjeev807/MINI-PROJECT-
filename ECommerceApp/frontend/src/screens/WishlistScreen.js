import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Button, 
  Paper,
  IconButton,
  Card,
  CardMedia,
  CardContent
} from '@mui/material';
import { 
  Delete, 
  ShoppingCart, 
  FavoriteBorder,
  Star
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const WishlistScreen = () => {
  const { wishlist, removeFromWishlist, addToCart } = useCart();
  const navigate = useNavigate();

  const handleRemoveFromWishlist = async (productId) => {
    await removeFromWishlist(productId);
  };

  const handleAddToCart = async (product) => {
    await addToCart(product);
  };

  if (wishlist.length === 0) {
    return (
      <Container maxWidth="md" sx={{ mt: 8, mb: 4 }}>
        <Paper sx={{ p: 8, textAlign: 'center' }}>
          <FavoriteBorder sx={{ fontSize: 80, color: '#ccc', mb: 2 }} />
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            Your Wishlist is Empty
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Add items you like to your wishlist. Review them anytime and move them to cart.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/')}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              px: 4,
              py: 1.5,
            }}
          >
            Continue Shopping
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
          My Wishlist
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} in your wishlist
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {wishlist.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id || product._id}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                '&:hover': {
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  transform: 'translateY(-4px)',
                  transition: 'all 0.3s ease',
                },
              }}
            >
              {/* Remove Button */}
              <IconButton
                onClick={() => handleRemoveFromWishlist(product.id || product._id)}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  bgcolor: 'white',
                  '&:hover': {
                    bgcolor: '#ffebee',
                  },
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  zIndex: 1,
                }}
              >
                <Delete sx={{ color: '#f44336' }} />
              </IconButton>

              <CardMedia
                component="img"
                height="200"
                image={product.images?.[0] || product.image || 'https://via.placeholder.com/300'}
                alt={product.name}
                onClick={() => navigate(`/product/${product.id || product._id}`)}
                sx={{ cursor: 'pointer', objectFit: 'cover' }}
              />
              
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Category */}
                {product.category && (
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: '#667eea', 
                      fontWeight: 600, 
                      textTransform: 'uppercase',
                      mb: 0.5
                    }}
                  >
                    {product.category}
                  </Typography>
                )}

                {/* Product Name */}
                <Typography 
                  variant="h6"
                  onClick={() => navigate(`/product/${product.id || product._id}`)}
                  sx={{ 
                    fontSize: '1rem', 
                    fontWeight: 600, 
                    mb: 1,
                    cursor: 'pointer',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    minHeight: '3em',
                    '&:hover': {
                      color: '#667eea',
                    }
                  }}
                >
                  {product.name}
                </Typography>

                {/* Rating */}
                {product.rating && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        bgcolor: '#388e3c',
                        color: 'white',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: '0.75rem',
                        fontWeight: 'bold'
                      }}
                    >
                      <Star sx={{ fontSize: 14, mr: 0.3 }} />
                      {parseFloat(product.rating).toFixed(1)}
                    </Box>
                    {product.reviews && (
                      <Typography variant="caption" sx={{ ml: 1, color: '#666' }}>
                        ({Number(product.reviews).toLocaleString()})
                      </Typography>
                    )}
                  </Box>
                )}

                {/* Price */}
                <Box sx={{ mb: 2 }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 'bold', 
                      color: '#212121',
                      display: 'inline',
                      mr: 1
                    }}
                  >
                    ₹{Number(product.price).toLocaleString()}
                  </Typography>
                  {product.originalPrice && Number(product.originalPrice) > Number(product.price) && (
                    <>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          textDecoration: 'line-through',
                          color: '#878787',
                          display: 'inline',
                          mr: 1
                        }}
                      >
                        ₹{Number(product.originalPrice).toLocaleString()}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#388e3c',
                          fontWeight: 'bold',
                          display: 'inline'
                        }}
                      >
                        {Math.round(((Number(product.originalPrice) - Number(product.price)) / Number(product.originalPrice)) * 100)}% off
                      </Typography>
                    </>
                  )}
                </Box>

                {/* Stock Status */}
                {product.stock !== undefined && (
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: Number(product.stock) > 0 ? '#388e3c' : '#f44336',
                      fontWeight: 600,
                      mb: 2
                    }}
                  >
                    {Number(product.stock) > 0 
                      ? `In Stock (${Number(product.stock)} available)` 
                      : 'Out of Stock'
                    }
                  </Typography>
                )}

                {/* Add to Cart Button */}
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<ShoppingCart />}
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0}
                  sx={{
                    mt: 'auto',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5568d3 0%, #6a3f91 100%)',
                    },
                    '&:disabled': {
                      bgcolor: '#ccc',
                    }
                  }}
                >
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default WishlistScreen;
