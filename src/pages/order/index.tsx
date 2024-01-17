import React, { useContext } from 'react';
import { Box, Container, Unstable_Grid2 as Grid } from '@mui/material';
import { UserContext } from '../../auth/UserContext';
import Spinner from '../../components/Spinner';
import { OrderAdmin } from './orderAdmin';
import AllOrderList from '../../components/pageComponents/order/allOrderList';
import Orders from '../../components/pageComponents/order/customer/orders';
import { Helmet } from 'react-helmet';
import PageHeader from '../../components/PageHeader';
import { PeopleAltTwoTone } from '@mui/icons-material';
export default function Order() {
  const { currentUser } = useContext(UserContext);
  if (!currentUser) {
    return <Spinner />;
  }
  const { role } = currentUser;
  if (role === 'ADMIN') {
    return(<div><AllOrderList/></div>);
  } else if (role === 'SUPPLIER') {
    return(<div><OrderAdmin/></div>);
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
      <Container maxWidth="xl">
        <Grid
          container
          spacing={3}
        >
          <Grid
            xs={12}
            md={12}
            lg={12}
          >
         <PageHeader
            title="Order"
            subTitle="orders"
            icon={<PeopleAltTwoTone fontSize="large" />}
        /> 
      
      <Orders/>
      </Grid>
      </Grid>
      </Container>
      </Box>
      </div>);
  } else {
    return null;
  }
}