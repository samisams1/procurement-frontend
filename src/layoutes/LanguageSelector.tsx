import React, { useState } from 'react';
import Select from 'react-select';
import CountryFlag from 'react-country-flag';

const LanguageSelector: React.FC = () => {
  const [language, setLanguage] = useState('en');

  const options = [
    { value: 'en', label: <CountryFlag countryCode="GB" svg /> },
    { value: 'et', label: <CountryFlag countryCode="ET" svg /> },
  ];

  const handleChange = (selectedOption: any) => {
    setLanguage(selectedOption.value);
  };

  return (
    <Select
      options={options}
      value={options.find((option) => option.value === language)}
      onChange={handleChange}
    />
  );
};

export default LanguageSelector;