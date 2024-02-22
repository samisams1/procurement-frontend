import React from 'react';
import { useQuery, gql } from '@apollo/client';

interface CountQuotationSupplier {
  supplierId: number;
  status: string;

}

interface CountQuotationSupplierData {
  countQuotationBySupplierId: number;
}

const COUNT_QUOTATIONS_QUERY = gql`
  query CountQuotationsBySupplier($data: countQuotationSupplier!) {
    countQuotationBySupplierId(data: $data)
  }
`;
const QuotationCount: React.FC<CountQuotationSupplier> = ({ supplierId,status }) => {
  const { loading, error, data } = useQuery<CountQuotationSupplierData>(COUNT_QUOTATIONS_QUERY, {
    variables: { data: { supplierId,status } },
  });

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const count = data?.countQuotationBySupplierId;

  return <p>{count}</p>;
};

export default QuotationCount;