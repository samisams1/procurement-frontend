import React, { useContext } from 'react';
import { Box } from '@mui/material';
import { UserContext } from '../../auth/UserContext';
import Spinner from '../../components/Spinner';
import Orders from '../../components/pageComponents/order/customer/orders';
import { Helmet } from 'react-helmet';
import PageHeader from '../../components/PageHeader';
import { CarRentalTwoTone } from '@mui/icons-material';
import { OrderSupplier } from './orderSupplier';
import { OrderAdmin } from './orderAdmin';
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
      <PageHeader
      title="Order"
      subTitle="orders"
      icon ={<CarRentalTwoTone/>}
      />
       <Orders/>
      </Box>
      </div>);
  } else {
    return null;
  }
}