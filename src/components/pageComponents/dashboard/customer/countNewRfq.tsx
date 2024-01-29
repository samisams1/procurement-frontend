/*import React from 'react'
import { useQuery } from '@apollo/client';
import Spinner from '../../../Spinner';
import { COUNT_RFQ } from '../../../../graphql/quotation';

export const NewRfq = (props:any) => {
  const {  sx,  } = props;
  const {loading,error,data} = useQuery(COUNT_RFQ);
  if(loading) return <Spinner/>
  if (error) return <p>{error.message}</p>
  return (
    <div> {data.countRfq}</div>
  );
  }*/
  import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { COUNT_RFQ } from '../../../../graphql/quotation';

interface CountOrderData {
  countOrderBystatus: number;
}

interface CountOrderVariables {
  status: string;
  userId: number;
}

interface OrderByStatusProps {
  status: string;
}

const NewRfq = () => {
  const userId = 3;

  const {loading,error,data} = useQuery(COUNT_RFQ);

  useEffect(() => {
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return <div>{data?.countRfq}</div>;
};

export default NewRfq;