import React, { useContext } from 'react';
import { UserContext } from '../../auth/UserContext';
import Spinner from '../../components/Spinner';
import SupplierNotificationDetail from './customerNotification';
import CustomerNotificationDetail from './customerNotification';
export default function NotificationDetail() {
  const { currentUser } = useContext(UserContext);
  if (!currentUser) {
    return <Spinner />;
  }
  const { role } = currentUser;
  if (role === 'CUSTOMER') {
    return(<div><CustomerNotificationDetail/></div>);
  } else if (role === 'SUPPLIER') {
    return(<div><SupplierNotificationDetail/></div>);
  } else {
    return null;
  }
}