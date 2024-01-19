import React, { useContext } from 'react';
import { UserContext } from '../../auth/UserContext';
import Spinner from '../../components/Spinner';
import PaymentComponent from '../../components/pageComponents/payment/paymentCoponent';
export default function Payment() {
  const { currentUser } = useContext(UserContext);
  if (!currentUser) {
    return <Spinner />;
  }
  const { role } = currentUser;
  if (role === 'CUSTOMER') {
    return(<div><PaymentComponent/></div>);
  } else {
    return null;
  }
}