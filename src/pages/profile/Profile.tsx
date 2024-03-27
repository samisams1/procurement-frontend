import React, { useState } from 'react';
import { Divider, Grid, Typography } from '@mui/material';
import { Helmet } from 'react-helmet';
import PageHeader from '../../components/PageHeader';
import { PeopleOutlineTwoTone } from '@mui/icons-material';
import CircularProgress from '@mui/material/CircularProgress';
import { CompanyAttachment } from '../../components/pageComponents/account/company/companyAttachment';
//import { CompanyDetail } from '../../components/pageComponents/account/company/companyDetail';
import Map from '../../components/pageComponents/account/address/map';
import { AccountProfileDetails } from '../../components/pageComponents/account/changePassword/profile/AccountProfileDetails';
import { CompanyDetailUser } from '../../components/pageComponents/account/company/companyDetailUser';
import FileUploadForm from '../../components/pageComponents/account/changePassword/profile/AccountProfile';

const Profile: React.FC = () => {
  const [profileCompletion, setProfileCompletion] = useState<number>(80); // Set the initial profile completion percentage

  // Callback function to update the profileCompletion in the parent component
  const handleProfileCompletion = (completion: number) => {
    setProfileCompletion(completion);
  };

  return (
    <>
      <Helmet>
        <title>Et-proforma | Profile</title>
      </Helmet>
        <PageHeader
          title="My Profile"
          icon={<PeopleOutlineTwoTone fontSize="large" />}
          imageSrc = "salesForce.png"
        />
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={4}>
          <Typography variant="h6" gutterBottom style={{ fontWeight: 'bold' }}>
            Profile Completion
          </Typography>
          <div style={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress
              variant="determinate"
              value={profileCompletion}
              color="primary"
              size={120} // Set the size of the circular progress bar
              thickness={6} // Set the thickness of the circular progress bar
              style={{ animationDuration: '1s' }} // Add animation duration
            />
            <Typography
              variant="h5"
              color="textSecondary"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <strong>{`${profileCompletion}%`}</strong>
            </Typography>
          </div>
          <Grid item xs={12} md={6} lg={8}>
         <FileUploadForm/>
        </Grid>
        </Grid>
   
        <Grid item xs={12} md={6} lg={8}>
         <AccountProfileDetails/>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Typography variant="h6" gutterBottom style={{ color: '#3f51b5', marginBottom: '16px', fontWeight: 'bold' }}>
            Company Information
          </Typography>
         <CompanyAttachment  onProfileCompletion={handleProfileCompletion}/>
        </Grid>
        <Grid item xs={12} md={6} lg={8}>
       <CompanyDetailUser onProfileCompletion={handleProfileCompletion}/>
        </Grid>
        <Grid item xs={12}>
          <Map latitude={51.505} longitude={-0.09} />
        </Grid>
      </Grid>
    </>
  );
};

export default Profile;