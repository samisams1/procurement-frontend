import React from 'react';
import { Box} from '@mui/material';
import { Helmet } from 'react-helmet';
import PageHeader from '../../components/PageHeader';
import { PeopleAltTwoTone } from '@mui/icons-material';
import Orders from '../../components/pageComponents/order/admin/allOrders';

export const OrderAdmin = () => (
  <>
    <Helmet>
      <title>
        Etrpoforma | order
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
            icon={<PeopleAltTwoTone fontSize="large" />}
        /> 
           <Orders/>
    </Box>
  </>
);
