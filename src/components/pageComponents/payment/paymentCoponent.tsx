import React from 'react';
import { Typography, Button, Grid, Card, CardContent, CardActions } from '@mui/material';

const paymentMethods = [
  {
    id: 'credit-card',
    name: 'Credit Card',
    description: 'Pay securely with your credit card.',
    image: 'credit-card.png',
  },
  {
    id: 'paypal',
    name: 'PayPal',
    description: 'Pay with your PayPal account.',
    image: 'paypal.png',
  },
  // Add more payment methods as needed
];

const PaymentComponent = () => {
  const handlePayment = (methodId:any) => {
    // Handle payment logic here
    console.log(`Payment completed with method: ${methodId}`);
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Payment Page
      </Typography>
      <Typography variant="body1" gutterBottom>
        Select your preferred payment method:
      </Typography>

      <Grid container spacing={2}>
        {paymentMethods.map((method) => (
          <Grid item xs={12} sm={6} md={4} key={method.id}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {method.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {method.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => handlePayment(method.id)}
                >
                  Select
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default PaymentComponent;