import React from 'react';
import { styled } from '@mui/system';
import { Typography, Grid } from '@mui/material';

const SectionContainer = styled(Grid)(({ theme }) => ({
    padding: theme.spacing(4),
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    
  }));

const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  fontWeight: 'bold',
}));

const StepContainer = styled(Grid)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const StepIcon = styled('div')(({ theme }) => ({
  width: '64px',
  height: '64px',
  borderRadius: '50%',
  backgroundColor: theme.palette.secondary.main,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
}));

const StepTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
}));

const StepDescription = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
}));

const HowItWorksSection = () => {
  return (
    <SectionContainer container alignItems="center" justifyContent="center">
      <Grid item xs={12} md={12} lg={12}>
        <SectionTitle variant="h4">How It Works</SectionTitle>
        <StepContainer container spacing={4}>
          <Grid item xs={12} md={4}>
            <StepIcon>
              <Typography variant="h5">1</Typography>
            </StepIcon>
            <StepTitle variant="h6">Create a Purchase Request</StepTitle>
            <StepDescription>
              Submit a detailed purchase request specifying the items or services needed.
            </StepDescription>
          </Grid>
          <Grid item xs={12} md={4}>
            <StepIcon>
              <Typography variant="h5">2</Typography>
            </StepIcon>
            <StepTitle variant="h6">Approval Process</StepTitle>
            <StepDescription>
              The request goes through an approval process by the designated authorities.
            </StepDescription>
          </Grid>
          <Grid item xs={12} md={4}>
            <StepIcon>
              <Typography variant="h5">3</Typography>
            </StepIcon>
            <StepTitle variant="h6">Create RFQ</StepTitle>
            <StepDescription>
              Create a Request for Quotation (RFQ) to obtain quotes from suppliers.
            </StepDescription>
          </Grid>
          <Grid item xs={12} md={4}>
            <StepIcon>
              <Typography variant="h5">4</Typography>
            </StepIcon>
            <StepTitle variant="h6">Send Order</StepTitle>
            <StepDescription>
              Send the order to the selected supplier after RFQ approval.
            </StepDescription>
          </Grid>
          <Grid item xs={12} md={4}>
            <StepIcon>
              <Typography variant="h5">5</Typography>
            </StepIcon>
            <StepTitle variant="h6">Order Confirmation</StepTitle>
            <StepDescription>
              The supplier confirms the order and provides an order confirmation.
            </StepDescription>
          </Grid>
          <Grid item xs={12} md={4}>
            <StepIcon>
              <Typography variant="h5">6</Typography>
            </StepIcon>
            <StepTitle variant="h6">Admin Approval</StepTitle>
            <StepDescription>
              The order is approved by the admin for further processing.
            </StepDescription>
          </Grid>
          <Grid item xs={12} md={4}>
            <StepIcon>
              <Typography variant="h5">7</Typography>
            </StepIcon>
            <StepTitle variant="h6">Send Order for Payment</StepTitle>
            <StepDescription>
              The approved order is sent for payment processing.
            </StepDescription>
          </Grid>
          <Grid item xs={12} md={4}>
            <StepIcon>
              <Typography variant="h5">8</Typography>
            </StepIcon>
            <StepTitle variant="h6">Payment Confirmation</StepTitle>
            <StepDescription>
              Confirmation of payment received from the payment processor.
            </StepDescription>
          </Grid>
          <Grid item xs={12} md={4}>
            <StepIcon>
              <Typography variant="h5">9</Typography>
            </StepIcon>
            <StepTitle variant="h6">Create Invoices</StepTitle>
            <StepDescription>
              Generate and send invoices for the completed order.
            </StepDescription>
          </Grid>
          <Grid item xs={12} md={4}>
            <StepIcon>
              <Typography variant="h5">10</Typography>
            </StepIcon>
            <StepTitle variant="h6">Shipping and Delivery</StepTitle>
            <StepDescription>
              Arrange for the shipping and delivery of the ordered items.
            </StepDescription>
          </Grid>
        </StepContainer>
      </Grid>
    </SectionContainer>
  );
};

export default HowItWorksSection;