import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { COUNT_RFQ } from '../../../../graphql/quotation';
interface CountQuotationData {
  countGetQuotationByStatus: number;
}
interface CountQuotation {
  status: string;
  customerId:number;
}

  const NewRfq: React.FC<CountQuotation> = ({ status,customerId }) => {

  const { loading, error, data,refetch } = useQuery<CountQuotationData>(COUNT_RFQ, {
    variables: { data: { customerId, status } },
  });

  useEffect(() => {
  }, [refetch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return <div>{data?.countGetQuotationByStatus}</div>;
};

export default NewRfq;