import React from 'react';
import { Typography, Box } from '@mui/material';

const PaymentConfirmation: React.FC = () => {
  return (
    <Box maxWidth={500} margin="auto" padding={3}>
      <Typography variant="h5" component="h2" gutterBottom>
        Payment Confirmation
      </Typography>

      <Box marginBottom={2}>
        <Typography variant="h6">Thank you for your payment!</Typography>
        <Typography variant="body1">
          We are pleased to inform you that your payment has been successfully processed.
        </Typography>
      </Box>

      <Box marginBottom={2}>
        <Typography variant="h6">Transaction Details:</Typography>
        <Typography variant="body1">Transaction ID: 123456789</Typography>
        <Typography variant="body1">Payment Date: January 21, 2024, 10:30 AM</Typography>
        <Typography variant="body1">Payment Method: Credit Card</Typography>
      </Box>

      <Box marginBottom={2}>
        <Typography variant="h6">Payment Summary:</Typography>
        <Typography variant="body1">Payment Amount: $100.00</Typography>
        <Typography variant="body1">Itemized Charges:</Typography>
        <Typography variant="body1">- Product A: $50.00</Typography>
        <Typography variant="body1">- Product B: $30.00</Typography>
        <Typography variant="body1">- Shipping Fee: $10.00</Typography>
        <Typography variant="body1">- Tax (5%): $5.00</Typography>
        <Typography variant="body1">- Discount: -$5.00</Typography>
      </Box>

      <Box marginBottom={2}>
        <Typography variant="h6">Invoice Reference:</Typography>
        <Typography variant="body1">Invoice Number: INV-20240121-001</Typography>
      </Box>

      <Box marginBottom={2}>
        <Typography variant="body1">
          Please retain this confirmation for your records. If you have any questions or concerns regarding your payment,
          please don't hesitate to contact our customer support team at{' '}
          <a href="mailto:support@example.com">support@example.com</a> or call us at +1-123-456-7890.
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
    </Box>
  );
};

export default PaymentConfirmation;