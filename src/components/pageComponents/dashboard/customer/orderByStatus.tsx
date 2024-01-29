import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { COUNT_ORDER_BY_STATUS } from '../../../../graphql/Order';

interface CountOrderData {
  countOrderBystatus: number;
}

interface CountOrderVariables {
  status: string;
  userId: number;
}

interface OrderByStatusProps {
  status: string;
}

const OrderByStatus: React.FC<OrderByStatusProps> = ({ status }) => {
  const userId = 3;

  const { loading, error, data, refetch } = useQuery<CountOrderData, CountOrderVariables>(COUNT_ORDER_BY_STATUS, {
    variables: { status, userId },
  });

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return <div>{data?.countOrderBystatus}</div>;
};

export default OrderByStatus;