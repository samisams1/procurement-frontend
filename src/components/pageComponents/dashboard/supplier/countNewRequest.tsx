import React from 'react';
import PropTypes from 'prop-types';
import { Avatar, Card, CardContent, Stack, SvgIcon, Typography } from '@mui/material';
import { useQuery } from '@apollo/client';
import UsersIcon from '@heroicons/react/24/solid/UsersIcon';
import Spinner from '../../../Spinner';
import { COUNT_REQUEST } from '../../../../graphql/rquest';

export const CountNewRequest = (props:any) => {
  const {  sx,  } = props;
  const {loading,error,data} = useQuery(COUNT_REQUEST);
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
             New Request
            </Typography>
            <Typography variant="h4">
              {data.countrequests}
            </Typography>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: '#690618',
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

CountNewRequest.prototypes = {
  difference: PropTypes.number,
  positive: PropTypes.bool,
  sx: PropTypes.object,
  value: PropTypes.string.isRequired
};