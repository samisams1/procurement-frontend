import React, { useContext } from 'react';
import Spinner from '../../components/Spinner';
//import { AdminDashboard } from './admin';
import { SellerDashboard } from './sale';
import { StoreDashboard } from './store';
import { UserContext } from '../../auth/UserContext';
import { AdminDashboard } from './admin';

const Dashboard = () => {
    const { currentUser } = useContext(UserContext);

  if (currentUser === null) {
    return <Spinner />;
  }

  let dashboardComponent;

  if (currentUser.role === 'SELLER') {
    dashboardComponent = <SellerDashboard />;
  } else if (currentUser.role === 'STORE') {
    dashboardComponent = <StoreDashboard />;
  } else if (currentUser.role === 'ADMIN') {
    dashboardComponent = <AdminDashboard />;
  }

  return <div>{dashboardComponent}</div>;
};

export default Dashboard;