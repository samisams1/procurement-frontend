import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { COUNT_ALL_ORDER_BY_STATUS, COUNT_ALL_REQUEST_BY_STATUS } from '../../../../graphql/Order';

interface CountRequestData {
    countOAllrderByStatus: number;
}

interface CountRequestVariables {
  status: string;
}

interface RequestByStatusProps {
  status: string;
}

const CountAllOrderStatus: React.FC<RequestByStatusProps> = ({ status }) => {
  const { loading, error, data, refetch } = useQuery<CountRequestData, CountRequestVariables>(
    COUNT_ALL_ORDER_BY_STATUS,
    {
      variables: { status },
    }
  );

  useEffect(() => {
    refetch();
  }, [status]); // Refetch when the status prop changes

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return <p>{data?.countOAllrderByStatus}</p>;
};

export default CountAllOrderStatus;