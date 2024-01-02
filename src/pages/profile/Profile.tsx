import React from 'react';
import { Box, Container, Stack, Unstable_Grid2 as Grid } from '@mui/material';
import { Helmet } from 'react-helmet';
import PageHeader from '../../components/PageHeader';
import { PeopleOutlineTwoTone } from '@mui/icons-material';
import { AccountProfile } from '../../components/pageComponents/account/changePassword/profile/AccountProfile';
import { AccountProfileDetails } from '../../components/pageComponents/account/changePassword/profile/AccountProfileDetails';

export const Profile = () => (
  <>
    <Helmet>
      <title>
        Profile | itrustu2
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
      title = {"My Profile "}
      subTitle ={"this is your profile page "}
      icon={<PeopleOutlineTwoTone fontSize='large'/>}
      />
        <Stack spacing={3}>
            <Grid
              container
              spacing={3}
            >
              <Grid
                xs={12}
                md={6}
                lg={4}
              >
                <AccountProfile/> 
              </Grid>
              <Grid
                xs={12}
                md={6}
                lg={8}
              >
              <AccountProfileDetails />
              </Grid>
            </Grid>
        </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  </>
);