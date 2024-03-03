import React from 'react';
import { Divider, Grid, Typography } from '@mui/material';
import { Helmet } from 'react-helmet';
import PageHeader from '../../components/PageHeader';
import { PeopleOutlineTwoTone } from '@mui/icons-material';
import { AccountProfile } from '../../components/pageComponents/account/changePassword/profile/AccountProfile';
import { AccountProfileDetails } from '../../components/pageComponents/account/changePassword/profile/AccountProfileDetails';
import { SectionTitle } from '../../components/Section';
import { CompanyAttachment } from '../../components/pageComponents/account/company/companyAttachment';
import { CompanyDetail } from '../../components/pageComponents/account/company/companyDetail';
import Map from '../../components/pageComponents/account/address/map';

const Profile = () => (
  <>
    <Helmet>
      <title>Et-proforma | Profile</title>
    </Helmet>
    <SectionTitle>
      <PageHeader
        title="My Profile"
        subTitle="This is your profile page"
        icon={<PeopleOutlineTwoTone fontSize='large' />}
      />
    </SectionTitle>
    <Grid container spacing={3}>
      <Grid item xs={12} md={6} lg={4}>
        <AccountProfile />
      </Grid>
      <Grid item xs={12} md={6} lg={8}>
        <AccountProfileDetails />
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <Typography variant="h6" gutterBottom style={{ color: '#3f51b5', marginBottom: '16px', fontWeight: 'bold' }}>
          Company Information
        </Typography>
        <CompanyAttachment />
      </Grid>
      <Grid item xs={12} md={6} lg={8}>
        <CompanyDetail />
      </Grid>
      <Grid item xs={12}>
        <Map latitude={51.505} longitude={-0.09} />
      </Grid>
    </Grid>
  </>
);

export default Profile;