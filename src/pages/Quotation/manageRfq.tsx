import React, { useContext } from 'react';
import { UserContext } from '../../auth/UserContext';
import Spinner from '../../components/Spinner';
import ManageRfqComponent from '../../components/pageComponents/Quotation/ManageRfqComponent';
export default function ManageRfq() {
  const { currentUser } = useContext(UserContext);
  if (!currentUser) {
    return <Spinner />;
  }
  const { role } = currentUser;
  if (role === 'CUSTOMER') {
    return(<div><ManageRfqComponent/></div>);
  }else {
    return null;
  }
}