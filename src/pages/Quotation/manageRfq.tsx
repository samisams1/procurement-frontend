import React, { useContext } from 'react';
import { UserContext } from '../../auth/UserContext';
import Spinner from '../../components/Spinner';
import ManageRfqComponent from '../../components/pageComponents/Quotation/ManageRfqComponent';
import { useLocation } from 'react-router-dom';
export default function ManageRfq() {
  const location = useLocation();
  const productId = location.state?.productId;
  const customerId = location.state?.customerId;
  const supplierId = location.state?.supplierId;
  const { currentUser } = useContext(UserContext);
  if (!currentUser) {
    return <Spinner />;
  }
  const { role } = currentUser;
  if (role === 'CUSTOMER') {
    return(<div><ManageRfqComponent id={productId}  customerId={customerId} supplierId ={supplierId}  /></div>);
  }else {
    return null;
  }
}