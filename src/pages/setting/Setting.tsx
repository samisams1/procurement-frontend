import React from 'react';
import { Box, Container, Stack } from '@mui/material';
import ChangePassword from '../account/ChangePassword';
import { Helmet } from 'react-helmet';

const Setting = () => (
  <>
    <Helmet>
      <title>
        Settings | Seblewongale
      </title>
    </Helmet>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3}>
         <ChangePassword/>
        </Stack>
      </Container>
    </Box>
  </>
);

export default Setting