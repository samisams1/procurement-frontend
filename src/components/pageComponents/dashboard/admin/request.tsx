import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { COUNT_REQUEST_BY_STATUS } from '../../../../graphql/Order';

interface CountPurchase {
  status: string;
}

interface CountRequestData {
  countAllRequestByStatus: number;
}

const CountRequest: React.FC<CountPurchase> = ({ status }) => {
  const { loading, error, data, refetch } = useQuery<CountRequestData>(COUNT_REQUEST_BY_STATUS, {
    variables: { status },
  });

  useEffect(() => {
    refetch();
  }, [status, refetch]); // Refetch when the status prop changes

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return <p>{data?.countAllRequestByStatus}</p>;
};

export default CountRequest;