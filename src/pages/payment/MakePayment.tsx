import React, { useContext } from 'react';
import { UserContext } from '../../auth/UserContext';
import Spinner from '../../components/Spinner';
import MakePaymentComponent from '../../components/pageComponents/payment/makePaymentComponent';
export default function Payment() {
  const { currentUser } = useContext(UserContext);
  if (!currentUser) {
    return <Spinner />;
  }
  const { role } = currentUser;
  if (role === 'CUSTOMER') {
    return(<div><MakePaymentComponent/></div>);
  } else {
    return null;
  }
}