import React from 'react';
import { Box, Container, Unstable_Grid2 as Grid } from '@mui/material';
import { Helmet } from 'react-helmet';
import { DailyTotalSales } from '../../components/report/daily/TodayTotalQueue';
import { MonthTotalSales } from '../../components/report/month/MonthTotalSales';
import { YearTotalSales } from '../../components/report/year/YearTotalSales';
import LabTabs from '../../components/pageComponents/Tab/Tabs';
export const Report = () => (
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
            lg={3}
          >
            <DailyTotalSales
              difference={12}
              positive
              sx={{ height: '100%' }}
              value="$24k"
            />
          </Grid>
          <Grid
            xs={12}
            sm={6}
            lg={3}
          >
            <MonthTotalSales
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
            <YearTotalSales
              sx={{ height: '100%' }}
              value={75.5}
            />
          </Grid>
        
          <Grid
            xs={12}
            lg={12}
          >
          <LabTabs/> 
          </Grid>
         
        </Grid>
      </Container>
    </Box>
  </>
);