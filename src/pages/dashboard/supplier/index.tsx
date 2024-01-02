import React from 'react';
import { Box, Container, Unstable_Grid2 as Grid } from '@mui/material';
import { Helmet } from 'react-helmet';
import { TotalPurchaseRequest } from '../../../components/pageComponents/dashboard/supplier/TotalPurchaseRequest';
import { TotalOrders } from '../../../components/pageComponents/dashboard/supplier/TotalOrder';
import { TotalSales } from '../../../components/pageComponents/dashboard/supplier/Totalselles';
import { PaymentWaitt } from '../../../components/pageComponents/dashboard/supplier/PaymentWaiting';

export const Supplier = () => (
  <>
    <Helmet>
      <title>
        Dashboard | Procurement
      </title>
    </Helmet>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth="xl">
        <Grid
          container
          spacing={3}
        >
          <Grid
            xs={12}
            sm={6}
            lg={3}
          >
            <TotalPurchaseRequest
              difference={16}
              positive={false}
              sx={{ height: '100%' }}
              value="1.6k"
            />
          </Grid>
          <Grid
            xs={12}
            sm={6}
            lg={3}
          >
            <TotalOrders
              difference={16}
              positive={false}
              sx={{ height: '100%' }}
              value="1.6k"
            />
          </Grid>
          <Grid
            xs={12}
            sm={6}
            lg={3}
          >
            <PaymentWaitt
              sx={{ height: '100%' }}
              value={75.5}
            />
          </Grid>
          <Grid
            xs={12}
            sm={6}
            lg={3}
          >
            <TotalSales
              sx={{ height: '100%' }}
              value="$15k"
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  </>
);