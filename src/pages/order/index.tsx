import React, { useContext } from 'react';
import { UserContext } from '../../auth/UserContext';
import Spinner from '../../components/Spinner';
import { OrderAdmin } from './orderAdmin';
import AllOrderList from '../../components/pageComponents/order/allOrderList';
export default function Order() {
  const { currentUser } = useContext(UserContext);
  if (!currentUser) {
    return <Spinner />;
  }
  const { role } = currentUser;
  if (role === 'ADMIN') {
    return(<div><AllOrderList/></div>);
  } else if (role === 'SUPPLIER') {
    return(<div><OrderAdmin/></div>);
  } else {
    return null;
  }
}