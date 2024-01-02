import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { IconButton, Badge, Popover, List, ListItem, ListItemText, ListItemIcon, Typography } from '@mui/material';
import { Notifications, Description } from '@mui/icons-material';
import useCountOrders from '../components/pageComponents/dashboard/countedOrder';

const NotificationComponent = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [maxHeight, setMaxHeight] = useState<number>(0);

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
console.log(countOrders.countOrders)
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
        <Badge badgeContent={countOrders.countOrders} color="error">
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
          <ListItem button component={RouterLink} to="/notificationDetail" sx={{ py: 2 }}>
            <ListItemIcon>
              <Description />
            </ListItemIcon>
            <ListItemText
              primary="This is a short message"
              sx={{ wordWrap: 'break-word' }}
            />
          </ListItem>
          <ListItem button component={RouterLink} to="/notificationDetail" sx={{ py: 2 }}>
            <ListItemIcon>
              <Description />
            </ListItemIcon>
            <ListItemText
              primary="This is another short message"
              sx={{ wordWrap: 'break-word' }}
            />
          </ListItem>
        </List>
      </Popover>
    </>
  );
};

export default NotificationComponent;