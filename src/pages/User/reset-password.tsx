import { gql, useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPassword($input: ResetPasswordInput!) {
    resetPassword(input: $input) {
        id
    }
  }
`;
const ResetPasswordForm: React.FC = () => {
    // Code for extracting email and token...
    const [resetPassword] = useMutation(RESET_PASSWORD_MUTATION);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email');
    const token = queryParams.get('token');

    
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
  
    
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
    };
  
    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setConfirmPassword(e.target.value);
    };
  
  
  

      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        if (password !== confirmPassword) {
          console.error('Passwords do not match');
          return;
        }
    
        try {
          await resetPassword({
            variables: {
              input: {
                email: email,
                password: password,
                token: token
              }
            }
          });
          console.log('Password reset successful');
          // Redirect the user to a success page or perform any other desired action
        } catch (error) {
          console.error('Failed to reset password:', error);
          // Handle the error and display an appropriate message to the user
        }
      };
  
    return (
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="password">New Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            required
          />
        </div>
        <button type="submit">Reset Password</button>
        <h1>{token}</h1>
      </form>
    );
  };
  
  export default ResetPasswordForm;
