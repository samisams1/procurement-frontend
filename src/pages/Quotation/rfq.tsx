import React, { useContext } from 'react';
import { UserContext } from '../../auth/UserContext';
import Spinner from '../../components/Spinner';
import RfqComponent from '../../components/pageComponents/Quotation/Rfq';
export default function Rfq() {
  const { currentUser } = useContext(UserContext);
  if (!currentUser) {
    return <Spinner />;
  }
  const { role } = currentUser;
  if (role === 'CUSTOMER') {
    return(<div><RfqComponent/></div>);
  }else {
    return null;
  }
}