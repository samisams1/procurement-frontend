import React, { useState } from 'react';
import { Alert, FormControl, Grid, InputAdornment, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Form, useForm } from '../../useForm';
import Button from '../../Button';
import Controls from '../../Controls';
import { gql, useMutation, useQuery } from '@apollo/client';
import { userInterface } from '../../../interface/interfaces';
import { USER_QUERY } from '../../../graphql/Users';
import { AccountCircle, EmailTwoTone, Lock, PhoneEnabledTwoTone } from '@mui/icons-material';
import ReactFlagsSelect from "react-flags-select";

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

const cities: { [key: string]: string[] } = {
  ET: ['Addis Ababa', 'Adama', 'Bahar dar'],
  // Add more country codes and cities as needed
};
const countryPhoneCodes: { [key: string]: string } = {
  ET: '+251', // Ethiopia
  AF: '+93', // Afghanistan
  AL: '+355', // Albania
  DZ: '+213', // Algeria
  // Add more country codes and phone codes as needed
};

export  const UserForm: React.FC<UserFormProps> = ({ selectedRole }) => {
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate =  useNavigate();
 // const [phoneNumber, setPhoneNumber] = useState('');
  const [selected, setSelected] = useState('');


    const handleCountrySelect = (value: string) => {
    setSelected(value);
  };


  const [createProfile] = useMutation(CREATE_USER_MUTATION, {
    refetchQueries: [{ query: USER_QUERY }],
  });
  const { loading, error, data } = useQuery<{ getCategories: Category[] }>(GET_CATEGORIES);


  //const formattedPhoneNumber = `${countryPhoneCodes[selected]} ${phoneNumber}`;


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
    country:'Ethiopia',
    city:'',
  };

  const validate = (fieldValues: userInterface = values): boolean => {
    let temp: userInterface = { ...errors };
    if ('firstName' in fieldValues) temp.firstName = fieldValues.firstName ? '' : 'This field is required.';
    if ('lastName' in fieldValues) temp.lastName = fieldValues.lastName ? '' : 'This field is required.';
    if ('role' in fieldValues) temp.role = fieldValues.role ? '' : 'This field is required.';
    if ('phoneNumber' in fieldValues) temp.phoneNumber = fieldValues.phoneNumber ? '' : 'This field is required.';
    if ('email' in fieldValues) temp.email = fieldValues.email ? '' : 'This field is required.';
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
  
            <div>
  <ReactFlagsSelect selected={selected} onSelect={handleCountrySelect} />
  {selected && cities[selected] && (
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
        {cities[selected].map((city: string) => (
         <MenuItem key={city} value={city}>
         {city}
       </MenuItem>
      ))}
                  </Select>
                
                  {errors.country && <Alert severity="error">{errors.country}</Alert>}
                  
                </FormControl>
                )}
</div>
            <Controls.Input 
                name="companyName"
                label="Company Name"
                value={values.companyName}
                onChange={handleInputChange}
                error={errors.companyName}
                fullWidth // Make input full width••••••••••••
                style={{ marginBottom: '1rem' }}
              />

          {selectedRole ==="SUPPLIER" &&(
          <div>
           
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
   {selected && (
        <div>
          <Controls.Input
            name="phoneNumber"
            label="PhoneNumber"
            value={values.phoneNumber}
            onChange={handleInputChange}
            error={errors.phoneNumber}
            fullWidth // Make input full width
            icon={<PhoneEnabledTwoTone />}
            style={{ marginBottom: '1rem' }}
            endAdornment={<InputAdornment position="start">{countryPhoneCodes[selected]}</InputAdornment>}
          />
        </div>
      )}
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
            
                <Controls.Input
  name="password"
  label="Password"
  value={values.password}
  onChange={handleInputChange}
  error={errors.password}
  fullWidth
  icon={<Lock />}

  style={{ marginBottom: '1rem' }}
  type="password" // Set the istartnput type to "password"
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