import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { COUNT_REQUEST_BY_STATUS } from '../../../../graphql/Order';

interface CountRequestData {
    countPurchaseRequestBystatus: number;
}

interface CountRequestVariables {
  status: string;
  userId: number;
}

interface RequestByStatusProps {
  status: string;
}

const RequestByStatus: React.FC<RequestByStatusProps> = ({ status }) => {
  const userId = 3;

  const { loading, error, data, refetch } = useQuery<CountRequestData, CountRequestVariables>(COUNT_REQUEST_BY_STATUS, {
    variables: { status, userId },
  });

  useEffect(() => {
    refetch();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return <div>{data?.countPurchaseRequestBystatus}</div>;
};

export default RequestByStatus;