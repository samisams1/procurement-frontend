import React, { useContext } from 'react';
import { UserContext } from '../../auth/UserContext';
import Spinner from '../../components/Spinner';
import ManageRequisitionComponenet from '../../components/pageComponents/Requisition/manageRequisition';
import Requisitions from '../../components/pageComponents/Requisition/requisitions';
export default function ManageRequisition() {
  const { currentUser } = useContext(UserContext);
  if (!currentUser) {
    return <Spinner />;
  }
  const { role } = currentUser;
  if (role === 'CUSTOMER') {
    return(<div><ManageRequisitionComponenet/></div>);
  } else if (role === 'ADMIN') {
    return(<div><Requisitions/></div>);
  }else {
    return null;
  }
}