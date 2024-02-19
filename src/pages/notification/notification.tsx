import { gql, useQuery } from '@apollo/client';
import React from 'react';

const GET_NOTIFICATIONS_INFO = gql`
  query {
    notificationsInfo {
      notifications {
        id
        message
        createdAt
      }
      count
    }
  }
`;

interface Notification {
  id: string;
  message: string;
  createdAt: string;
}

interface NotificationsInfo {
  notifications: Notification[];
  count: number;
}

const Notifications: React.FC = () => {
  const { loading, data } = useQuery<{ notificationsInfo: NotificationsInfo }>(
    GET_NOTIFICATIONS_INFO
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  const { notifications, count } = data?.notificationsInfo || {};

  return (
    <div>
      <h2>Notifications</h2>
      <p>Count: {count}</p>
      <ul>
        {notifications?.map((notification) => (
          <li key={notification.id}>
            <div>{notification.message}</div>
            <div>{notification.createdAt}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;