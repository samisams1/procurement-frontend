import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { Alert, Typography, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface ForgotPasswordFormProps {
  // Props, if any
}

interface UserInterface {
  email: string;
}

const FORGOT_PASSWORD_MUTATION = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email)
  }
`;

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = () => {
  const initialFormValues: UserInterface = {
    email: '',
  };

  const [values, setValues] = useState<UserInterface>(initialFormValues);
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [forgotPassword, { loading, error }] = useMutation(FORGOT_PASSWORD_MUTATION);

  const validate = (fieldValues: UserInterface = values): boolean => {
    let isValid = true;
    const temp: UserInterface = { ...initialFormValues };

    if (!fieldValues.email) {
      temp.email = 'This field is required.';
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValidEmail = emailRegex.test(fieldValues.email);

      if (!isValidEmail) {
        temp.email = 'Please enter a valid email address.';
        isValid = false;
      }
    }

    setValues({ ...fieldValues });
    return isValid;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      // Call the forgotPassword mutation
      forgotPassword({ variables: { email: values.email } })
        .then(() => {
          // Reset the form
          setValues(initialFormValues);
          setSuccessMessage('You have successfully sent the email. Please check your email!');
          setTimeout(() => {
            setSuccessMessage('');
            navigate(`/sentEmail/${values.email}`);
          }, 5000); // Remove success message after 5 seconds
        })
        .catch((error: any) => {
          setErrorMessage(error.message);
          setTimeout(() => {
            setErrorMessage('');
          }, 5000); // Remove error message after 5 seconds
        });
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <div>
        <Typography variant="h6" style={{ color: '#00b0ad' }}>
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
        </Typography>
        <TextField
          id="email"
          label="Email"
          variant="outlined"
          value={values.email}
          onChange={(e) => setValues({ ...values, email: e.target.value })}
          fullWidth
          margin="normal"
          error={Boolean(initialFormValues.email)}
          helperText={initialFormValues.email || ''}
        />
      </div>
      <Button type="submit" variant="contained" disabled={loading}>
        {loading ? 'Loading...' : 'Reset Password'}
      </Button>
      {error && <p>{error.message}</p>}
    </form>
  );
};

export default ForgotPasswordForm;