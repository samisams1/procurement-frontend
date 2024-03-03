import React, { useContext, useState, ChangeEvent } from 'react';
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
import { UserContext } from '../../../../auth/UserContext';
import Spinner from '../../../Spinner';

const UPLOAD_IMAGE_MUTATION = gql`
  mutation UploadImage($file: Upload!) {
    uploadImage(file: $file) {
      url
    }
  }
`;

export const CompanyAttachment = () => {
  const [previewImage, setPreviewImage] = useState<string | ArrayBuffer | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const { currentUser } = useContext(UserContext);
  const [uploadImageMutation] = useMutation(UPLOAD_IMAGE_MUTATION);

  if (!currentUser) {
    return <Spinner />;
  }

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const result = reader.result;
      setPreviewImage(result);
    };

    if (file) {
      reader.readAsDataURL(file);
      setSelectedFileName(file.name);

      try {
        const { data } = await uploadImageMutation({
          variables: { file },
        });
        const imageUrl = data.uploadImage.url;
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
        {/* Card content */}
      </CardContent>
      <Divider />
      <CardActions>
        <Box display="flex" alignItems="center" width="100%">
          <label htmlFor="upload-input">
            <Avatar
              src={avatarSrc}
              sx={{
                height: 80,
                width: 120,
                borderRadius: '4px',
                objectFit: 'cover',
                marginRight: '10px'
              }}
            />
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="upload-input"
              type="file"
              onChange={handleUpload}
            />

            <Button variant="text" component="span">
              Upload Your ID card
            </Button>
          </label>
          <Typography variant="body2" component="div" sx={{ marginLeft: 'auto' }}>
            {selectedFileName}
          </Typography>
          <Button variant="contained">Save</Button>
        </Box>
      </CardActions>
    </Card>
  );
};