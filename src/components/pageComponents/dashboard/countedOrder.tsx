import { useEffect, useState } from 'react';
import { useQuery, gql } from '@apollo/client';
interface CountData {
  countNotifications: number;
}
const COUNT_NOTIFICATION_QUERY = gql`
  query {
    countNotifications
  }
`;
const useCountOrders = () => {
  const { loading, error, data } = useQuery<CountData>(COUNT_NOTIFICATION_QUERY);
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    if (!loading && data) {
      setCount(data.countNotifications);
    }
  }, [loading, data]);

  return { loading, error, count };
};

export default useCountOrders;