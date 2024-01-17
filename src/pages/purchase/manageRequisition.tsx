import React, { useContext } from 'react';
import { UserContext } from '../../auth/UserContext';
import Spinner from '../../components/Spinner';
import ManageRequisitionComponenet from '../../components/pageComponents/Requisition/manageRequisition';
export default function ManageRequisition() {
  const { currentUser } = useContext(UserContext);
  if (!currentUser) {
    return <Spinner />;
  }
  const { role } = currentUser;
  if (role === 'CUSTOMER') {
    return(<div><ManageRequisitionComponenet/></div>);
  }else {
    return null;
  }
}