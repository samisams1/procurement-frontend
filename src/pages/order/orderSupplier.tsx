import React from 'react';
import { Box, Container, Unstable_Grid2 as Grid } from '@mui/material';
import { Helmet } from 'react-helmet';
import OrderList from '../../components/pageComponents/order/OrderList';
import PageHeader from '../../components/PageHeader';
import { PeopleAltTwoTone } from '@mui/icons-material';
export const OrderSupplier = () => (
  <>
    <Helmet>
      <title>
        Overview | Procurement
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
            md={12}
            lg={12}
          >
         <PageHeader
            title="Order"
            subTitle="orders"
            icon={<PeopleAltTwoTone fontSize="large" />}
        /> 
            <OrderList/>   
          </Grid>
        </Grid>
      </Container>
    </Box>
  </>
);
