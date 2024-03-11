import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../auth/UserContext';
import Spinner from '../../components/Spinner';
import NewRequisitionComponent from '../../components/pageComponents/Requisition/newRequisition';

export default function NewRequisition() {
  const { currentUser } = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating an asynchronous action
    setTimeout(() => {
      setLoading(false);
    }, 2000); // Replace with your actual data fetching or processing logic
  }, []);

  if (loading) {
    return <Spinner />;
  }
  if (!currentUser) {
    return null; // Or show an error message if desired
  }
  const { role } = currentUser;
  if (role === 'CUSTOMER') {
    return <div><NewRequisitionComponent/></div>;
  } else {
    return null;
  }
}