import React from 'react';
import { Box, Container, Unstable_Grid2 as Grid } from '@mui/material';
//import { StoreProducts } from '../../../components/scensComponents/dashboard/store/TotalProducts';
//import { TotalOrders } from '../../../components/scensComponents/dashboard/TotalOrders';
import { Helmet } from 'react-helmet';
import { TotalOrders } from '../../../components/pageComponents/dashboard/TotalOrders';



export const StoreDashboard = () => (
  <>
    <Helmet>
      <title>
        Overview | Inventory
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
            lg={6}
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
            lg={6}
          >
            <TotalOrders
              sx={{ height: '100%' }}
              value="$15k"
            />
          </Grid>
         
        </Grid>
      </Container>
    </Box>
  </>
);