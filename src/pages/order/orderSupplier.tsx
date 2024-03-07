import React, { useContext, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import PageHeader from '../../components/PageHeader';
import { PeopleAltTwoTone } from '@mui/icons-material';
import IncomingOrders from '../../components/pageComponents/order/supplier/IncomingOrder';
import { UserContext } from '../../auth/UserContext';
import { gql, useQuery } from '@apollo/client';
import ApprovedOrders from '../../components/pageComponents/order/supplier/approvedOrder';
import RejectedOrders from '../../components/pageComponents/order/supplier/rejectedOrder';
import ConfirmedOrders from '../../components/pageComponents/order/supplier/comfirmedOrder';

const GET_SUPPLIER_ID_BY_USER_ID = gql`
  query SupplierIdByUserId($userId: Int!) {
    supplierIdByUserId(userId: $userId) {
      id
    }
  }
`;

interface OrderType {
  type: string;
}

const OrderSupplier: React.FC<OrderType> = ({ type }) => {
  const { currentUser } = useContext(UserContext);
  const userId = currentUser?.id || '';

  const { loading, error, data } = useQuery(GET_SUPPLIER_ID_BY_USER_ID, {
    variables: { userId: Number(userId) },
  });

  useEffect(() => {
    if (data) {
      console.log(data); // Data has been fetched successfully
    }
    if (error) {
      console.error(error); // An error occurred during fetching
    }
  }, [data, error]);

  return (
    <>
      <Helmet>
        <title>et-proforma | order</title>
      </Helmet>
      <PageHeader title={type} subTitle="orders" icon={<PeopleAltTwoTone />} />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {type === 'incoming' ? (
            <div>
           
               <IncomingOrders userId={data?.supplierIdByUserId?.id || ''} />
            </div>
          
          ) : type === 'approved' ? (
            <ApprovedOrders userId={data?.supplierIdByUserId?.id || ''} />
          ) : type === 'rejected' ? (
            <RejectedOrders userId={data?.supplierIdByUserId?.id || ''} />
          ) : type === 'confirmed' ? (
            <ConfirmedOrders userId={data?.supplierIdByUserId?.id || ''} />
          ) : (
            <IncomingOrders userId={data?.supplierIdByUserId?.id || ''} />
          )}
        </>
      )}
    </>
  );
};

export default OrderSupplier;