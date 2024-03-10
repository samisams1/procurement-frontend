import React, { useState, useEffect } from 'react';
import { Snackbar } from '@mui/material';

const FlashMessage = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
      }, 2000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
      }, 2000);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={open}
      autoHideDuration={2000}
      onClose={handleClose}
      message={isOnline ? 'Connected!' : 'No Connection!'}
      ContentProps={{
        className: isOnline ? 'flash-message connected' : 'flash-message no-connection',
      }}
      style={{ marginTop: '50px' }}
    />
  );
};

export default FlashMessage;