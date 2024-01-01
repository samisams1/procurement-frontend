import React, { useContext } from 'react';
import { UserContext } from '../../auth/UserContext';
import Spinner from '../../components/Spinner';
import PurchaseRequestComponent from './purchaseRequestSupplier';
import PurchaseRequestList from './purchaseRequestList';
export default function PurchaseRequest() {
  const { currentUser } = useContext(UserContext);
  if (!currentUser) {
    return <Spinner />;
  }

  const { role } = currentUser;
 
  if (role === 'ADMIN') {
    return(<div><PurchaseRequestList/></div>);
  } else if (role === 'SUPPLIER') {
    return(<div><PurchaseRequestComponent/></div>);
  } else if (role === 'CUSTOMER') {
    return(<div><PurchaseRequestComponent/></div>);
  } else {
    return null;
  }
}