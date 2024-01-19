import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { IconButton, Badge, Popover, List, ListItem, ListItemText, ListItemIcon, Typography } from '@mui/material';
import { Notifications, Description } from '@mui/icons-material';
import useCountOrders from '../components/pageComponents/dashboard/countedOrder';
import { gql, useQuery } from '@apollo/client';
import Spinner from '../components/Spinner';

const ORDER_QUERY = gql`
  query GetOrderDetailBySupplierId($supplierId: Float!) {
    getOrderBySupplierId(supplierId: $supplierId) {
      id
      status
      tax
      totalPrice
      createdAt
      shippingCost
      customerId
      supplierId
    }
  }
`;

interface OrderInterface {
  id: string;
  customerId: string;
  supplierId: string;
  totalPrice: number;
  createdAt: string;
  status: string;
}

const NotificationComponent = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [maxHeight, setMaxHeight] = useState<number>(0);
  const { loading, error, data } = useQuery(ORDER_QUERY, {
    variables: { supplierId: 5 },
  });

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

  const productList = data?.getOrderBySupplierId?.map((row: OrderInterface) => ({
    id: row.id,
    customerId: row.customerId,
    supplierId: row.supplierId,
    totalPrice: row.totalPrice,
    createdAt: row.createdAt,
    status: row.status,
  }));

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
          {productList?.map((row: OrderInterface) => (
            <ListItem key={row.id} button component={RouterLink} to={`/notificationDetail/${row.id}`} sx={{ py: 2 }}>
    
              <ListItemIcon>
                <Description style={{ color: row.status === 'comformed' ? 'red' : 'green' }} />
              </ListItemIcon>
              <ListItemText
                primary={`Your order is confirmed by admin with Order ID: ${row.id}, created on ${row.createdAt}. Review and please make the payment.`}
                sx={{ wordWrap: 'break-word' }}
              />
            </ListItem>
          ))}
        </List>
      </Popover>
    </>
  );
};

export default NotificationComponent;