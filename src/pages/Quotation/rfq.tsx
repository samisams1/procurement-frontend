import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../auth/UserContext';
import Spinner from '../../components/Spinner';
import RfqComponent from '../../components/pageComponents/Quotation/Rfq';
import Rfqs from '../../components/pageComponents/Quotation/admin/rfq';

export default function Rfq() {
  const { currentUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1500); // Simulate a 1.5-second loading time, replace with your actual page loading logic
  }, []);

  if (isLoading || !currentUser) {
    return <Spinner />;
  }

  const { role } = currentUser;
  if (role === 'CUSTOMER') {
    return <div><RfqComponent/></div>;
  } else if (role === 'ADMIN') {
    return <div><Rfqs/></div>;
  } else {
    return null;
  }
}