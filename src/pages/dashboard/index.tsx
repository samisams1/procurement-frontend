import React, { useContext, useEffect, useState } from 'react';
import Spinner from '../../components/Spinner';
import { UserContext } from '../../auth/UserContext';
import ProcurementDashboard from './customer';
import AdminDashboard from './admin';
import SupplierDashboard from './supplier';

const Dashboard = () => {
  const { currentUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  if (isLoading) {
    return (
      <div>
        <Spinner />
        <p>Loading user data...</p>
      </div>
    );
  }

  let dashboardComponent;

  if (currentUser === null) {
    dashboardComponent = <div>No user data found</div>;
  } else if (currentUser.role === 'SUPPLIER') {
    dashboardComponent = <SupplierDashboard />;
  } else if (currentUser.role === 'CUSTOMER') {
    dashboardComponent = <ProcurementDashboard />;
  } else if (currentUser.role === 'ADMIN') {
    dashboardComponent = <AdminDashboard />;
  }

  return <div>{dashboardComponent}</div>;
};

export default Dashboard;