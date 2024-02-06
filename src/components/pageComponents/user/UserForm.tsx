import React, { useState } from 'react';
import { Alert, Grid, Typography } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Form, useForm } from '../../useForm';
import Button from '../../Button';
import Controls from '../../Controls';
import { gql, useMutation } from '@apollo/client';
import { userInterface } from '../../../interface/interfaces';
import { USER_QUERY } from '../../../graphql/Users';

const CREATE_USER_MUTATION = gql`
mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
    id
    username
    email
    password
    firstName
    lastName
    role
    updatedAt
  }
}
`;
enum Role {
  Customer = 'ADMIN',
  Supplier = 'SUPPLIER',
}
interface UserFormProps {
  selectedRole: Role;
}
export  const UserForm: React.FC<UserFormProps> = ({ selectedRole }) => {
  const [createProfile] = useMutation(CREATE_USER_MUTATION, {
    refetchQueries: [{ query: USER_QUERY }],
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate =  useNavigate();
  const initialFValues: userInterface = {
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    role: selectedRole,
    companyName: '',
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
    console.log(values);
    if (validate()) {
      createProfile({
        variables: { input: values }, // Provide the "input" variable with the form values
      })
        .then(() => {
          setSuccessMessage('User created successfully!');
          resetForm();
          setTimeout(() => {

            setSuccessMessage('');
           // setLoading(false);
            navigate(`/acountCreated/${'samisams@gmail.com'}`);
          }, 2000); // Remove success message after 5 seconds
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
     <div> 
        <Typography variant="h6" style={{ color: '#00b0ad' }}>
        {selectedRole} REGISTRATION
        </Typography>
        <Form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
            {selectedRole === "SUPPLIER" && (
              <Controls.Input 
                name="companyName"
                label="Company Name"
                value={values.companyName}
                onChange={handleInputChange}
                error={errors.companyName}
                fullWidth // Make input full width
                style={{ marginBottom: '1rem' }}
              />
 )
}
              <Controls.Input
                name="firstName"
                label="First Name"
                value={values.firstName}
                onChange={handleInputChange}
                error={errors.firstName}
                fullWidth 
                sx={{
                  width: '100%',
                  marginTop: '1rem',
                  marginBottom: '1rem',
                  paddingBottom: '0.5rem',
                }}
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
    Already have an account??   <RouterLink   style={{ color: '#00b0ad' }} to="/login">Login</RouterLink>  
        </Typography>


          </Grid>  
        </Grid>
      </div>
  );
};