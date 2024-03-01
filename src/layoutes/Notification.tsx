import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton, Badge, Popover, List, ListItem, ListItemText,Chip, Typography } from '@mui/material';
import { Notifications } from '@mui/icons-material';
import { gql, useMutation, useQuery } from '@apollo/client';
import Spinner from '../components/Spinner';
import { UserContext } from '../auth/UserContext';
import {  CheckCircle, Error } from '@mui/icons-material';

interface Notification {
  id: string;
  message: string;
  status:string;
  type :string;
  createdAt: string;
}

interface NotificationsInfo {
  notifications: Notification[];
  count: number;
}

const GET_NOTIFICATIONS_INFO = gql`
  query NotificationsByUserIdInfo($recipientId: Int!) {
    notificationsByUserIdInfo(recipientId: $recipientId) {
      count
      notifications {
        id
        status
        type
        message
        createdAt
      }
    }
  }
`;

const UPDATE_NOTIFICATION_MUTATION = gql`
mutation UpdateNotification($updateNotificationId: Int!) {
  updateNotification(id: $updateNotificationId) {
    status
  }
}
`;

const NotificationComponent = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [maxHeight, setMaxHeight] = useState<number>(0);
  const { currentUser } = useContext(UserContext);
  const userId = currentUser?.id ?? '';
  const [updateNotification] = useMutation(UPDATE_NOTIFICATION_MUTATION, {
    variables: { recipientId: 1 },
  });
  const { loading, data, refetch } = useQuery<{ notificationsByUserIdInfo: NotificationsInfo }>(
    GET_NOTIFICATIONS_INFO,
    { variables: { recipientId: Number(userId) } }
  );
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = () => {
      refetch(); // Fetch the latest notifications
    };

    const interval = setInterval(fetchNotifications, 10000); // Fetch every 10 seconds

    return () => {
      clearInterval(interval);
    };
  }, [refetch]);

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

  if (loading) return <Spinner />;

  const { notifications, count } = data?.notificationsByUserIdInfo || {};

  const handleNotificationClick = async (notification: Notification) => {
    // Determine the page to navigate based on the notification type
    let route = '';

    switch (notification.message) {
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

    const notificationId = notification.id;

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
          backgroundColor: '#00b0ad',
          '&:hover': {
            backgroundColor: '#b9e5e5',
          },
        }}
      >
        <Badge badgeContent={count} color="error">
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
    <ListItem
    key={notification.message}
    onClick={() => handleNotificationClick(notification)}
    alignItems="flex-start"
    sx={{
      borderRadius: 8,
      '&:hover': {
        backgroundColor: '#f5f5f5',
      },
    }}
  >
    <ListItemText
      primary={
        <Typography
          component="div"
          variant="subtitle1"
          fontWeight="bold"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <Notifications sx={{ marginRight: '8px', fontSize: '1.2rem' }} />
          {notification.type}
        </Typography>
      }
      secondary={notification.message}
      secondaryTypographyProps={{ sx: { color: 'text.secondary' } }}
    />
    <div>
      {notification.status === 'read' ? (
        <Chip
          icon={<CheckCircle />}
          label="Read"
          color="primary"
          size="small"
          sx={{ backgroundColor: '#e0f2f1', color: '#009688' }}
        />
      ) : (
        <Chip
          icon={<Error />}
          label="Unread"
          color="secondary"
          size="small"
          sx={{ backgroundColor: '#fce4ec', color: '#f50057' }}
        />
      )}
    </div>
    <IconButton
      aria-label="Mark as read"
      size="small"
      sx={{
        ml: 'auto',
        '&:hover': {
          backgroundColor: 'transparent',
          color: '#009688',
        },
      }}
    >
      <CheckCircle fontSize="small" />
    </IconButton>
  </ListItem>
      ))}
    </div>
        </List>
      </Popover>
    </>
  );
};

export default NotificationComponent;