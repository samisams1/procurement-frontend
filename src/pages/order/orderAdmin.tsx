import React from 'react';
import { Helmet } from 'react-helmet';
import PageHeader from '../../components/PageHeader';
import { PeopleAltTwoTone } from '@mui/icons-material';
import Orders from '../../components/pageComponents/order/admin/allOrders';
import { SectionTitle } from '../../components/Section';

export const OrderAdmin = () => (
  <>
    <Helmet>
      <title>
        Etrpoforma | order
      </title>
    </Helmet>
   <SectionTitle>
   <PageHeader
            title="Order"
            subTitle="orders"
            icon={<PeopleAltTwoTone fontSize="large" />}
        /> 
    </SectionTitle>

           <Orders/>
  </>
);
