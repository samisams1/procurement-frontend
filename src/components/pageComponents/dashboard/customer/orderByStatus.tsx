import React from 'react';
import { useQuery, gql } from '@apollo/client';

interface CountOrder {
  customerId: number;
  status: string;
}
interface CountOrderData {
  countOrderBystatus: number;
}

const COUNT_ORDERS_QUERY = gql`
query Query($data: CountOrder!) {
  countOrderBystatus(data: $data)
}
`;

const OrderByStatus: React.FC<CountOrder> = ({ customerId, status }) => {
  const { loading, error, data } = useQuery<CountOrderData>(COUNT_ORDERS_QUERY, {
    variables: { data: { customerId, status } },
  });

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const count = data?.countOrderBystatus;

  return <p>{count}</p>;
};

export default OrderByStatus;