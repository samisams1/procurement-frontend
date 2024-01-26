import { useQuery } from '@apollo/client';
import { Box, List, ListItem, ListItemText, Typography } from '@mui/material';
import { GET_NOTIFICATIONS } from '../../../graphql/notification';

interface Notification {
  recipientId: string;
  message: string;
  type: string;
}

const Notifications: React.FC = () => {
  const { loading, error, data } = useQuery(GET_NOTIFICATIONS);

  if (loading) {
    return <Typography>Loading notifications...</Typography>;
  }

  if (error) {
    return <Typography>Error loading notifications.</Typography>;
  }

  const notifications: Notification[] = data?.notifications || [];

  return (
    <Box>
      <Typography variant="h5">Notifications</Typography>
      {notifications.length === 0 ? (
        <Typography>No notifications found.</Typography>
      ) : (
        <List>
          {notifications.map((notification: Notification, index: number) => (
            <ListItem key={index}>
              <ListItemText primary={notification.message} secondary={notification.type} />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default Notifications;