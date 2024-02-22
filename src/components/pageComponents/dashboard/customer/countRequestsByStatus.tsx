import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { COUNT_REQUEST_BY_STATUS } from '../../../../graphql/Order';


interface CountPurchase {
  userId: number;
  status: string;
}


interface CountRequestData {
  countPurchaseRequestBystatus: number;
}



const CountRequestStatus: React.FC<CountPurchase> = ({ userId, status }) => {

  const { loading, error, data,refetch } = useQuery<CountRequestData>(COUNT_REQUEST_BY_STATUS, {
    variables: { data: { userId, status } },
  });

  
  useEffect(() => {
    refetch();
  }, [refetch]); // Refetch when the status prop changes

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return <p>{data?.countPurchaseRequestBystatus
  }</p>;
};

export default CountRequestStatus;