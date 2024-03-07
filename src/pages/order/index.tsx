/*import React, { useContext } from 'react';
import { Box } from '@mui/material';
import { UserContext } from '../../auth/UserContext';
import Spinner from '../../components/Spinner';
import Orders from '../../components/pageComponents/order/customer/orders';
import { Helmet } from 'react-helmet';
import PageHeader from '../../components/PageHeader';
import { CarRentalTwoTone } from '@mui/icons-material';
import { OrderAdmin } from './orderAdmin';
import OrderSupplier from './orderSupplier';
export default function Order() {
  const { currentUser } = useContext(UserContext);
  if (!currentUser) {
    return <Spinner />;
  }
  const { role } = currentUser;
  if (role === 'ADMIN') {
    return(<div><OrderAdmin/></div>);
  } else if (role === 'SUPPLIER') {
    return(<div><OrderSupplier/></div>);
  } else if (role === 'CUSTOMER') {
    return( <div>
      <Helmet>
      <title>
         et-proforma|Order
      </title>
    </Helmet>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Orders userId= {currentUser.id}/>
      </Box>
      </div>);
  } else {
    return null;
  }
}*/
import React, { useContext, useEffect, useState } from 'react';
import Spinner from '../../components/Spinner';
import { UserContext } from '../../auth/UserContext';
import { OrderAdmin } from './orderAdmin';
import OrderSupplier from './orderSupplier';
import OrderCustomer from './orderCustomer';

//const Order = () => {
  type OrderProps = {
    state: {
      orderType: string;
    };
  };
  
  const Order: React.FC<OrderProps> = ({ state }) => {
  const { orderType } = state;
  const { currentUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  if (isLoading) {
    return (
      <div>
        <Spinner />
        <p>Loading user data...</p>
      </div>
    );
  }

  let dashboardComponent;

  if (currentUser === null) {
    dashboardComponent = <div>No user data found</div>;
  } else if (currentUser.role === 'SUPPLIER') {
    dashboardComponent = <OrderSupplier type = {orderType}/>;
  } else if (currentUser.role === 'CUSTOMER') {
    dashboardComponent = <OrderCustomer/>;
  } else if (currentUser.role === 'ADMIN') {
    dashboardComponent = <OrderAdmin />;
  }

  return <div>{dashboardComponent}</div>;
};

export default Order;