import React from 'react';
import { Box, Container, Unstable_Grid2 as Grid } from '@mui/material';
import { Helmet } from 'react-helmet';
import { TotalUser } from '../../../components/pageComponents/dashboard/TotalUsers';

export const SellerDashboard = () => (
  <>
    <Helmet>
      <title>
        Dashboard | Seblewongale
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
            <TotalUser
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
            <TotalUser
              sx={{ height: '100%' }}
              value="$15k"
            />
          </Grid>
         
        </Grid>
      </Container>
    </Box>
  </>
);