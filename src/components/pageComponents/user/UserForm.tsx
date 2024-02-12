import React, { useState } from 'react';
import { Alert, FormControl, Grid, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Form, useForm } from '../../useForm';
import Button from '../../Button';
import Controls from '../../Controls';
import { gql, useMutation, useQuery } from '@apollo/client';
import { userInterface } from '../../../interface/interfaces';
import { USER_QUERY } from '../../../graphql/Users';
import { AccountCircle, EmailTwoTone, Lock, PhoneEnabledTwoTone } from '@mui/icons-material';
//import PhoneInput from 'react-phone-number-input';
interface Category {
  id: string;
  name: string;
}
const GET_CATEGORIES = gql`
  query GetCategories {
    getCategories {
      id
      name
    }
  }
`;
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
  Customer = 'CUSTOMER',
  Supplier = 'SUPPLIER',
}
interface UserFormProps {
  selectedRole: Role;
}
const countryData = [
  {
    name: 'Ethiopia',
    cities: ['Addis Ababa', 'Adama', 'Bahar dar'],
  },
  {
    name: 'Afghanistan',
    cities: ['Kabul', 'Herat', 'Mazar-i-Sharif'],
  },
  {
    name: 'Albania',
    cities: ['Tirana', 'Durres', 'Vlore'],
  },
  {
    name: 'Algeria',
    cities: ['Algiers', 'Oran', 'Constantine'],
  },
 
  // Add more countries and cities as needed
];
export  const UserForm: React.FC<UserFormProps> = ({ selectedRole }) => {
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate =  useNavigate();
  const [createProfile] = useMutation(CREATE_USER_MUTATION, {
    refetchQueries: [{ query: USER_QUERY }],
  });
  const { loading, error, data } = useQuery<{ getCategories: Category[] }>(GET_CATEGORIES);




  const initialFValues: userInterface = {
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    role: selectedRole,
    companyName: '',
    phoneNumber:'',
    category:'',
    country: '',
    city:'',
  };

  const validate = (fieldValues: userInterface = values): boolean => {
    let temp: userInterface = { ...errors };
    if ('firstName' in fieldValues) temp.firstName = fieldValues.firstName ? '' : 'This field is required.';
    if ('lastName' in fieldValues) temp.lastName = fieldValues.lastName ? '' : 'This field is required.';
    if ('role' in fieldValues) temp.role = fieldValues.role ? '' : 'This field is required.';
    if ('email' in fieldValues) {
      if (fieldValues.email) {
        // Validate email format using a regular expression
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(fieldValues.email)) {
          temp.email = 'Invalid email address.';
        } else {
          temp.email = '';
        }
      } else {
        temp.email = 'This field is required.';
      }
    }
    if ('phoneNumber' in fieldValues) {
      if (fieldValues.phoneNumber) {
        // Validate phone number format using a regular expression
        const phoneRegex = /^\d{10}$/; // Assuming a 10-digit phone number format
        if (!phoneRegex.test(fieldValues.phoneNumber)) {
          temp.phoneNumber = 'Invalid phone number format.';
        } else {
          temp.phoneNumber = '';
        }
      } else {
        temp.phoneNumber = 'This field is required.';
      }
    }
    if ('username' in fieldValues) temp.username = fieldValues.username ? '' : 'This field is required.';
    if(selectedRole ==="SUPPLIER"){
      if ('companyName' in fieldValues) temp.companyName = fieldValues.companyName ? '' : 'This field is required.';
      if ('category' in fieldValues) temp.category = fieldValues.category ? '' : 'This field is required.';
    }
    if ('password' in fieldValues) temp.password = fieldValues.password ? '' : 'This field is required.';

    setErrors({
      ...temp,
    });
    return fieldValues === values ? Object.values(temp).every((x) => x === '') : false;
  };

  const { values, errors, setErrors, handleInputChange, resetForm }: any = useForm(initialFValues, true, validate);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(values);
    if (validate()) {
      try {
        await createProfile({
          variables: { input: values }, // Provide the "input" variable with the form values
        });
  
        setSuccessMessage('User created successfully!');
        resetForm();
        setTimeout(() => {
          setSuccessMessage('');
          // setLoading(false);
          navigate(`/acountCreated/${values.email}`);
        }, 2000); // Remove success message after 5 seconds
      } catch (error:any) {
        setErrorMessage(error.message);
        setTimeout(() => {
          setErrorMessage('');
        }, 5000); // Remove error message after 5 seconds
      }
    }
  };
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
     <div> 
        <Typography variant="h6" style={{ color: '#00b0ad' }}>
        {selectedRole} REGISTRATION
        </Typography>
        <Form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
          {selectedRole ==="SUPPLIER" &&(
          <div>
            <Typography>Company Information</Typography>
            <Controls.Input 
                name="companyName"
                label="Company Name"
                value={values.companyName}
                onChange={handleInputChange}
                error={errors.companyName}
                fullWidth // Make input full width••••••••••••
                style={{ marginBottom: '1rem' }}
              />

             <FormControl fullWidth>
                  <InputLabel id="category-label">Category</InputLabel>
                  <Select
                    label="category-label"
                    id="category"
                    name="category"
                    value={values.category}
                    onChange={handleInputChange}
                    error={errors.category}
                  >
                    {data?.getCategories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.category && <Alert severity="error">{errors.category}</Alert>}
                </FormControl>

              <Typography>User Information</Typography>
          </div>
        

          )}
              <Controls.Input
                name="firstName"
                label="First Name"
                value={values.firstName}
                onChange={handleInputChange}
                error={errors.firstName}
                fullWidth 
                icon={<AccountCircle />} // Add icon for the field
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
                icon={<AccountCircle />}
                style={{ marginBottom: '1rem' }}
              />

                   <Controls.Input
                name="username"
                label="Username"
                value={values.username}
                onChange={handleInputChange}
                error={errors.username}
                fullWidth // Make input full width
                icon={<AccountCircle />}
                style={{ marginBottom: '1rem' }}
                inputProps={{ autoComplete: 'off' }}
              />
             
             <Controls.Input
                name="phoneNumber"
                label="PhoneNumber"
                value={values.phoneNumber}
                onChange={handleInputChange}
                error={errors.phoneNumber}
                fullWidth // Make input full width
                icon={<PhoneEnabledTwoTone />}
                style={{ marginBottom: '1rem' }}
              />

              <Controls.Input
                name="email"
                label="Email"
                value={values.email}
                onChange={handleInputChange}
                error={errors.email}
                fullWidth // Make input full width
                icon={<EmailTwoTone />}
                style={{ marginBottom: '1rem' }}
              />
               <FormControl fullWidth style={{ marginBottom: '1rem' }}>
                  <InputLabel id="Country-label">Country</InputLabel>
                  <Select
                    label="Country-label"
                    id="country"
                    name="country"
                    value={values.country}
                    onChange={handleInputChange}
                    error={errors.country}
                  >
                    {countryData.map((country) => (
                      <MenuItem key={country.name} value={country.name}>
                        {country.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.country && <Alert severity="error">{errors.country}</Alert>}
                  
                </FormControl>
                <FormControl fullWidth style={{ marginBottom: '1rem' }}>
                  <InputLabel id="Country-label">City</InputLabel>
                  <Select
                    label="City"
                    id="city"
                    name="city"
                    value={values.City}
                    onChange={handleInputChange}
                    error={errors.City}
                  >
                    {countryData
          .find((country) => country.name === values.country)
          ?.cities.map((city) => (
             <MenuItem key={city} value={city}>
             {city}
           </MenuItem>
          ))}
                  </Select>
                  {errors.country && <Alert severity="error">{errors.country}</Alert>}
                  
                </FormControl>
                <Controls.Input
  name="password"
  label="Password"
  value={values.password}
  onChange={handleInputChange}
  error={errors.password}
  fullWidth
  icon={<Lock />}

  style={{ marginBottom: '1rem' }}
  type="password" // Set the input type to "password"
  inputProps={{ autoComplete: 'off' }}
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

          </Grid>  
        </Grid>
      </div>
  );
};