import React from 'react';
import { Box, Button, Container } from '@mui/material';
import { 
  Laptop, 
  Checkroom, 
  Weekend, 
  MenuBook, 
  FitnessCenter,
  GridView 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import './CategoryNav.css';

const CategoryNav = () => {
  const navigate = useNavigate();

  const categories = [
    { 
      name: 'Electronics', 
      icon: <Laptop />, 
      path: '/category/electronics',
      color: '#667eea',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=100&h=100&fit=crop'
    },
    { 
      name: 'Fashion', 
      icon: <Checkroom />, 
      path: '/category/fashion',
      color: '#f093fb',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=100&h=100&fit=crop'
    },
    { 
      name: 'Home & Living', 
      icon: <Weekend />, 
      path: '/category/home',
      color: '#4facfe',
      image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=100&h=100&fit=crop'
    },
    { 
      name: 'Books', 
      icon: <MenuBook />, 
      path: '/category/books',
      color: '#f5576c',
      image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=100&h=100&fit=crop'
    },
    { 
      name: 'Sports & Fitness', 
      icon: <FitnessCenter />, 
      path: '/category/sports',
      color: '#26de81',
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=100&h=100&fit=crop'
    },
    { 
      name: 'All Products', 
      icon: <GridView />, 
      path: '/',
      color: '#764ba2',
      image: null
    },
  ];

  return (
    <Box className="category-nav-container">
      <Container maxWidth="xl">
        <Box className="category-nav">
          {categories.map((category, index) => (
            <Button
              key={index}
              className="category-btn"
              onClick={() => navigate(category.path)}
              sx={{
                '&:hover .category-icon': {
                  color: category.color,
                }
              }}
            >
              <Box className="category-icon" sx={{ position: 'relative' }}>
                {category.image && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -4,
                      left: -4,
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundImage: `url(${category.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                      zIndex: -1,
                    }}
                    className="category-image-hover"
                  />
                )}
                {category.icon}
              </Box>
              <Box className="category-name">
                {category.name}
              </Box>
            </Button>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default CategoryNav;
