import React from 'react';
import { Grid, } from '@mui/material';
import LoginForm from '../../components/pageComponents/login/LoginForm';

const Login = () => (
 
    <Grid container spacing={2} justifyContent="center">
      <Grid item xs={12}>
      <LoginForm />
      </Grid>
    </Grid>

);

export default Login;




