  import React, { useContext, useState } from 'react';
  import { Avatar, Box, Button, Card, CardActions, CardContent, Divider, Typography } from '@mui/material';
  import { gql, useMutation } from '@apollo/client';
  import { UserContext, CurrentUser } from '../../../../../auth/UserContext';
  import Spinner from '../../../../Spinner';
  
  const UPLOAD_PROFILE_PICTURE_MUTATION = gql`
    mutation UploadProfilePicture($file: Upload!) {
      uploadProfilePicture(file: $file) {
        filename
        mimetype
        encoding
      }
    }
  `;
  
  export const AccountProfile = () => {
    const [previewImage, setPreviewImage] = useState<string | ArrayBuffer | null>(null);
    const { currentUser } = useContext(UserContext);
    const [uploadProfilePictureMutation] = useMutation(UPLOAD_PROFILE_PICTURE_MUTATION);
  
    if (!currentUser) {
      return <Spinner />;
    }
  
    const { username, lastName, profilePictureUrl }: CurrentUser = currentUser;
   /* const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
    
      if (file) {
        try {
          const { data } = await uploadProfilePictureMutation({
            variables: { file: { createReadStream: file.stream, filename: file.name, mimetype: file.type, encoding: '' } },
          });
    
          const { filename, mimetype, encoding } = data.uploadProfilePicture;
          console.log('Profile picture uploaded:', filename, mimetype, encoding);
    
          // You can update the preview image or trigger a refresh of the user's profile picture here
        } catch (error) {
          console.error('Error uploading profile picture:', error);
        }
      }
    };
    */
    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
    
      if (file) {
        try {
          const { data } = await uploadProfilePictureMutation({
            variables: {
              file: {
                createReadStream: () => file,
                filename: file.name,
                mimetype: file.type,
                encoding: '',
              },
            },
          });
    
          const { filename, mimetype, encoding } = data.uploadProfilePicture;
          console.log('Profile picture uploaded:', filename, mimetype, encoding);
    
          // You can update the preview image or trigger a refresh of the user's profile picture here
        } catch (error) {
          console.error('Error uploading profile picture:', error);
        }
      }
    };
    const avatarSrc = profilePictureUrl ?? undefined;
  
    return (
      <Card>
        <CardContent>
          <Box sx={{ alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
            <Avatar src={avatarSrc} sx={{ height: 80, mb: 2, width: 80 }} />
            <Typography color="text.secondary" variant="body2">
              {username} {lastName}
            </Typography>
          </Box>
        </CardContent>
        <Divider />
        <CardActions>
          <Button fullWidth variant="text" component="label" htmlFor="upload-input">
            Upload picture
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="upload-input"
              type="file"
              onChange={handleUpload}
            />
          </Button>
        </CardActions>
      </Card>
    );
  };
  
  