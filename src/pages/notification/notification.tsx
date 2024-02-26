import { gql, useQuery } from '@apollo/client';
import React, { useContext } from 'react';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import { List, ListItem, ListItemText, Typography, useMediaQuery } from '@mui/material';
import PageHeader from '../../components/PageHeader';
import {  useNavigate } from 'react-router-dom';
import { UserContext } from '../../auth/UserContext';

const GET_NOTIFICATIONS_INFO = gql`
query NotificationsByUserIdInfo($recipientId: Int!) {
  notificationsByUserIdInfo(recipientId: $recipientId) {
    count
    notifications {
        id
        message
        type
        createdAt
      }
      count
    }
  }
`;
interface Notification {
  id: string;
  message: string;
  type: string;
  specificid:number;
  createdAt: string;
}

interface NotificationsInfo {
  notifications: Notification[];
  count: number;
}

const Notifications: React.FC = () => {
  const { currentUser } = useContext(UserContext);
  const userId = currentUser?.id ?? '';
  const { loading, data } = useQuery<{ notificationsByUserIdInfo: NotificationsInfo }>(
    GET_NOTIFICATIONS_INFO,{variables:{ recipientId: Number(userId)}}
  );
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  if (loading) {
    return <div>Loading...</div>;
  }

  const { notifications, count } = data?.notificationsByUserIdInfo || {};
  const handleNotificationClick = (notification:any) => {
    let route = '';

    switch (notification.type) {
      case 'order':
        route = '/order';
        break;
      case 'purchaseRequest':
        route = `/purchaseRequest/${notification.id}`;
        break;
      case 'rfq':
        route = '/rfq';
        break;
      // Add more cases as needed for different notification types

      default:
        // Handle the default case or unknown types
        return;
    }

    navigate(route);
  };

  return (
    <div>
      <ThemeProvider theme={theme}>
        <PageHeader title="Notifications" />
        <Typography variant="h6" color="textSecondary">
          Total Notification: {count}
        </Typography>
        <List>
          {notifications?.map((notification) => (
            <ListItem
              key={notification.id}
              alignItems="flex-start"
              disableGutters={!isMobile}
              divider
              onClick={() => handleNotificationClick(notification)}
              style={{ cursor: 'pointer' }}
            >
              <ListItemText
                primary={
                  <Typography variant="h6" color="primary">
                    message Id: {notification.id}
                  </Typography>
                }
                secondary={
                  <>
                    <Typography variant="body2" color="textSecondary">
                    Date : {notification.createdAt}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                  {notification.specificid}    type <span style={{ color: 'red' }}>: {notification.type}</span>
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Message   : {notification.message}
                    </Typography>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      </ThemeProvider>
    </div>
  );
};

export default Notifications;