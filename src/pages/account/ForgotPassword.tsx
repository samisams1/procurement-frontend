import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';

interface ForgotPasswordFormProps {
  // Props, if any
}

const FORGOT_PASSWORD_MUTATION = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email)
  }
`;

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = () => {
  const [email, setEmail] = useState('');
  const [forgotPassword, { loading, error }] = useMutation(FORGOT_PASSWORD_MUTATION);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Call the forgotPassword mutation
    forgotPassword({ variables: { email } })
      .then(() => {
        // Reset the form
        setEmail('');
        // Show a success message or perform any other action
        console.log('Password reset email sent successfully');
      })
      .catch((error) => {
        // Handle the error
        console.error('Error sending password reset email:', error);
      });
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <div>
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Loading...' : 'Reset Password'}
      </button>
      {error && <p>{error.message}</p>}
    </form>
  );
};

export default ForgotPasswordForm;