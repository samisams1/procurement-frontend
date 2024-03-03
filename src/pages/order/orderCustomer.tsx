import React, { useContext} from 'react';
import { Helmet } from 'react-helmet';
import PageHeader from '../../components/PageHeader';
import { PeopleAltTwoTone } from '@mui/icons-material';
import { UserContext } from '../../auth/UserContext';
import Orders from '../../components/pageComponents/order/customer/orders';
import { SectionTitle } from '../../components/Section';


const OrderCustomer = () => {
  const { currentUser } = useContext(UserContext);
  const userId = currentUser?.id || '';
  return (
    <>
      <Helmet>
        <title>et-proforma | order</title>
      </Helmet>
   <SectionTitle>
   <PageHeader
          title="Order"
          subTitle="orders"
          icon={<PeopleAltTwoTone />}
    />
   </SectionTitle>
       
        <Orders userId= {Number(userId)} />

    </>
  );
};

export default OrderCustomer;