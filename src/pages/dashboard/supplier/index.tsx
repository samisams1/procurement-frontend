import React from 'react';
import { Box, Container, Unstable_Grid2 as Grid } from '@mui/material';
import { Helmet } from 'react-helmet';
import { PendingOrder } from '../../../components/pageComponents/dashboard/customer/countpendingOrder';
import { ComformedOrder } from '../../../components/pageComponents/dashboard/customer/countComformedOrder';
import { ApprovedOrder } from '../../../components/pageComponents/dashboard/customer/countApprovedOrder';
import { CountNewRequest } from '../../../components/pageComponents/dashboard/supplier/countNewRequest';

export const Supplier = () => (
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
            <CountNewRequest
              sx={{ height: '100%' }}
              value="$15k"
            />
          </Grid>
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
        </Grid>
      </Container>
    </Box>
  </>
);