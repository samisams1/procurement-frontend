import React from 'react';
import { useQuery, gql } from '@apollo/client';

interface OrderCountData {
  countOrderBySupplierId: number;
}

interface OrderCountVariables {
  status: string;
  supplierId: number;
}

const COUNT_ORDERS_QUERY = gql`
  query CountOrders($status: String!, $supplierId: Int!) {
    countOrderBySupplierId(status: $status, supplierId: $supplierId)
  }
`;

const OrderCount: React.FC<{ status: string; supplierId: number }> = ({
  status,
  supplierId,
}) => {
  const { loading, error, data } = useQuery<OrderCountData, OrderCountVariables>(
    COUNT_ORDERS_QUERY,
    {
      variables: { status, supplierId },
    }
  );

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const count = data?.countOrderBySupplierId;

  return <p>{count}</p>;
};

export default OrderCount;