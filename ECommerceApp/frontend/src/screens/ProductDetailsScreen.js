import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Rating,
  Divider,
  Chip,
  IconButton,
  Snackbar,
  Alert,
  Paper,
  CircularProgress,
} from '@mui/material';
import {
  ShoppingCart,
  Favorite,
  FavoriteBorder,
  LocalOffer,
  Verified,
  LocalShipping,
  CreditCard,
  Star,
} from '@mui/icons-material';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const ProductDetailsScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/products/${id}`);
      console.log('Product fetched:', response.data);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
      setSnackbar({ open: true, message: 'Failed to load product', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    addToCart(product, quantity);
    setSnackbar({ open: true, message: 'Added to cart!', severity: 'success' });
  };

  const handleBuyNow = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    addToCart(product, quantity);
    navigate('/cart');
  };

  const handleWishlistToggle = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (isInWishlist(product.id || product._id)) {
      removeFromWishlist(product.id || product._id);
      setSnackbar({ open: true, message: 'Removed from wishlist', severity: 'info' });
    } else {
      addToWishlist(product);
      setSnackbar({ open: true, message: 'Added to wishlist!', severity: 'success' });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h5">Product not found</Typography>
        <Button variant="contained" onClick={() => navigate('/')} sx={{ mt: 2 }}>
          Back to Home
        </Button>
      </Container>
    );
  }

  const productImages = product.images || [];
  const discount = product.discount || 0;
  const originalPrice = product.originalPrice || product.price;
  const savings = originalPrice - product.price;

  return (
    <Box sx={{ backgroundColor: '#f1f3f6', minHeight: '100vh', py: 3 }}>
      <Container maxWidth="lg">
          <Grid container spacing={2}>
            {/* Left Section - Images */}
            <Grid item xs={12} md={5}>
              <Paper sx={{ p: 2, position: 'sticky', top: 80 }}>
                {/* Wishlist Button */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <IconButton 
                    onClick={handleWishlistToggle}
                    sx={{
                      backgroundColor: '#fff',
                      boxShadow: 1,
                      '&:hover': { backgroundColor: '#f5f5f5' }
                    }}
                  >
                    {isInWishlist(product.id || product._id) ? (
                      <Favorite sx={{ color: '#ff6161' }} />
                    ) : (
                      <FavoriteBorder />
                    )}
                  </IconButton>
                </Box>

                {/* Main Product Image */}
                <Box
                  sx={{
                    width: '100%',
                    height: 400,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#fff',
                    mb: 2,
                    borderRadius: 1,
                  }}
                >
                  <img
                    src={productImages[selectedImage] || 'https://via.placeholder.com/400'}
                    alt={product.name}
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                  />
                </Box>

                {/* Thumbnail Images */}
                {productImages.length > 1 && (
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    {productImages.map((img, index) => (
                      <Box
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        sx={{
                          width: 60,
                          height: 60,
                          border: selectedImage === index ? '2px solid #2874f0' : '1px solid #e0e0e0',
                          borderRadius: 1,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#fff',
                          '&:hover': { borderColor: '#2874f0' }
                        }}
                      >
                        <img
                          src={img}
                          alt={`${product.name} ${index + 1}`}
                          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                        />
                      </Box>
                    ))}
                  </Box>
                )}

                {/* Action Buttons */}
                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    startIcon={<ShoppingCart />}
                    onClick={handleAddToCart}
                    sx={{
                      backgroundColor: '#ff9f00',
                      color: '#fff',
                      fontWeight: 'bold',
                      '&:hover': { backgroundColor: '#e68a00' }
                    }}
                  >
                    ADD TO CART
                  </Button>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleBuyNow}
                    sx={{
                      backgroundColor: '#fb641b',
                      color: '#fff',
                      fontWeight: 'bold',
                      '&:hover': { backgroundColor: '#e55b16' }
                    }}
                  >
                    BUY NOW
                  </Button>
                </Box>
              </Paper>
            </Grid>

            {/* Right Section - Product Details */}
            <Grid item xs={12} md={7}>
              <Paper sx={{ p: 3 }}>
                {/* Product Name */}
                <Typography variant="h5" fontWeight="500" gutterBottom>
                  {product.name}
                </Typography>

                {/* Rating & Reviews */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: '#388e3c',
                      color: '#fff',
                      px: 1,
                      py: 0.5,
                      borderRadius: 0.5,
                      gap: 0.5
                    }}
                  >
                    <Typography variant="body2" fontWeight="bold">
                      {Number(product.rating).toFixed(1)}
                    </Typography>
                    <Star sx={{ fontSize: 14 }} />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {product.reviews?.toLocaleString()} Ratings & Reviews
                  </Typography>
                </Box>

                {/* Special Price Tag */}
                <Typography variant="body2" color="#388e3c" fontWeight="bold" gutterBottom>
                  Special price
                </Typography>

                {/* Price Section */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Typography variant="h4" fontWeight="bold">
                    ₹{product.price.toLocaleString()}
                  </Typography>
                  {discount > 0 && (
                    <>
                      <Typography
                        variant="h6"
                        color="text.secondary"
                        sx={{ textDecoration: 'line-through' }}
                      >
                        ₹{originalPrice.toLocaleString()}
                      </Typography>
                      <Typography variant="h6" color="#388e3c" fontWeight="bold">
                        {discount}% off
                      </Typography>
                    </>
                  )}
                </Box>

                {/* You Save */}
                {savings > 0 && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    You save: ₹{savings.toLocaleString()}
                  </Typography>
                )}

                {/* Available Offers */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Available offers
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <LocalOffer sx={{ fontSize: 18, color: '#388e3c' }} />
                      <Typography variant="body2">
                        <strong>Bank Offer</strong> 10% off on HDFC Bank Credit Cards, up to ₹1,500
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <LocalOffer sx={{ fontSize: 18, color: '#388e3c' }} />
                      <Typography variant="body2">
                        <strong>Special Price</strong> Get extra {discount}% off (price inclusive of cashback/coupon)
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <LocalOffer sx={{ fontSize: 18, color: '#388e3c' }} />
                      <Typography variant="body2">
                        <strong>No Cost EMI</strong> Available on orders above ₹3,000
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Delivery Info */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Delivery
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <LocalShipping sx={{ color: '#2874f0' }} />
                    <Typography variant="body2">
                      Free delivery by <strong>Tomorrow</strong>
                    </Typography>
                  </Box>
                  {product.stock > 0 ? (
                    <Chip
                      icon={<Verified />}
                      label={`${product.stock} items in stock`}
                      color="success"
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  ) : (
                    <Chip label="Out of Stock" color="error" size="small" sx={{ mt: 1 }} />
                  )}
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Highlights */}
                {product.specifications && Object.keys(product.specifications).length > 0 && (
                  <>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Highlights
                      </Typography>
                      <Box sx={{ pl: 2 }}>
                        {Object.entries(product.specifications).map(([key, value]) => (
                          <Typography key={key} variant="body2" sx={{ mb: 0.5 }}>
                            • {key}: {value}
                          </Typography>
                        ))}
                      </Box>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                  </>
                )}

                {/* Description */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Product Description
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                    {product.description}
                  </Typography>
                </Box>

                {/* Specifications Table */}
                {product.specifications && Object.keys(product.specifications).length > 0 && (
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Specifications
                    </Typography>
                    <Paper variant="outlined" sx={{ mt: 2 }}>
                      {Object.entries(product.specifications).map(([key, value], index) => (
                        <Box
                          key={key}
                          sx={{
                            display: 'flex',
                            p: 2,
                            backgroundColor: index % 2 === 0 ? '#fafafa' : '#fff',
                          }}
                        >
                          <Typography variant="body2" sx={{ width: '40%', fontWeight: 'bold' }}>
                            {key}
                          </Typography>
                          <Typography variant="body2" sx={{ width: '60%' }}>
                            {value}
                          </Typography>
                        </Box>
                      ))}
                    </Paper>
                  </Box>
                )}

                {/* Seller Info */}
                <Box sx={{ mt: 3, p: 2, backgroundColor: '#fafafa', borderRadius: 1 }}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    Seller
                  </Typography>
                  <Typography variant="body2">E-Shop</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    <Rating value={4.5} precision={0.1} size="small" readOnly />
                    <Typography variant="caption" color="text.secondary">
                      Seller Rating
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          sx={{ mt: 2 }}
        >
          <Alert 
            severity={snackbar.severity} 
            onClose={() => setSnackbar({ ...snackbar, open: false })}
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
      </Box>
    );
};

export default ProductDetailsScreen;
