import React from 'react';
import { TextField, InputAdornment, IconButton, Box } from '@mui/material';
import { Icon } from '@mui/material';

export default function Input(props: any) {
  const { name, label, value, error = null, onChange, icon, endAdornment, secondField, ...other } = props;

  return (
    <TextField
      variant="outlined"
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      {...other}
      {...(error && { error: true, helperText: error })}
      InputProps={{
        ...(icon && {
          startAdornment: (
            <InputAdornment position="start">
              <Box display="flex" alignItems="center">
                <IconButton disabled>
                  <Icon style={{ color: '#00b0ad' }}>{icon}</Icon>
                </IconButton>
                {secondField}
              </Box>
            </InputAdornment>
          ),
        }),
        ...(endAdornment && {
          endAdornment: (
            <InputAdornment position="end">
              {endAdornment}
            </InputAdornment>
          ),
        }),
      }}
    />
  );
}