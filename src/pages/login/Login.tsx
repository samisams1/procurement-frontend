import React from 'react';
import { Grid, } from '@mui/material';
import LoginForm from '../../components/pageComponents/login/LoginForm';

const Login = () => (
 
  <Grid container spacing={1}>
  <Grid item xs={12}>
      <LoginForm />
      </Grid>
    </Grid>

);

export default Login;




