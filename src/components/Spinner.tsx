import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const Spinner = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5', // Set the background color here
      }}
    >
      <CircularProgress
        size={80}
        color="primary"
        sx={{
          color: '#f44336', // Set the progress color here
        }}
      />
    </Box>
  );
};

export default Spinner;