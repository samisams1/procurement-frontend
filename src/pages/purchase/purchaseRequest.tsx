import React, { useContext } from 'react';
import { UserContext } from '../../auth/UserContext';
import Spinner from '../../components/Spinner';
import PurchaseRequests from '../../components/pageComponents/purchase/purchaseRequests';
export default function PurchaseRequest() {
  const { currentUser } = useContext(UserContext);
  if (!currentUser) {
    return <Spinner />;
  }
  const { role } = currentUser;
  if (role === 'SUPPLIER') {
    return(<div><PurchaseRequests/></div>);
  } else {
    return null;
  }
}