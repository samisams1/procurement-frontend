import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../auth/UserContext';
import Spinner from '../../components/Spinner';
import { Category } from './Category';
export default function CategoryPage() {
  const { currentUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulating an asynchronous operation
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  if (!currentUser) {
    return <div>Error: User not found</div>;
  }

  const { role } = currentUser;

if (role === 'ADMIN') {
    return (
      <div>
        <Category />
      </div>
    );
  } else {
    return null;
  }
}