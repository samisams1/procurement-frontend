import React from 'react';
import { Typography, Box, Button, Grid } from '@mui/material';

const SupplierNotificationDetail = () => {
  const handlePay = () => {
    // Logic to handle payment
    console.log('Payment logic goes here');
  };

  // Product data
  const products = [
    {
      name: 'Product 1',
      price: 25,
      quantity: 5,
    },
    {
      name: 'Product 2',
      price: 40,
      quantity: 10,
    },
    {
      name: 'Product 3',
      price: 50,
      quantity: 11,
    },
  ];

  // Calculate total price
  const totalPrice = products.reduce((total, product) => {
    return total + product.price * product.quantity;
  }, 0);

  const shippingPrice = 25;
  const totalAmount = totalPrice + shippingPrice;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" align="center" sx={{ fontWeight: 'bold' }}>
        Your Order Detail for Payment
      </Typography>
      <Grid container spacing={2} sx={{ mt: 4 }}>
        <Grid item xs={6}>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            Request ID:
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            Purchase Order:
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            Date:
          </Typography>
          <Typography variant="body1" sx={{ mt: 4, fontWeight: 'bold' }}>
            Supplier:
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body1">
            4155dddedef
          </Typography>
          <Typography variant="body1">
            555ddd555
          </Typography>
          <Typography variant="body1">
            Your example date
          </Typography>
          <Typography variant="body1" sx={{ mt: 4 }}>
            Samisams
          </Typography>
        </Grid>
      </Grid>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Product Details
        </Typography>
        <Box sx={{ border: '1px solid #ccc', mt: 2, p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              Name
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              Price
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              Quantity
            </Typography>
          </Box>
          {products.map((product, index) => (
            <Box
              key={index}
              sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}
            >
              <Typography variant="body1">{product.name}</Typography>
              <Typography variant="body1">${product.price}</Typography>
              <Typography variant="body1">{product.quantity}</Typography>
            </Box>
          ))}
        </Box>
        <Typography variant="body1" sx={{ mt: 2, fontWeight: 'bold' }}>
          Shipping Price: Birr{shippingPrice}
        </Typography>
        <Typography variant="body1" sx={{ mt: 2, fontWeight: 'bold' }}>
          Total Price: Birr{totalAmount}
        </Typography>
      </Box>
      <Box sx={{ mt: 4, marginLeft: 'auto' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Company Information
        </Typography>
        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Company Name: Yosis Procurement
        </Typography>
        {/* Logo of the company goes here */}
        {/* <img src="company_logo.png" alt="Company Logo" /> */}
      </Box>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'green' }}>
          Status: Admin Approved - Please Make Payment
        </Typography>
      </Box>
      <Box sx={{ mt: 4 }}>
        <Button variant="contained" color="primary" onClick={handlePay} fullWidth>
          Pay
        </Button>
      </Box>
    </Box>
  );
};

export default SupplierNotificationDetail;