import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../auth/UserContext';
import Spinner from '../../components/Spinner';
import Suppliers from '../../components/pageComponents/supplier/suppliers';
import SuppliersProfile from './suppliersProfile';
import Notification from '../notification/notificatio';
export default function Supplier() {
  const { currentUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // Simulating an asynchronous operation
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []); // Empty dependency array to run the effect only once on initial render

  if (isLoading) {
    return <Spinner />;
  }

  if (!currentUser) {
    return <div>Error: Supplier not found</div>;
  }

  const { role } = currentUser;
  if (role === 'ADMIN') {
    return (
      <div>
        <Suppliers />
      </div>
    );
  }else if(role === 'SUPPLLIER'){
    return (
      <div>
        <SuppliersProfile />
        <Notification/>
      </div>
    );
  } else {
    return null;
  }
}