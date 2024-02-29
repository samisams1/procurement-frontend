import React, { useContext } from 'react';
import { UserContext } from '../../auth/UserContext';
import Spinner from '../../components/Spinner';
import AllDrafts from '../../components/pageComponents/draft/alldrafts';
export default function Draft() {
  const { currentUser } = useContext(UserContext);
  if (!currentUser) {
    return <Spinner />;
  }
  const { role } = currentUser;
  if (role === 'CUSTOMER') {
    return(<div><AllDrafts /></div>);
  }else {
    return null;
  }
}