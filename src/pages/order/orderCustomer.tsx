import React, { useContext} from 'react';
import { Helmet } from 'react-helmet';
import PageHeader from '../../components/PageHeader';
import { PeopleAltTwoTone } from '@mui/icons-material';
import { UserContext } from '../../auth/UserContext';
import Orders from '../../components/pageComponents/order/customer/orders';


const OrderCustomer = () => {
  const { currentUser } = useContext(UserContext);
  const userId = currentUser?.id || '';
  return (
    <>
      <Helmet>
        <title>et-proforma | order</title>
      </Helmet>
   <PageHeader
          title="Order"
          icon={<PeopleAltTwoTone />}
          imageSrc = "salesForce.png"
    />
       
        <Orders userId= {Number(userId)} />

    </>
  );
};

export default OrderCustomer;