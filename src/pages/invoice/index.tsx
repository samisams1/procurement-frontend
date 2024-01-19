import React, { useContext } from 'react';
import { UserContext } from '../../auth/UserContext';
import Spinner from '../../components/Spinner';
import InvoiceComponent from '../../components/pageComponents/invoice/invoiceComponent';
export default function Invoice() {
  const { currentUser } = useContext(UserContext);
  if (!currentUser) {
    return <Spinner />;
  }
  const { role } = currentUser;
  if (role === 'CUSTOMER') {
    return(<div><InvoiceComponent/></div>);
  } else {
    return null;
  }
}