import React, { useContext } from 'react';
import Spinner from '../../components/Spinner';
import { UserContext } from '../../auth/UserContext';
import { AdminDashboard } from './admin';
import { Customer } from './customer';
import { Supplier } from './supplier';

const Dashboard = () => {
    const { currentUser } = useContext(UserContext);

  if (currentUser === null) {
    return <Spinner />;
  }

  let dashboardComponent;

  if (currentUser.role === 'SUPPLIER') {
    dashboardComponent = <Supplier />;
  } else if (currentUser.role === 'CUSTOMER') {
    dashboardComponent = <Customer />;
  } else if (currentUser.role === 'ADMIN') {
    dashboardComponent = <AdminDashboard />;
  }

  return <div>{dashboardComponent}</div>;
};

export default Dashboard;