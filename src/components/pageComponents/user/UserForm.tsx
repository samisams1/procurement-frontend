import React, { useState } from 'react';
import {
  Alert,
  Grid,
  Box,
  Container,
  Typography,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Form, useForm } from '../../useForm';
import Button from '../../Button';
import Controls from '../../Controls';
import { useMutation } from '@apollo/client';
import { userInterface } from '../../../interface/interfaces';
import { CREATE_USER_MUTATION, USER_QUERY } from '../../../graphql/Users';

export const UserForm = () => {
  const [createProfile] = useMutation(CREATE_USER_MUTATION, {
    refetchQueries: [{ query: USER_QUERY }],
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const RoleEnum = {
    CUSTOMER: 'CUSTOMER',
    SUPPLIER: 'SUPPLIER',
  };

  const initialFValues: userInterface = {
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    role: RoleEnum.CUSTOMER,
    status: '',
  };

  const validate = (fieldValues: userInterface = values): boolean => {
    let temp: userInterface = { ...errors };
    if ('firstName' in fieldValues) temp.firstName = fieldValues.firstName ? '' : 'This field is required.';
    if ('lastName' in fieldValues) temp.lastName = fieldValues.lastName ? '' : 'This field is required.';
    if ('role' in fieldValues) temp.role = fieldValues.role ? '' : 'This field is required.';
    if ('email' in fieldValues) temp.email = fieldValues.email ? '' : 'This field is required.';
    if ('username' in fieldValues) temp.username = fieldValues.username ? '' : 'This field is required.';
    if ('password' in fieldValues) temp.password = fieldValues.password ? '' : 'This field is required.';

    setErrors({
      ...temp,
    });
    return fieldValues === values ? Object.values(temp).every((x) => x === '') : false;
  };

  const { values, errors, setErrors, handleInputChange, resetForm }: any = useForm(initialFValues, true, validate);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
      createProfile({
        variables: values,
      })
        .then(() => {
          setSuccessMessage('User created successfully!');
          resetForm();
          setTimeout(() => {
            setSuccessMessage('');
          }, 5000); // Remove success message after 5 seconds
        })
        .catch((error) => {
          setErrorMessage(error.message);
          setTimeout(() => {
            setErrorMessage('');
          }, 5000); // Remove error message after 5 seconds
        });
    }
  };

  return (
    <Container
      maxWidth="sm"
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box p={4} boxShadow={3} bgcolor="white" borderRadius={10}>
        <Typography variant="h6" style={{ color: '#4F46E5' }}>
          User Registration
        </Typography>
        <Form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controls.Input
                name="firstName"
                label="First Name"
                value={values.firstName}
                onChange={handleInputChange}
                error={errors.firstName}
                fullWidth // Make input full width
                style={{ marginBottom: '1rem' }}
              />
              <Controls.Input
                name="lastName"
                label="Last Name"
                value={values.lastName}
                onChange={handleInputChange}
                error={errors.lastName}
                fullWidth // Make input full width
                style={{ marginBottom: '1rem' }}
              />
              <Controls.Select
                name="role"
                label="Role"
                value={values.role}
                onChange={handleInputChange}
                options={[
                  { id: '1', label: 'customer', value: RoleEnum.CUSTOMER },
                  { id: '2', label: 'supplier', value: RoleEnum.SUPPLIER },
                ]}
                error={errors.role}
               // fullWidth // Make input full width
              // style={{ marginBottom: '1rem' }}
              />
              <Controls.Input
                name="username"
                label="Username"
                value={values.username}
                onChange={handleInputChange}
                error={errors.username}
                fullWidth // Make input full width
                style={{ marginBottom: '1rem' }}
              />
              <Controls.Input
                name="email"
                label="Email"
                value={values.email}
                onChange={handleInputChange}
                error={errors.email}
                fullWidth // Make input full width
                style={{ marginBottom: '1rem' }}
              />
              <Controls.Input
                name="password"
                label="Password"
                value={values.password}
                onChange={handleInputChange}
                error={errors.password}
                fullWidth // Make input full width
                style={{ marginBottom: '1rem' }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                text="Submit"
                fullWidth
                style={{ backgroundColor: '#4F46E5', color: '#fff' }}
              />
              <Button
                text="Reset"
                onClick={resetForm}
                fullWidth
                style={{ backgroundColor: '#ccc', color: '#000', marginTop: 10 }}
              />
            </Grid>
          </Grid>
          {successMessage && (
            <Alert variant="outlined" severity="success" style={{ marginTop: 10 }}>
              {successMessage}
            </Alert>
          )}
          {errorMessage && (
            <Alert variant="outlined" severity="error" style={{ marginTop: 10 }}>
              {errorMessage}
            </Alert>
          )}
        </Form>
        <Grid container justifyContent="flex-end" alignItems="center" style={{ marginTop: 10 }}>
          <Grid item>
    <Typography variant="body2" style={{ marginTop: '1rem', textAlign: 'center' }}>
    Already have an account??   <RouterLink   style={{ color: '#4F46E5' }} to="/login">Login</RouterLink>  
        </Typography>


          </Grid>  
        </Grid>
      </Box>
    </Container>
  );
};