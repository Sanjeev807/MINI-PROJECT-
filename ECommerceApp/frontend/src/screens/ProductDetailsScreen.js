import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const ProductDetailsScreen = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h4" gutterBottom>
          ProductDetailsScreen
        </Typography>
        <Typography variant="body1" color="text.secondary">
          This screen is under construction
        </Typography>
      </Box>
    </Container>
  );
};

export default ProductDetailsScreen;
