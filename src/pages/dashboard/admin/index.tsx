import React from 'react';
import { Box, Container, Unstable_Grid2 as Grid } from '@mui/material';
import { Helmet } from 'react-helmet';
import { TotalUser } from '../../../components/pageComponents/dashboard/TotalUsers';
import { PendingOrder } from '../../../components/pageComponents/dashboard/customer/countpendingOrder';
import { ComformedOrder } from '../../../components/pageComponents/dashboard/customer/countComformedOrder';
import { ApprovedOrder } from '../../../components/pageComponents/dashboard/customer/countApprovedOrder';
import { TotalSupplier } from '../../../components/pageComponents/dashboard/totalSupplier';
import { TotalCustomer } from '../../../components/pageComponents/dashboard/totalCustomers';

export const AdminDashboard = () => (
  <>
    <Helmet>
    <title>
      ET Pro forma| Dashboard 
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
            <PendingOrder
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
            <ComformedOrder
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
            <ApprovedOrder
              sx={{ height: '100%' }}
              value={75.5}
            />
          </Grid>
          <Grid
            xs={12}
            sm={6}
            lg={3}
          >
            <TotalUser
              sx={{ height: '100%' }}
              value="$15k"
            />
          </Grid>
          <Grid
            xs={12}
            sm={6}
            lg={3}
          >
            <TotalSupplier
              sx={{ height: '100%' }}
              value="$15k"
            />
          </Grid>
           <Grid
            xs={12}
            sm={6}
            lg={3}
          >
            <TotalCustomer
              sx={{ height: '100%' }}
              value="$15k"
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  </>
);