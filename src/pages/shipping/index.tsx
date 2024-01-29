import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../auth/UserContext';
import Spinner from '../../components/Spinner';
import ViewShipping from '../../components/pageComponents/shipping/shipping';
import AdminShipping from '../../components/pageComponents/shipping/adminShipping';
export default function Shipping() {
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
    return <div>Error: User not found</div>;
  }

  const { role } = currentUser;

  if (role === 'CUSTOMER') {
    return (
      <div>
        <ViewShipping />
      </div>
    );
  } else if (role === 'ADMIN') {
    return (
      <div>
        <AdminShipping />
      </div>
    );
  }else {
    return null;
  }
}