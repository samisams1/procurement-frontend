import React, { useContext } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography
} from '@mui/material';
import { UserContext,CurrentUser } from '../../../auth/UserContext';
import Spinner from '../../Spinner';
const user = {
  avatar: '../../../../assets/sams.jpg',
  city: 'Addis Ababa',
  country: 'Ethiopia',
  jobTitle: 'Admin',
  name: 'Admin',
  timezone: 'GMT-7'
};

export const SupplierProfile = () => {
  const { currentUser } = useContext(UserContext);

  if (!currentUser) {
    return <Spinner />;
  }

  const {lastName }: CurrentUser = currentUser;

  const handleUpload = (event:any) => {
   // const file = event.target.files[0];
    // Perform the necessary upload logic here
  };
 
  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Avatar
            src={user.avatar}
            sx={{
              height: 80,
              mb: 2,
              width: 80
            }}
          />
          <Typography gutterBottom variant="h5">
            {lastName}
          </Typography>
          <Typography color="text.secondary" variant="body2">
            {user.city} {user.country}
          </Typography>
          <Typography color="text.secondary" variant="body2">
            {user.timezone}
          </Typography>
        </Box>
      </CardContent>
      <Divider />
      <CardActions>
        <Button fullWidth variant="text" component="label" htmlFor="upload-input">
          Upload Logo
        </Button>
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="upload-input"
          type="file"
          onChange={handleUpload}
        />
      </CardActions>
    </Card>
  );
};