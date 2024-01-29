import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../auth/UserContext';
import Spinner from '../../components/Spinner';
import CreateShipping from '../../components/pageComponents/shipping/createShipping';

export default function Create() {
  const { currentUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulating an asynchronous operation
    setTimeout(() => {
      setIsLoading(false);
    }, 200);
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
        <CreateShipping />
      </div>
    );
  } else {
    return null;
  }
}