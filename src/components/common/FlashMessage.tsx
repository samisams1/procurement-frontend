import React, { useState, useEffect } from 'react';
import { Snackbar } from '@mui/material';
import SignalWifiOffIcon from '@mui/icons-material/SignalWifiOff';

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
      autoHideDuration={null}
      onClose={handleClose}
      message={
        isOnline ? (
          'Connected!'
        ) : (
          <span>
            <SignalWifiOffIcon style={{ marginRight: '8px', fontSize: '18px' }} />
            No Internet Connection! Please check your network connection.
          </span>
        )
      }
      ContentProps={{
        className: isOnline ? 'flash-message connected' : 'flash-message no-connection',
      }}
      style={{ marginTop: '50px' }}
    />
  );
};

export default FlashMessage;