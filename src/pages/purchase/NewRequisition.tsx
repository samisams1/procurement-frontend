import React, { useContext } from 'react';
import { UserContext } from '../../auth/UserContext';
import Spinner from '../../components/Spinner';
import NewRequisitionComponent from '../../components/pageComponents/Requisition/newRequisition';
export default function NewRequisition() {
  const { currentUser } = useContext(UserContext);
  if (!currentUser) {
    return <Spinner />;
  }
  const { role } = currentUser;
  if (role === 'CUSTOMER') {
    return(<div><NewRequisitionComponent/></div>);
  }else {
    return null;
  }
}