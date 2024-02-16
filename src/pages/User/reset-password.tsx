import { gql, useMutation } from '@apollo/client';
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { styled, Container, Grid } from '@mui/material';
import PageHeader from '../../components/PageHeader';

const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPassword($input: ResetPasswordInput!) {
    resetPassword(input: $input) {
      id
    }
  }
`;

const FormContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const FormTextField = styled(TextField)`
  margin-bottom: 20px;
  width: 100%;
`;

const ResetPasswordForm = () => {
  const [resetPassword, { loading }] = useMutation(RESET_PASSWORD_MUTATION);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get('email');
  const token = queryParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setErrorMessage('');
  };

  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    setErrorMessage('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    try {
      await resetPassword({
        variables: {
          input: {
            email: email!,
            password,
            token: token!,
          },
        },
      });

      setSuccessMessage('Password reset successful');
      setTimeout(() => {
        navigate('/home');
      }, 2000);
    } catch (error) {
      setErrorMessage('Failed to reset password');
    }
  };

  return (
    <Grid> 
      <PageHeader
      title="Change Password"
      subTitle="please change password"
      />
    <FormContainer>
      {loading && <div className="spinner">Loading...</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      <form onSubmit={handleSubmit}>
        <FormTextField
          type="password"
          id="password"
          label="New Password"
          value={password}
          onChange={handlePasswordChange}
          required
        />
        <FormTextField
          type="password"
          id="confirmPassword"
          label="Confirm Password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          required
        />
        <Button variant="contained" color="primary" type="submit">
          Reset Password
        </Button>
      </form>
    </FormContainer>
    </Grid>
  );
};

export default ResetPasswordForm;