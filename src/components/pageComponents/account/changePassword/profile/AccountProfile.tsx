import React, { useContext, useState } from 'react';
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
import { gql, useMutation } from '@apollo/client';
import { UserContext, CurrentUser } from '../../../../../auth/UserContext';
import Spinner from '../../../../Spinner';

const UPLOAD_IMAGE_MUTATION = gql`
  mutation UploadImage($file: Upload!) {
    uploadImage(file: $file) {
      url
    }
  }
`;

export const AccountProfile = () => {
  const [previewImage, setPreviewImage] = useState<string | ArrayBuffer | null>(null);
  const { currentUser } = useContext(UserContext);
  const [uploadImageMutation] = useMutation(UPLOAD_IMAGE_MUTATION);

  if (!currentUser) {
    return <Spinner />;
  }

  const { username, lastName }: CurrentUser = currentUser;

  
  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const result = reader.result;
      setPreviewImage(result);
    };

    if (file) {
      reader.readAsDataURL(file);
      // Call the uploadImageMutation function to upload the file to the server
      try {
        const { data } = await uploadImageMutation({
          variables: { file },
        });
        const imageUrl = data.uploadImage.url; // Assuming the GraphQL mutation response contains the uploaded image URL
        // Perform any additional logic with the imageUrl, such as saving it to the user's profile
        console.log('Image uploaded:', imageUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  const avatarSrc = previewImage ? `${previewImage}` : undefined;

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
            src={avatarSrc}
            sx={{
              height: 80,
              mb: 2,
              width: 80
            }}
          />
          <Typography color="text.secondary" variant="body2">
            {username} {lastName}
          </Typography>
        </Box>
      </CardContent>
      <Divider />
      <CardActions>
        <Button fullWidth variant="text" component="label" htmlFor="upload-input">
          Upload picture
        </Button>
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="upload-input"
          type="file"
          onChange={handleUpload}
        />
        <Button fullWidth variant="contained" >
          Save
        </Button>
      </CardActions>
    </Card>
  );
};