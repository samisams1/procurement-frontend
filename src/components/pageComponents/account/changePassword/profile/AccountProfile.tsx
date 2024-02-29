
  import { useMutation, gql } from '@apollo/client';
import React, { useRef } from 'react';

const UPLOAD_PROFILE_PICTURE = gql`
mutation UploadProfilePicture($file: Upload!) {
  uploadProfilePicture(file: $file)
}
`;
export const AccountProfile = () => {
  const [uploadProfilePicture] = useMutation(UPLOAD_PROFILE_PICTURE);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0];

    if (file) {
      try {
        const { data } = await uploadProfilePicture({
          variables: { file: { createReadStream: file.name, filename: file.name } }
        });
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div>
      <input type="file" ref={fileInputRef} />
      <button onClick={handleUpload}>
        Upload Profile Picture
      </button>
    </div>
  );
};
