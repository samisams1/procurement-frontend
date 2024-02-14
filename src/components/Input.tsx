import React from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { Icon } from '@mui/material';

export default function Input(props: any) {
  const { name, label, value, error = null, onChange, icon, endAdornment, ...other } = props;

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
              <IconButton disabled>
                <Icon style={{ color: '#00b0ad' }}>{icon}</Icon>
              </IconButton>
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