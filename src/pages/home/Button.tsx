import React from 'react';
import { styled, Button as MuiButton } from '@mui/material';

const Button = styled(MuiButton)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  transition: 'background-color 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.secondary.main,
    boxShadow: `0px 0px 10px 3px ${theme.palette.secondary.main}`,
    transform: 'scale(1.1)',
  },
  height: '60px',
  borderRadius: '30px',
  padding: theme.spacing(0, 4),
  '& .MuiButton-label': {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
}));

export default Button;