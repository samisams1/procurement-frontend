import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton, Badge, Popover, List, ListItem, ListItemText, Typography } from '@mui/material';
import { Notifications, } from '@mui/icons-material';
import useCountOrders from '../components/pageComponents/dashboard/countedOrder';
import { gql, useMutation, useQuery } from '@apollo/client';
import Spinner from '../components/Spinner';

interface Notification {
  id:number;
  recipientId: string;
  message: string;
  type: string;
}
const ORDER_QUERY = gql`
query Notifications {
  notifications {
     id
    recipientId
    message
    type
  }
}
`;
const UPDATE_NOTIFICATION_MUTATION = gql`
mutation UpdateNotification($id: Float!) {
  updateNotification(id: $id) {
    status
  }
}
`;
const NotificationComponent = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [maxHeight, setMaxHeight] = useState<number>(0);
  const [updateNotification] = useMutation(UPDATE_NOTIFICATION_MUTATION);

  const { loading, error, data } = useQuery(ORDER_QUERY);
  const navigate = useNavigate();
  useEffect(() => {
    const handleResize = () => {
      setMaxHeight(window.innerHeight * 0.7); // Adjust the percentage as needed
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'notification-popover' : undefined;

  const countOrders = useCountOrders(); // Call the hook to get the countOrders value

  if (loading) return <Spinner />;
  if (error) return <p>{error.message}</p>;
 const notifications = data.notitfications;
 const handleNotificationClick = async (notification: Notification) => {
  // Determine the page to navigate based on the notification type
  let route = '';

  switch (notification.type) {
    case 'order':
      route = '/order';
      break;
    case 'request':
      route = '/request';
      break;
    case 'rfq':
        route = '/rfq';
        break;
    // Add more cases as needed for different notification types

    default:
      // Handle the default case or unknown types
      return;
  }
  const notificationId =notification.id ;
  try {
    const { data } = await updateNotification({
      variables: { id: Number(notificationId) }, // Parse id to an integer if needed
    });

    console.log('Notification updated:', data.updateNotification);
  } catch (error) {
    console.error('Failed to update notification:', error);
  }
  // Navigate to the corresponding page
  navigate(route);
};
  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleClick}
        sx={{
          backgroundColor: 'black',
          '&:hover': {
            backgroundColor: 'blue',
          },
        }}
      >
        <Badge badgeContent={countOrders.count} color="error">
          <Notifications />
        </Badge>
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <List sx={{ width: '100%', maxWidth: 540, maxHeight: `${maxHeight}px`, overflow: 'auto' }}>
          <ListItem sx={{ justifyContent: 'center' }}>
            <Typography
              variant="h6"
              align="center"
              sx={{
                fontWeight: 'bold',
                width: '100%',
              }}
            >
              Activity
            </Typography>
          </ListItem>
          <div>
      {notifications?.map((notification:Notification) => (
      <ListItem key={notification.recipientId} onClick={() => handleNotificationClick(notification)}>
      <ListItemText
        primary={notification.message}
        secondary={`Recipient ID: ${notification.recipientId}`}
        secondaryTypographyProps={{ color: 'textSecondary' }}
      />
      <Typography variant="body2" color="textSecondary">
        Type: {notification.type}
      </Typography>
    </ListItem>
      ))}
    </div>
        </List>
      </Popover>
    </>
  );
};

export default NotificationComponent;