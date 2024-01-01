import React from 'react';
import { Box, Container, Unstable_Grid2 as Grid } from '@mui/material'
import { Helmet } from 'react-helmet';
import RequestHistoryList from '../../components/pageComponents/request/RequestHistoryList';

export const RequestHistory = () => (
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
            md={12}
            lg={12}
          >
          <RequestHistoryList/>   
          </Grid>
        </Grid>
      </Container>
    </Box>
  </>
);
