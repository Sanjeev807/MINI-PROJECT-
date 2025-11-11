import React from 'react';
import { Box, CircularProgress } from '@mui/material';

const Loader = ({ size = 50, color = '#2874f0' }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
        width: '100%',
      }}
    >
      <CircularProgress size={size} sx={{ color }} />
    </Box>
  );
};

export default Loader;
