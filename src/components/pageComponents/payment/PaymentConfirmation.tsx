import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import { Typography, Box, Button } from '@mui/material';

interface PaymentData {
  id: number;
  referenceNumber: string;
  status: string;
  paidAt: string;
  amount: number;
  paymentMethod: string;
  user: {
    username: string;
  };
  order: {
    shippingCost: number;
    orderDetails: {
      id: number;
      price: number;
      title: string;
    }[];
  };
}

interface PaymentQueryData {
  payment: PaymentData[];
}

const GET_PAYMENT = gql`
  query GetPayment($id: Int!) {
    payment(id: $id) {
      id
      referenceNumber
      status
      paidAt
      amount
      paymentMethod
      user {
        username
      }
      order {
        shippingCost
        orderDetails {
          id
          price
          title
        }
      }
    }
  }
`;

const PaymentConfirmation: React.FC = () => {
  const { id = '' } = useParams<{ id?: string }>();
  const { loading, error, data, refetch } = useQuery<PaymentQueryData>(GET_PAYMENT, {
    variables: { id: Number(id) },
  });

  useEffect(() => {
    refetch();
  }, [id, refetch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const payment = data?.payment?.[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <Box maxWidth={500} margin="auto" padding={3}>
      <Button variant="contained" onClick={handlePrint} sx={{ marginBottom: 3 }}>
        Print
      </Button>

      <Typography variant="h5" component="h2" gutterBottom>
        Payment Confirmation
      </Typography>

      {payment ? (
        <React.Fragment>
          <Box marginBottom={2}>
            <Typography variant="h6">Thank you for your payment!</Typography>
            <Typography variant="body1">
              We are pleased to inform you that your payment has been successfully processed.
            </Typography>
          </Box>

          <Box marginBottom={2}>
            <Typography variant="h6">Transaction Details:</Typography>
            <Typography variant="body1">Transaction ID: {payment.id}</Typography>
            <Typography variant="body1">Payment Method: {payment.paymentMethod}</Typography>
          </Box>

          {payment.order && (
            <Box marginBottom={2}>
              <Typography variant="h6">Payment Summary:</Typography>
              <Typography variant="body1">Payment Amount: ${payment.amount}</Typography>
              <Typography variant="body1">Itemized Charges:</Typography>
              {payment.order.orderDetails.map((orderDetail) => (
                <Typography variant="body1" key={orderDetail.id}>
                  - {orderDetail.title}: ${orderDetail.price}
                </Typography>
              ))}
              <Typography variant="body1">Shipping Fee: ${payment.order.shippingCost}</Typography>
            </Box>
          )}

          <Box marginBottom={2}>
            <Typography variant="h6">Invoice Reference:</Typography>
            <Typography variant="body1">Invoice Number: {payment.referenceNumber}</Typography>
          </Box>

          <Box marginBottom={2}>
            <Typography variant="body1">
              Thank you for choosing our services. Your payment has been successfully processed. If you have any questions or
              concerns regarding your payment, please don't hesitate to contact our customer support team at{' '}
              <a href="mailto:support@example.com">support@example.com</a> or call us at +2519736377.
            </Typography>
          </Box>

          <Typography variant="body1" align="center">
            Thank you for your business!
          </Typography>

          <Typography variant="body1" align="center" fontStyle="italic">
            Best regards,
            <br />
            Your Company Name
          </Typography>
        </React.Fragment>
      ) : (
        <div>No payment found for the provided ID.</div>
      )}
    </Box>
  );
};

export default PaymentConfirmation;