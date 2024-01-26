import React from 'react';
import { useParams } from 'react-router-dom';

/*interface AccountCreationProps {
  email: string;
}*/

const AccountCreation: React.FC = () => {
    const { email } = useParams<{ email?: string }>(); 
     const handleVerifyClick = () => {
    // Handle the action when the user clicks on the verification link
    // This could involve making an API call to mark the account as verified
    // and redirecting the user to a success page.
  };

  return (
    <div>
      <p>Account created successfully.</p>
      <p>Please check your email ({email}) to verify your account.</p>
      <button onClick={handleVerifyClick}>Verify Account</button>
    </div>
  );
};

export default AccountCreation;