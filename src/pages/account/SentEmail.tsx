import { Button, Typography, Box } from '@mui/material';
import React from 'react';
import {  useParams } from 'react-router-dom';

const SentEmail: React.FC = () => {
  const { email } = useParams<{ email?: string }>();
  const handleVerifyClick = () => {
    window.location.href = 'https://mail.google.com/';
  };
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
    >
      <Typography variant="h6" gutterBottom>
        Email Sent successfully.
      </Typography>
      <Typography variant="body1" gutterBottom>
        Please check your email ({email}) to reset your account.
      </Typography>
      <Button variant="contained" color="primary" onClick={handleVerifyClick}>
        Reset Account
      </Button>
    </Box>
  );
};

export default SentEmail;