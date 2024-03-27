import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';

const UPLOAD_FILE = gql`
  mutation UploadFile($file: Upload!) {
    uploadFile(file: $file) {
      filename
      mimetype
      encoding
    }
  }
`;

const FileUploadForm: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadFile] = useMutation(UPLOAD_FILE);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    try {
      if (!selectedFile) {
        throw new Error('No file selected.');
      }

      console.log('Selected file:', selectedFile);

      const fileObject = {
        createReadStream: () => selectedFile,
        filename: selectedFile.name,
        mimetype: selectedFile.type,
        encoding: selectedFile.type.split('/')[1],
      };

      console.log('Prepared file object:', fileObject);

      const { data } = await uploadFile({ variables: { file: fileObject } });

      console.log('File uploaded successfully!');
      console.log('Uploaded file details:', data.uploadFile);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default FileUploadForm;
