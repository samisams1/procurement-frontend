import React, { useContext, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Unstable_Grid2 as Grid
} from '@mui/material';
import { UserContext,CurrentUser } from '../../../auth/UserContext';
export const SuppllierProfileDetails = () => {
  const { currentUser } = useContext(UserContext);
  const { firstName, lastName, role, email, username } = currentUser as CurrentUser;
  const [values] = useState({
    firstName: firstName,
    lastName: lastName,
    email: email,
    role: role,
    username: username,
    country: 'Ethiopia'
  });
  const handleSubmit = () => {
    alert('samisams');
  };
  return (
    <form autoComplete="off" noValidate onSubmit={handleSubmit}>
      <Card>
        <CardHeader subheader="The Supplier Information can be edited" title="Supplier Profile" />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid container spacing={3}>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  helperText="Please specify the first name"
                  label="First name"
                  name="firstName"
                  required
                  value={values.firstName}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField fullWidth label="Name" name="lastName" required value={values.lastName} />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField fullWidth label="Category Type " name="email" required value={values.email} />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField fullWidth label="Description" name="role" type="text" value={values.role} />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField fullWidth label="Address" name="country" required value={values.country} />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField fullWidth label="Phone Number" name="username" required value={username} />
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </form>
  );
};