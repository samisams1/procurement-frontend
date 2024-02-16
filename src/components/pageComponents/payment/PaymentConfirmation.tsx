import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import { Typography, Box, Button, Paper, Grid } from '@mui/material';
import { styled } from '@mui/system';
import PageHeader from '../../PageHeader';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  border: `1px solid #ccc`,
  borderRadius: theme.spacing(1),
  backgroundColor: '#f4f4f4',
}));

interface PaymentData {
  id: number;
  referenceNumber: string;
  status: string;
  paidAt: string;
  amount: number;
  paymentMethod: string;
  userId: number;
  orderId: number;
  fullName: string;
}

interface PaymentQueryData {
  payment: PaymentData;
}

const GET_PAYMENT = gql`
  query Payment($paymentId: Int!) {
    payment(id: $paymentId) {
      id
      amount
      paidAt
      paymentMethod
      userId
      orderId
      status
      referenceNumber
      fullName
    }
  }
`;

const PaymentConfirmation: React.FC = () => {
  const { id = '' } = useParams<{ id?: string }>();
  const { loading, error, data, refetch } = useQuery<PaymentQueryData>(GET_PAYMENT, {
    variables: { paymentId: Number(id) },
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

  const payment = data?.payment;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Grid container spacing={3}>
    <Grid item xs={12} sm={12}>
       <PageHeader
      title="Payment Confirmation"
      subTitle="Payment Confirmation "
      />
    <StyledPaper>
     
      <Button variant="contained" onClick={handlePrint} sx={{ marginBottom: 3 }}>
        Print
      </Button>

      <Typography variant="h5" component="h2" align="center" gutterBottom>
        Payment Confirmation
      </Typography>

      {payment ? (
        <React.Fragment>
          <Box marginBottom={2}>
            <Typography variant="h6" align="center">
              Thank you for your payment!
            </Typography>
            <Typography variant="body1">
              We are pleased to inform you that your payment has been successfully processed.
            </Typography>
          </Box>

          <Box marginBottom={2}>
            <Typography variant="h6" align="center">
              Transaction Details:
            </Typography>
            <Typography variant="body1" align="center">
              Transaction ID: {payment.id}
            </Typography>
            <Typography variant="body1" align="center">
              Payment Method: {payment.paymentMethod}
            </Typography>
          </Box>

          <Box marginBottom={2}>
            <Typography variant="h6" align="center">
              Invoice Reference:
            </Typography>
            <Typography variant="body1" align="center">
              Invoice Number: {payment.referenceNumber}
            </Typography>
          </Box>

          <Box marginBottom={2}>
            <Typography variant="body1">
              Thank you for choosing our services. Your payment has been successfully processed. If you have any questions or
              concerns regarding your payment, please don't hesitate to contact our customer support team at{' '}
              <a href="mailto:support@example.com">support@example.com</a> or call us at +2519736377.
            </Typography>
          </Box>

          <Typography variant="body1" align="center" fontWeight="bold">
            Thank you for your business!
          </Typography>

          <Typography variant="body1" align="center" fontStyle="italic">
            Best regards,
            <br />
            Nile Soft Company
          </Typography>
        </React.Fragment>
      ) : (
        <div>No payment found for the provided ID.</div>
      )}
    </StyledPaper>
    </Grid>
    </Grid>
  );
};

export default PaymentConfirmation;