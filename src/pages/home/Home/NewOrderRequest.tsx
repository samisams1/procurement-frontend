import React from 'react';
import { styled } from '@mui/system';
import { Typography, Button, Card, Grid } from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';

const OrderRequestCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  border: `2px solid ${theme.palette.primary.main}`,
  width: '100%',
}));

const RequestTitle = styled(Typography)(({ theme }) => ({
  marginRight: theme.spacing(2),
  fontWeight: 'bold',
}));

const RequestButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  transition: 'background-color 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.secondary.main,
    boxShadow: `0px 0px 10px 3px ${theme.palette.secondary.main}`,
    transform: 'scale(1.1)',
  },
  height: '60px',
  borderRadius: '30px',
  padding: theme.spacing(0, 4),
  '& .MuiButton-label': {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
}));

const NewOrderRequest = () => {
  const handleRequestClick = () => {
    // Handle click event
    console.log('Order Request clicked');
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <OrderRequestCard>
          <Grid container alignItems="center">
            <Grid item xs={12} sm={6}>
              <RequestTitle variant="h6">New Order Request</RequestTitle>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                "New Order Request" is a formal process used to request goods or services. 
                It involves a detailed request, budget consideration, and evaluation. It ensures
                 accountability, transparency, and efficient resource allocation, enabling organizations
                  to make informed decisions and initiate the procurement process.
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <RequestButton
                variant="contained"
                onClick={handleRequestClick}
              >
                <ShoppingCart />
                Request Order
              </RequestButton>
            </Grid>
          </Grid>
        </OrderRequestCard>
      </Grid>
    </Grid>
  );
};

export default NewOrderRequest;