import React from 'react';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import QuotationDetail from './Detail';
 interface interfaceRfq {
   id:number;
   customerId:number;
   supplierId:number;
}
const ManageRfqComponent: React.FC<interfaceRfq> = ({id,customerId,supplierId,}) => {
  const theme = useTheme();
 
  return (
    <ThemeProvider theme={theme}>
      <QuotationDetail qId= {Number(id)} customerId  ={customerId} supplierId={supplierId} />
 
    </ThemeProvider>
  );
};
export default ManageRfqComponent;