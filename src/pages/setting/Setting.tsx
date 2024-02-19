import React from 'react';
import { Box } from '@mui/material';
import ChangePassword from '../account/ChangePassword';
import { Helmet } from 'react-helmet';

const Setting = () => (
  <>
    <Helmet>
      <title>
        Et-Proforma | Settings
      </title>
    </Helmet>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
       <ChangePassword/>
    </Box>
  </>
);

export default Setting