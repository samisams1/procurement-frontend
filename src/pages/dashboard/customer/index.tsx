import React from 'react';
import { Grid, Paper, Typography, Box, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ShoppingCart, CheckCircle, Warning, LocalShipping, Add } from '@mui/icons-material';
import PageHeader from '../../../components/PageHeader';
import OrderByStatus from '../../../components/pageComponents/dashboard/customer/orderByStatus';
import CountRequestStatus from '../../../components/pageComponents/dashboard/customer/countRequestsByStatus';
import NewRfq from '../../../components/pageComponents/dashboard/customer/countNewRfq';
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

const ContentContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
}));
interface CustomerDashboardProps {
  userId: number;
}

const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ userId }) => {
  // Sample data for recent orders
  const recentOrders = [
    { id: 1, product: 'Widget A', quantity: 5, status: 'Delivered' },
    { id: 2, product: 'Widget B', quantity: 10, status: 'In Progress' },
    { id: 3, product: 'Widget C', quantity: 2, status: 'Cancelled' },
  ];

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <SectionTitle variant="outlined" square>
         <PageHeader
         title="Dashboard"
         subTitle='dashboard'
        icon={<Add/>}  
         />
        </SectionTitle>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <MetricContainer elevation={3} color="#F44336">
          <Box>
            <MetricValue variant="h4"><NewRfq status="pending" customerId={Number(userId) }/></MetricValue>
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
            <MetricValue variant="h4"><CountRequestStatus status="pending" userId={Number(userId) }/></MetricValue>
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
            <MetricValue variant="h4"><OrderByStatus status="pending" customerId={Number(1) }/></MetricValue>
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
            <MetricValue variant="h4"><OrderByStatus status="comformed"  customerId={Number(userId) }/></MetricValue>
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
            <MetricValue variant="h4"><OrderByStatus status="approved" customerId={Number(userId) }/></MetricValue>
            <MetricLabel variant="subtitle2">Approved Orders / Payment Pending</MetricLabel>
          </Box>
          <IconButton color="inherit">
            <ShoppingCart />
          </IconButton>
        </MetricContainer>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <MetricContainer elevation={3} color="#9E9E9E">
          <Box>
            <MetricValue variant="h4">150</MetricValue>
            <MetricLabel variant="subtitle2">Orders in Transit</MetricLabel>
          </Box>
          <IconButton color="inherit">
            <LocalShipping />
          </IconButton>
        </MetricContainer>
      </Grid>
      <Grid item xs={12}>
        <ContentContainer>
          <Typography variant="h6">Recent Orders</Typography>
          {recentOrders.map((order) => (
            <Box key={order.id} display="flex" alignItems="center" mt={2}>
              <Typography variant="body1">
                <strong>{order.product}</strong> - Quantity: {order.quantity}
              </Typography>
              <Box flexGrow={1} />
              <Typography variant="body1" color="textSecondary">
                {order.status}
              </Typography>
            </Box>
          ))}
        </ContentContainer>
      </Grid>
    </Grid>
  );
};

export default CustomerDashboard;