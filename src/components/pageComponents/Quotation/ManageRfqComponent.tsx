import React from 'react';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import QuotationDetail from './Detail';
import { useParams } from 'react-router-dom';
const ManageRfqComponent: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const theme = useTheme();
 
  return (
    <ThemeProvider theme={theme}>
      <QuotationDetail qId= {Number(id)}/>
    </ThemeProvider>
  );
};
export default ManageRfqComponent;