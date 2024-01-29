import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { COUNT_RFQ } from '../../../../graphql/quotation';
const NewRfq = () => {
  const {loading,error,data,refetch} = useQuery(COUNT_RFQ);

  useEffect(() => {
  }, [refetch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return <div>{data?.countRfq}</div>;
};

export default NewRfq;