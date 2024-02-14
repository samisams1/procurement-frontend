import { useMutation, gql } from '@apollo/client';
import { Grid, Button as MuiButton, InputBase as MuiInputBase } from '@mui/material';
import React, { useState } from 'react';
import { styled } from '@mui/material/styles';

const FORGOT_PASSWORD_MUTATION = gql`
mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email)
}
`;

const Button = styled(MuiButton)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  transition: 'background-color 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.secondary.main,
    boxShadow: `0px 0px 10px 3px ${theme.palette.secondary.main}`,
    transform: 'scale(1.1)',
  },
  height: '60px',
  borderRadius: '30px',
  padding: theme.spacing(0, 4),
  '& .MuiButton-label': {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
}));

const Input = styled(MuiInputBase)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(1),
  color: theme.palette.text.primary,
  border: `1px solid ${theme.palette.primary.main}`,
  borderRadius: '30px',
  '& .MuiInputBase-input': {
    transition: theme.transitions.create('width'),
    width: '100%',
    '&:focus': {
      width: '100%',
    },
  },
}));

const PasswordResetForm: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const [forgotPassword] = useMutation(FORGOT_PASSWORD_MUTATION);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await forgotPassword({
        variables: {
            email: email
        }
      });
      console.log('Password reset request sent');
    } catch (error) {
      console.error('Failed to send password reset request:', error);
    }
  };

  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid item xs={12}>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email:</label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              required
              placeholder="Enter your email"
            />
          </div>
          <div style={{ marginTop: '20px' }}>
            <Button type="submit">Reset Password</Button>
          </div>
        </form>
      </Grid>
    </Grid>
  );
};

export default PasswordResetForm;