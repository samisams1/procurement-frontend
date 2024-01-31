import React from 'react';
import { styled } from '@mui/system';
import { Typography, Grid } from '@mui/material';

const ProductCategoriesContainer = styled(Grid)(({ theme }) => ({
  backgroundColor: '#f9f9f9',
  padding: theme.spacing(4),
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
}));

const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  marginBottom: theme.spacing(4),
  color: '#333333',
}));

const CategoryContainer = styled(Grid)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const CategoryIcon = styled('div')(({ theme }) => ({
  width: '64px',
  height: '64px',
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: theme.spacing(2),
  fontSize: '32px',
  color: '#ffffff',
}));

const CategoryTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  color: '#333333',
}));

const ProductCategories = () => {
  const categories = [
    { title: 'Electronics', icon: '💻' },
    { title: 'Fashion', icon: '👗' },
    { title: 'Home & Kitchen', icon: '🏠' },
    { title: 'Beauty & Personal Care', icon: '💄' },
    { title: 'Sports & Outdoors', icon: '⚽' },
  ];

  return (
    <ProductCategoriesContainer container>
      <Title variant="h5">Product Categories</Title>
      {categories.map((category, index) => (
        <CategoryContainer key={index} item xs={12} sm={6} md={4}>
          <CategoryIcon>{category.icon}</CategoryIcon>
          <CategoryTitle variant="h6">{category.title}</CategoryTitle>
        </CategoryContainer>
      ))}
    </ProductCategoriesContainer>
  );
};

export default ProductCategories;