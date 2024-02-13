import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../auth/UserContext';
import Spinner from '../../components/Spinner';
import ManageRequisitionComponenet from '../../components/pageComponents/Requisition/manageRequisition';
import Requisitions from '../../components/pageComponents/Requisition/requisitions';

export default function ManageRequisition() {
  const { currentUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulating an asynchronous data fetch
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  const role = currentUser?.role ?? ''; // Use optional chaining and nullish coalescing operator

  if (role === 'CUSTOMER') {
    return (
      <div>
        <ManageRequisitionComponenet />
      </div>
    );
  } else if (role === 'ADMIN') {
    return (
      <div>
        <Requisitions />
      </div>
    );
  } else {
    return null;
  }
}