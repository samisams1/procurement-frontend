import React, { useState } from 'react';
import { Paper, Typography, Checkbox, Select, MenuItem, SelectChangeEvent } from '@mui/material';

const PurchaseHeader: React.FC = () => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [selectedOption1, setSelectedOption1] = useState('');
  const [selectedOption2, setSelectedOption2] = useState('');

  const handleOptionChange = (option: string) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((item) => item !== option));
    } else {
      setSelectedOptions([option]);
      setSelectedOption1('');
      setSelectedOption2('');
    }
  };

  const handleOption1Change = (event: SelectChangeEvent<string>) => {
    setSelectedOption1(event.target.value as string);
  };

  const handleOption2Change = (event: SelectChangeEvent<string>) => {
    setSelectedOption2(event.target.value as string);
  };

  return (
    <Paper elevation={2} style={{ padding: '1rem' }}>
      <Typography variant="h5">Please select your type of purchase:</Typography>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        <div>
          <Checkbox
            checked={selectedOptions.includes('supplier')}
            onChange={() => handleOptionChange('supplier')}
            disabled={selectedOptions.length === 1 && !selectedOptions.includes('supplier')}
          />
          <span>Supplier</span>
          {selectedOptions.includes('supplier') && (
            <Select
              value={selectedOption1}
              onChange={handleOption1Change}
              style={{ minWidth: '120px', width: '100%' }}
            >
              <MenuItem value="1">1</MenuItem>
              <MenuItem value="2">2</MenuItem>
              <MenuItem value="3">3</MenuItem>
            </Select>
          )}
        </div>
        <div>
          <Checkbox
            checked={selectedOptions.includes('aet')}
            onChange={() => handleOptionChange('aet')}
            disabled={selectedOptions.length === 1 && !selectedOptions.includes('aet')}
          />
          <span>AET</span>
          {selectedOptions.includes('aet') && (
            <Select
              value={selectedOption2}
              onChange={handleOption2Change}
              style={{ minWidth: '120px', width: '100%' }}
            >
              <MenuItem value="a">a</MenuItem>
              <MenuItem value="b">b</MenuItem>
              <MenuItem value="c">c</MenuItem>
              <MenuItem value="d">d</MenuItem>
            </Select>
          )}
        </div>
        <div>
          <Checkbox
            checked={selectedOptions.includes('x-company')}
            onChange={() => handleOptionChange('x-company')}
            disabled={selectedOptions.length === 1 && !selectedOptions.includes('x-company')}
          />
          <span>X-Company</span>
          {selectedOptions.includes('x-company') && <span>{selectedOptions[0]}</span>}
        </div>
      </div>
    </Paper>
  );
};

export default PurchaseHeader;