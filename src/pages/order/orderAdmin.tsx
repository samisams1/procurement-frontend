import React from 'react';
import { Box, Container, Unstable_Grid2 as Grid } from '@mui/material';
import { Helmet } from 'react-helmet';
import PageHeader from '../../components/PageHeader';
import { PeopleAltTwoTone } from '@mui/icons-material';
export const OrderAdmin = () => (
  <>
    <Helmet>
      <title>
        Etrpoforma | order
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
              
          </Grid>
        </Grid>
      </Container>
    </Box>
  </>
);
