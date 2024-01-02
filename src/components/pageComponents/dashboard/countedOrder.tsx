import { useEffect, useState } from 'react';
import { useQuery, gql } from '@apollo/client';
interface CountOrdersData {
  countOrders: number;
}
const COUNT_ORDERS_QUERY = gql`
  query {
    countOrders
  }
`;
const useCountOrders = () => {
  const { loading, error, data } = useQuery<CountOrdersData>(COUNT_ORDERS_QUERY);
  const [countOrders, setCountOrders] = useState<number | null>(null);

  useEffect(() => {
    if (!loading && data) {
      setCountOrders(data.countOrders);
    }
  }, [loading, data]);

  return { loading, error, countOrders };
};

export default useCountOrders;