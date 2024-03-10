import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../auth/UserContext';
import Spinner from '../../components/Spinner';
import RfqComponent from '../../components/pageComponents/Quotation/Rfq';
import Rfqs from '../../components/pageComponents/Quotation/admin/rfq';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import PageHeader from '../../components/PageHeader';
import { QuestionAnswer } from '@mui/icons-material';

export default function Rfq() {
  const { currentUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const theme = useTheme();
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1500); // Simulate a 1.5-second loading time, replace with your actual page loading logic
  }, []);

  if (isLoading || !currentUser) {
    return <Spinner />;
  }

  const userId = currentUser.id;
  const { role } = currentUser;
 

  if (role === 'CUSTOMER') {
    return (
      <ThemeProvider theme={theme}>
      
          <PageHeader
          title="Rfq"
          subTitle="list of rfq "
          icon={<QuestionAnswer/>}
          imageSrc = "salesForce.png"
          />
        <RfqComponent userId={Number(userId)} />
      </ThemeProvider>
    );
  } else if (role === 'ADMIN') {
    return <Rfqs />;
  } else {
    return null;
  }
}