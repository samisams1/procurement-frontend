import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

const Spinner = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <CircularProgress
        style={{
          color: '#f44336',
          width: 80,
          height: 80,
        }}
      />
    </div>
  );
};

export default Spinner;