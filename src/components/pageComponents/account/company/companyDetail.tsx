import React, { useContext, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Unstable_Grid2 as Grid
} from '@mui/material';
import { CurrentUser, UserContext } from '../../../../auth/UserContext';
export const CompanyDetail = () => {
  const { currentUser } = useContext(UserContext);
  const { firstName, lastName, role, email, username,address,phoneNumber } = currentUser as CurrentUser;
  const [values] = useState({
    firstName: firstName,
    lastName: lastName,
    email: email,
    role: role,
    username: username,
    country: address,
    phoneNumber:phoneNumber
  });
  const handleSubmit = () => {
    alert('samisams');
  };
  return (
    <form autoComplete="off" noValidate onSubmit={handleSubmit}>
      <Card>
        <CardHeader subheader="The information can be edited" title="Your Company Infrormation" />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid container spacing={3}>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  helperText="Please specify the first name"
                  label="Company Name"
                  name="firstName"
                  required
                  value={values.firstName}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField fullWidth label="Email" name="lastName" required value={values.lastName} />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField fullWidth label="Cotact Number" name="lastName" required value={values.lastName} />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField fullWidth label="Country" name="lastName" required value={values.lastName} />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField fullWidth label="City" name="email" required value={values.email} />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField fullWidth label="Sub City" name="role" type="text" value={values.role} />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField fullWidth label="House Number" name="country" required value={values.country} />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField fullWidth label="Specific Name" name="username" required value={username} />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField fullWidth label="phoneNumber" name="phoneNumber" required value={phoneNumber} />
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </form>
  );
};