import React, { useContext, useEffect } from 'react';
import { Box } from '@mui/material';
import { Helmet } from 'react-helmet';
import PageHeader from '../../components/PageHeader';
import { PeopleAltTwoTone } from '@mui/icons-material';
import Orders from '../../components/pageComponents/order/supplier/orders';
import { UserContext } from '../../auth/UserContext';
import { gql, useQuery } from '@apollo/client';

const GET_SUPPLIER_ID_BY_USER_ID = gql`
  query SupplierIdByUserId($userId: Int!) {
    supplierIdByUserId(userId: $userId) {
      id
    }
  }
`;

const OrderSupplier = () => {
  const { currentUser } = useContext(UserContext);
  const userId = currentUser?.id || '';

  const { loading, error, data } = useQuery(GET_SUPPLIER_ID_BY_USER_ID, {
    variables: { userId:Number(userId) },
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
      <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
        <PageHeader
          title="Order"
          subTitle="orders"
          icon={<PeopleAltTwoTone />}
        />
        {loading ? (
          <p>Loading...</p>
        ) : (
          <Orders userId={data?.supplierIdByUserId?.id || ''} />
        )}
      </Box>
    </>
  );
};

export default OrderSupplier;