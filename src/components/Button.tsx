import React from 'react';
import { Button as MuiButton } from '@mui/material';

export default function Button(props: any) {
  const { text, size, color, variant, onClick, ...other } = props;

  return (
    <MuiButton
      variant={variant || 'contained'}
      size={size || 'large'}
      color={color || 'primary'}
      onClick={onClick}
      sx={{
        '&:hover': {
          backgroundColor: '#00b0ad', // Change the background color on hover
          color: '#ffffff', // Change the text color on hover
        },
      }}
      style={{ backgroundColor: color || '#00b0ad' }} // Set default button color
      {...other}
    >
      {text}
    </MuiButton>
  );
}