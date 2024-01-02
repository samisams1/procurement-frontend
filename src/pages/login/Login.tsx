import React from 'react';
import { Box, Container } from '@mui/material';
import { Helmet } from 'react-helmet';
import LoginForm from '../../components/pageComponents/login/LoginForm';

const Login = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    height="91vh"
    bgcolor="white" // Set the background color to white
    border="1px solid #eee" // Add a border with a light gray color
  >
    <Box p={3}>
      <Helmet>
        <title>Login | itrustu2</title>
      </Helmet>
      <Box component="main" sx={{ flexGrow: 1, py: 2 }}>
        <Container maxWidth="xl" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <LoginForm />
        </Container>
      </Box>
    </Box>
  </Box>
);

export default Login;