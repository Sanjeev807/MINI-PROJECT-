import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const CategoryCard = ({ category }) => {
  return (
    <Card sx={{ minWidth: 150, cursor: 'pointer' }}>
      <CardContent>
        <Typography variant="h6">{category?.name || 'Category'}</Typography>
      </CardContent>
    </Card>
  );
};

export default CategoryCard;
