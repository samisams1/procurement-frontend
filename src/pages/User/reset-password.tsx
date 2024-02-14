import { gql, useMutation } from '@apollo/client';
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface ResetPasswordData {
  resetPassword: {
    id: string;
  };
}

const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPassword($input: ResetPasswordInput!) {
    resetPassword(input: $input) {
      id
    }
  }
`;

const ResetPasswordForm: React.FC = () => {
  const [resetPassword, { loading, error }] = useMutation<ResetPasswordData>(
    RESET_PASSWORD_MUTATION
  );

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get('email');
  const token = queryParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
 const navigate = useNavigate();
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      console.error('Passwords do not match');
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
        navigate('/home'); // Replace '/success' with the desired success page route
      }, 2000); // 2 seconds in milliseconds
    } catch (error: any) {
      console.error('Failed to reset password:', error.message);
      // Handle the error and display an appropriate message to the user
    }
  };

  return (
    <div className="reset-password-form">
      {loading && <div className="spinner">Loading...</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      {error && <div className="error-message">Error: {error.message}</div>}
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
      </form>
    </div>
  );
};

export default ResetPasswordForm;