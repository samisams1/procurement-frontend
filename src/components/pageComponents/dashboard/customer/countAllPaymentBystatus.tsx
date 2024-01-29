import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { COUNT_ALL_PAYMENT_BY_STATUS } from '../../../../graphql/Order';

interface CountRequestData {
    countPaymentBystatus: number;
}

interface CountPaymentVariables {
  status: string;
}

interface PaymentByStatusProps {
  status: string;
}

const CountAllPaymentByStatus: React.FC<PaymentByStatusProps> = ({ status }) => {
  const { loading, error, data, refetch } = useQuery<CountRequestData, CountPaymentVariables>(
    COUNT_ALL_PAYMENT_BY_STATUS,
    {
      variables: { status },
    }
  );

  useEffect(() => {
    refetch();
  }, [refetch]); // Refetch when the status prop changes

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return <p>{data?.countPaymentBystatus}</p>;
};

export default CountAllPaymentByStatus;