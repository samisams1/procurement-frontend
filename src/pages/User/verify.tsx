import { gql, useMutation } from '@apollo/client';
import { Box, Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Popup from '../../components/Popup';
import Login from '../login/Login';

const VERIFY_USER_MUTATION = gql`
mutation VerifyUser($token: String!) {
  verifyUser(token: $token) {
    isVerified
  }
}
`;


const VerifyUser: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openRegisterPopup, setOpenRegisterPopup] = useState(false);
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
  const handleLogin = () => {
    setOpenRegisterPopup(true); // Open the register popup

  };
  const handleHome = () => {
    navigate('/');

  };
  if (verificationStatus === 'success') {
  // navigate('/login')
      return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
           <Box textAlign="center">
  <Typography variant="h6">User verification successful!</Typography>
  <Box display="flex" justifyContent="center" mt={4}>
    <Button variant="contained" color="primary" onClick={handleLogin} style={{ marginRight: '10px' }}>
      Login
    </Button>
    <Button variant="contained" color="primary" onClick={handleHome} style={{ marginLeft: '10px' }}>
      Home
    </Button>
  </Box>
</Box>
        <Popup title="Choose your Account" openPopup={openRegisterPopup} setOpenPopup={setOpenRegisterPopup}>
        <Login />
      </Popup>
      </Box>
    );
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