import { gql, useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const VERIFY_USER_MUTATION = gql`
  mutation VerifyUser($token: String!) {
    verifyUser(token: $token)
  }
`;

const VerifyUser: React.FC = () => {
  const location = useLocation();
  //const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState<'initial' | 'success' | 'error'>('initial');
  const [verifyUser] = useMutation(VERIFY_USER_MUTATION);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');

    const handleVerifyUser = async () => {
      try {
        await verifyUser({
          variables: { token },
        });
        // Handle successful verification, e.g., show a success message or redirect to a success page
        console.log('User verification successful!');
        setVerificationStatus('success');
      } catch (error) {
        // Handle error, e.g., show an error message
        console.error('User verification failed:', error);
        setVerificationStatus('error');
      }
    };

    if (token) {
      handleVerifyUser();
    } else {
      // Handle missing or invalid token, e.g., show an error message or redirect to an error page
      console.error('Invalid verification token.');
      setVerificationStatus('error');
    }
  }, [location.search, verifyUser]);

  if (verificationStatus === 'success') {
  // navigate('/login')
    return <p>User verification successful!</p>;
  } else if (verificationStatus === 'error') {
    // Render error message or redirect to an error page
    return <p>User verification failed. Please try again.</p>;
  }

  return (
    <div>
      <p>Please wait while we verify your email...</p>
    </div>
  );
};

export default VerifyUser;