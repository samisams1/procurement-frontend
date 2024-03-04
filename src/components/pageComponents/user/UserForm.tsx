import React, { useState } from 'react';
import { Checkbox,FormControlLabel,Alert, Button, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Form, useForm } from '../../useForm';
import Controls from '../../Controls';
import { gql, useMutation, useQuery } from '@apollo/client';
import { userInterface } from '../../../interface/interfaces';
import { USER_QUERY } from '../../../graphql/Users';
import { AccountCircle, EmailTwoTone, Lock, PhoneEnabledTwoTone } from '@mui/icons-material';
import ReactFlagsSelect from "react-flags-select";
import { countryPhoneCodes } from '../../common/countryPhoneCodes';
import { cities } from '../../common/countryCitiesCodes';

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
export  const UserForm: React.FC<UserFormProps> = ({ selectedRole }) => {
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  //const [agreeMessage, setAgreeMessage] = useState('');
  const navigate =  useNavigate();
  const [selected, setSelected] = useState('');

  const [loadingRegister, setLoadingRgister] = useState(false);
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
    if ('phoneNumber' in fieldValues && fieldValues.phoneNumber?.trim()) {
      const phoneNumber = fieldValues.phoneNumber.trim();
      const phoneNumberRegex = /^0[0-9]{9}$|^[1-9][0-9]{8}$/; // Regex pattern for 10-digit number starting with 0 or 9-digit number starting with a non-zero digit
    
      if (phoneNumber === '') {
        temp.phoneNumber = 'This field is required.';
      } else if (!phoneNumberRegex.test(phoneNumber)) {
        temp.phoneNumber = 'Invalid phone number. Please enter a 10-digit number starting with 0 or a 9-digit number starting with a non-zero digit.';
      } else {
        temp.phoneNumber = '';
      }
    }

    if ('email' in fieldValues) {
      const email = fieldValues.email;
    
      if (!email) {
        temp.email = 'This field is required.';
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValidEmail = emailRegex.test(email);
    
        if (!isValidEmail) {
          temp.email = 'Please enter a valid email address.';
        } else {
          temp.email = '';
        }
      }
    }
    if ('username' in fieldValues) temp.username = fieldValues.username ? '' : 'This field is required.';
    if(selectedRole ==="SUPPLIER"){
      if ('companyName' in fieldValues) temp.companyName = fieldValues.companyName ? '' : 'This field is required.';
      if ('category' in fieldValues) temp.category = fieldValues.category ? '' : 'This field is required.';
    }
    if ('password' in fieldValues) {
  const password = fieldValues.password.trim();
  
  if (password === '') {
    temp.password = 'This field is required.';
  } else if (password.length < 4) {
    temp.password = 'Password should have at least 4 characters.';
  } else {
    temp.password = '';
  }
}
    setErrors({
      ...temp,
    });
    return fieldValues === values ? Object.values(temp).every((x) => x === '') : false;
  };

  const { values, errors, setErrors, handleInputChange, resetForm }: any = useForm(initialFValues, true, validate);
 
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (!isChecked) {
    //  setAgreeMessage('Please agree to the terms and conditions');
    }
    e.preventDefault();
   
    console.log(values);
    if (validate()) {
      try {
        setLoadingRgister(true);
        await createProfile({
          variables: { input: values }, // Provide the "input" variable with the form values
        });
  
        setSuccessMessage('User created successfully!');
         setLoadingRgister(false);
        resetForm();
        setTimeout(() => {
          setSuccessMessage('');
          
          navigate(`/acountCreated/${values.email}`);
        }, 5000); // Remove success message after 5 seconds
      } catch (error:any) {
        setErrorMessage(error.message);
        setLoadingRgister(false);
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
 
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h6" style={{ color: '#00b0ad' }}>
        {selectedRole} REGISTRATION
      </Typography>
      <Form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <div>
              <ReactFlagsSelect selected={selected} searchable onSelect={handleCountrySelect} />
         
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
              placeholder="Please enter your company name"
              value={values.companyName}
              onChange={handleInputChange}
              error={errors.companyName}
              fullWidth
              style={{ marginBottom: '1rem' }}
            />
            {selectedRole === 'SUPPLIER' && (
              <div>
                <FormControl fullWidth>
                  <InputLabel id="category-label">Business Types</InputLabel>
                  <Select
                    label="business Types"
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
              placeholder="Please enter your first name"
              value={values.firstName}
              onChange={handleInputChange}
              error={errors.firstName}
              fullWidth
              icon={<AccountCircle />}
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
              placeholder="Please enter your last name "
              value={values.lastName}
              onChange={handleInputChange}
              error={errors.lastName}
              fullWidth
              icon={<AccountCircle />}
              style={{ marginBottom: '1rem' }}
            />
            <Controls.Input
              name="username"
              label="Username"
              value={values.username}
              onChange={handleInputChange}
              placeholder="Please enter your user "
              error={errors.username}
              fullWidth
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
                  placeholder="0973316377"
                  onChange={handleInputChange}
                  error={errors.phoneNumber}
                  fullWidth
                  icon={<PhoneEnabledTwoTone />}
                  style={{ marginBottom: '1rem' }}
                  secondField={countryPhoneCodes[selected]}
                />
              </div>
            )}
            <Controls.Input
              name="email"
              label="Email"
              value={values.email}
              placeholder="example@example.com"
              onChange={handleInputChange}
              error={errors.email}
              fullWidth
              icon={<EmailTwoTone />}
              style={{ marginBottom: '1rem' }}
              inputProps={{
                autoComplete: 'email',
              }}
            />
            <Controls.Input
              name="password"
              label="Password"
              placeholder="********"
              value={values.password}
              onChange={handleInputChange}
              error={errors.password}
              fullWidth
              icon={<Lock />}
              style={{ marginBottom: '1rem' }}
              type="password"
              inputProps={{ autoComplete: 'off' }}
            />
          </Grid>
          <Grid item xs={12}>
          {successMessage && (
        <Alert variant="filled" severity="success" style={{ marginTop: 10 }}>
          {successMessage}
        </Alert>
      )}
      {errorMessage && (
        <Alert variant="filled" severity="error" style={{ marginTop: 10 }}>
          {errorMessage}
        </Alert>
      )}
         <FormControlLabel
          control={<Checkbox checked={isChecked} onChange={handleCheckboxChange} />}
          label="I agree to the terms and conditions"
        /> 
          <Button
        type="submit"
        fullWidth
        disabled={loadingRegister}
        style={{
          color: loadingRegister ? 'red' : '#ffffff',
          backgroundColor: '#00b0ad',
          marginTop: 10,
        }}
      >
        {loadingRegister ? (
          <CircularProgress size={24} style={{ color: 'red' }} />
        ) : (
          'Submit'
        )}
      </Button>

      <Button
        onClick={resetForm}
        fullWidth
        disabled={loadingRegister}
        style={{ backgroundColor: '#ccc', color: '#ffffff', marginTop: 10 }}
      >
        Reset
      </Button>
          </Grid>
        </Grid>
      </Form>
      <Grid container justifyContent="flex-end" alignItems="center" style={{ marginTop: 10 }}>
        <Grid item></Grid>
      </Grid>
    </div>
    </div>
  );
};