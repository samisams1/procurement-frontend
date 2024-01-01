import React from 'react';
import { FormControl, InputLabel, Select as MuiSelect, MenuItem, FormHelperText, SelectChangeEvent } from '@mui/material';

interface Option {
  id: string;
  value: string;
  label: string;
}

interface Props {
  name: string;
  label: string;
  value: string;
  error?: string | null;
  onChange: (event: SelectChangeEvent<string>, child: React.ReactNode) => void;
  options: Option[];
}

const Select: React.FC<Props> = ({ name, label, value, error = null, onChange, options }) => {
  return (
    <FormControl variant="outlined" error={!!error}>
      <InputLabel>{label}</InputLabel>
      <MuiSelect label={label} name={name} value={value} onChange={onChange}>
        <MenuItem value="">None</MenuItem>
        {options.map(item => (
          <MenuItem key={item.id} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </MuiSelect>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};

export default Select;