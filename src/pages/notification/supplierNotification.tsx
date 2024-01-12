import React from 'react';
import { Typography, Box, Button, Grid } from '@mui/material';
import { useParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import Spinner from '../../components/Spinner';

const ORDER_QUERY = gql`
query GetOrderById($id: Float!) {
  getOrderById(id: $id) {
    id
    supplierId
    customerId
    totalPrice
    shippingCost
    status
    orderDetails{
      price
      title
      quantity
    }
  }
}
`;

interface OrderInterface {
  id: string;
  customerId: string;
  supplierId: string;
  totalPrice: number;
  createdAt: string;
  status: string;
  shippingCost: number;
  orderDetails: {
    price: number;
    title: string;
    quantity: number;
  }[];
}

const SupplierNotificationDetail = () => {
  const { id } = useParams<{ id?: string }>();

  const { loading, error, data } = useQuery(ORDER_QUERY, {
    variables: { id: Number(id) },
  });

  const handlePay = () => {
    // Logic to handle payment
    console.log('Payment logic goes here');
  };

  if (loading) return <Spinner />;
  if (error) return <p>{error.message}</p>;

  const order = data?.getOrderById as OrderInterface;
  const products = order.orderDetails.map((product) => ({
    name: product.title.toString(),
    price: product.price,
    quantity: product.quantity,
  }));

  const totalPrice = order.totalPrice;
  const shippingPrice = order.shippingCost;
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
          <Typography variant="body1">{order.id}</Typography>
          <Typography variant="body1">{order.customerId}</Typography>
          <Typography variant="body1">{order.createdAt}</Typography>
          <Typography variant="body1" sx={{ mt: 4 }}>
            {order.supplierId}
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
        {/* <img src="company_logo.png" alt="Company Logo" />    */}
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