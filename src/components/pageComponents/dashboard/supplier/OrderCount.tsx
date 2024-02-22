import React from 'react';
import { useQuery, gql } from '@apollo/client';


interface OrderBySupplierIdData {
  countOrderBySupplierId: number;
}
interface OrderBySupplierId {
  supplierId: number;
  status: string;
}
const COUNT_ORDERS_QUERY = gql`
query GetOrderCountBySupplierId($data: orderBySupplierId!) {
  countOrderBySupplierId(data: $data)
}
`;

const OrderCount: React.FC<OrderBySupplierId> = ({ supplierId, status }) => {
  const { loading, error, data } = useQuery<OrderBySupplierIdData>(COUNT_ORDERS_QUERY, {
    variables: { data: { supplierId ,status} },
  });
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