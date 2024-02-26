import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { COUNT_ALL_PAYMENT_BY_STATUS } from '../../../../graphql/Order';

interface CountPurchase {
  status: string;
}

interface CountPaymentData {
  countPaymentSatus: number;
}

const CountPayment: React.FC<CountPurchase> = ({ status }) => {
  const { loading, error, data, refetch } = useQuery<CountPaymentData>(COUNT_ALL_PAYMENT_BY_STATUS, {
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

  return <p>{data?.countPaymentSatus}</p>;
};

export default CountPayment;