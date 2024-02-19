import React from 'react';
import { useQuery, gql } from '@apollo/client';

interface QuotationCountData {
  countGetQuotationByStatus: number;
}

interface QuotationCountVariables {
  status: string;
  supplierId: number;
}

const COUNT_QUOTATIONS_QUERY = gql`
  query CountQuotations($status: String!, $supplierId: Int!) {
    countGetQuotationByStatus(status: $status, supplierId: $supplierId)
  }
`;

const QuotationCount: React.FC<{ status: string; supplierId: number }> = ({
  status,
  supplierId,
}) => {
  const { loading, error, data } = useQuery<QuotationCountData, QuotationCountVariables>(
    COUNT_QUOTATIONS_QUERY,
    {
      variables: { status, supplierId },
    }
  );

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const count = data?.countGetQuotationByStatus;

  return <p>{count}</p>;
};

export default QuotationCount;