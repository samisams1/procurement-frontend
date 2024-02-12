import React from 'react';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import QuotationDetail from './Detail';
const ManageRfqComponent: React.FC = () => {
  const theme = useTheme();
 
  return (
    <ThemeProvider theme={theme}>
      <QuotationDetail/>
    </ThemeProvider>
  );
};
export default ManageRfqComponent;