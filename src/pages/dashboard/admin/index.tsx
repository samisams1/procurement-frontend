import React from 'react';
import { Grid, Paper, Typography, Box, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ShoppingCart, CheckCircle, Warning, MonetizationOn, Dashboard } from '@mui/icons-material';
import PageHeader from '../../../components/PageHeader';
import CountAllOrderStatus from '../../../components/pageComponents/dashboard/customer/countAllOrdersBystatus';
import CountRequest from '../../../components/pageComponents/dashboard/admin/request';
import CountPayment from '../../../components/pageComponents/dashboard/admin/payment';

const SectionTitle = styled(Paper)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2),
}));

const MetricContainer = styled(Paper)(({ theme, color }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(3),
  backgroundColor: color,
  color: theme.palette.common.white,
  borderRadius: theme.shape.borderRadius,
  height: 120,
}));

const MetricValue = styled(Typography)(({ theme }) => ({
  fontSize: '2.5rem',
  fontWeight: 'bold',
}));

const MetricLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.8rem',
  textTransform: 'uppercase',
  opacity: 0.8,
}));

/*const ContentContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
}));*/

const AdminDashboard = () => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <SectionTitle variant="outlined" square>
         <PageHeader
         title="Dashboard"
        icon={<Dashboard/>}  
         />
        </SectionTitle>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <MetricContainer elevation={3} color="#F44336">
          <Box>
            <MetricValue variant="h4">{77}</MetricValue>
            <MetricLabel variant="subtitle2">Total RFQs</MetricLabel>
          </Box>
          <IconButton color="inherit">
            <ShoppingCart />
          </IconButton>
        </MetricContainer>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <MetricContainer elevation={3} color="#9C27B0">
          <Box>
          <MetricValue variant="h4"><CountRequest status="pending" /></MetricValue>
            <MetricLabel variant="subtitle2">Pending Requests</MetricLabel>
          </Box>
          <IconButton color="inherit">
            <Warning />
          </IconButton>
        </MetricContainer>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <MetricContainer elevation={3} color="#4CAF50">
          <Box>
            <MetricValue variant="h4"><CountAllOrderStatus status="pending" /></MetricValue>
            <MetricLabel variant="subtitle2">Pending Orders</MetricLabel>
          </Box>
          <IconButton color="inherit">
            <CheckCircle />
          </IconButton>
        </MetricContainer>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <MetricContainer elevation={3} color="#FFC107">
          <Box>
            <MetricValue variant="h4"><CountAllOrderStatus status="coformed" /></MetricValue>
            <MetricLabel variant="subtitle2">Comformed Orders </MetricLabel>
          </Box>
          <IconButton color="inherit">
            <Warning />
          </IconButton>
        </MetricContainer>
      </Grid>
     
      <Grid item xs={12} sm={6} md={4}>
        <MetricContainer elevation={3} color="#2196F3">
          <Box>
            <MetricValue variant="h4"><CountAllOrderStatus status="approved" /></MetricValue>
            <MetricLabel variant="subtitle2">WAITING PAYMENT FOR PAID</MetricLabel>
          </Box>
          <IconButton color="inherit">
            <ShoppingCart />
          </IconButton>
        </MetricContainer>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <MetricContainer elevation={3} color="#FF5722">
          <Box>
            <MetricValue variant="h4"><CountPayment status='paid'/></MetricValue>
            <MetricLabel variant="subtitle2">Payment Paid</MetricLabel>
          </Box>
          <IconButton color="inherit">
            <MonetizationOn />
          </IconButton>
        </MetricContainer>
      </Grid>
    </Grid>
  );
};
export default AdminDashboard;