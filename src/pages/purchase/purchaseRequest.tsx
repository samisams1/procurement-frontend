import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../auth/UserContext';
import Spinner from '../../components/Spinner';
import PurchaseRequests from '../../components/pageComponents/purchase/purchaseRequests';

export default function PurchaseRequest() {
  const { currentUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulating API call delay
    const delay = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(delay); // Clean up the timeout when the component unmounts
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  if (!currentUser) {
    return null; // Render null if currentUser is not available
  }

  const { role } = currentUser;

  if (role === 'SUPPLIER') {
    return <PurchaseRequests />;
  } else {
    return null;
  }
}