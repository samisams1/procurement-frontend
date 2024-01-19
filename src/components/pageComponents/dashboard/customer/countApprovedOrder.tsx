import React from 'react';
import PropTypes from 'prop-types';
import { Avatar, Card, CardContent, Stack, SvgIcon, Typography } from '@mui/material';
import { useQuery } from '@apollo/client';
import UsersIcon from '@heroicons/react/24/solid/UsersIcon';
import Spinner from '../../../Spinner';
import { COUNT_ORDER_BY_STATUS } from '../../../../graphql/Order';

export const ApprovedOrder = (props:any) => {
  const {  sx,  } = props;
  const {loading,error,data} = useQuery(COUNT_ORDER_BY_STATUS);
  if(loading) return <Spinner/>
  if (error) return <p>{error.message}</p>
  return (
    <Card sx={sx}>
      <CardContent>
      <Stack
          alignItems="flex-start"
          direction="row"
          justifyContent="space-between"
          spacing={3}
        >
             <Stack spacing={1}>
            <Typography
              color="text.secondary"
              variant="overline"
              fontSize={25}
              fontWeight={900}
            >
           Appr Order
            </Typography>
            <Typography variant="h4">
              {data.countOrders}
            </Typography>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: '#923ea1',
              height: 56,
              width: 56
            }}
          >
            <SvgIcon>
              <UsersIcon />
            </SvgIcon>
          </Avatar>
      </Stack>
     
      </CardContent>
    </Card>
  );
};

ApprovedOrder.prototypes = {
  difference: PropTypes.number,
  positive: PropTypes.bool,
  sx: PropTypes.object,
  value: PropTypes.string.isRequired
};