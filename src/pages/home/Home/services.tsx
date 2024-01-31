import React from 'react';
import { Grid, Typography } from '@mui/material';
import { styled } from '@mui/system';

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  marginBottom: theme.spacing(2),
  color: theme.palette.primary.main,
}));

const ServiceTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  marginBottom: theme.spacing(1),
  color: theme.palette.secondary.main,
}));

const ServiceList = styled("ul")(({ theme }) => ({
  listStyle: "none",
  paddingLeft: theme.spacing(2),
}));

const ServiceItem = styled("li")(({ theme }) => ({
  marginBottom: theme.spacing(1),
  position: "relative",
  paddingLeft: theme.spacing(2),
  "&::before": {
    content: '""',
    position: "absolute",
    left: 0,
    top: "50%",
    transform: "translateY(-50%)",
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: theme.palette.secondary.main,
  },
}));

const Services: React.FC = () => {
  return (
    <Grid item xs={12} md={6}>
      <SectionTitle variant="h5">Our Services</SectionTitle>
      <ServiceTitle variant="h6">E-Procurement System</ServiceTitle>
      <ServiceList>
        <ServiceItem>Streamlined procurement processes</ServiceItem>
        <ServiceItem>Automated purchase requisitions and approvals</ServiceItem>
        <ServiceItem>Electronic supplier management</ServiceItem>
        <ServiceItem>Real-time inventory tracking</ServiceItem>
        <ServiceItem>Integrated vendor catalog management</ServiceItem>
        <ServiceItem>Automated invoice processing and payments</ServiceItem>
        <ServiceItem>Analytics and reporting for better decision-making</ServiceItem>
        <ServiceItem>Secure and compliant data management</ServiceItem>
      </ServiceList>
    </Grid>
  );
};

export default Services;