import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { Helmet } from 'react-helmet';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import RequestForm, { SaleInput } from '../../components/pageComponents/purchase/requestForm';

const CREATE_PURCHASE_REQUEST_MUTATION = gql`
  mutation CreatePurchaseRequest($input: CreatePurchaseRequestInput!) {
    createPurchaseRequest(input: $input) {
      id
    }
  }
`;

const Purchase: React.FC = () => {
  const [flashMessage, setFlashMessage] = useState('');
  const [createPurchaseRequest] = useMutation(CREATE_PURCHASE_REQUEST_MUTATION);
  //const [formValues, setFormValues] = useState<SaleInput[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleSubmit = async (products: SaleInput[], selectedSuppliers: number[]): Promise<void> => {
    try {
      // Perform any necessary validation or data transformations before calling the mutation
      const validProducts = products.filter((product) => product.productTitle.trim() !== '');

      // Format the input object
      const input = {
        userId: 1,
        products: validProducts.map((product) => ({ title: product.productTitle })),
        suppliers: selectedSuppliers.map((supplierId) => ({ id: supplierId })),
      };

      // Call the mutation to create a purchase request
      const response = await createPurchaseRequest({ variables: { input } });

      console.log('Mutation response:', response);

      setFlashMessage('Purchase request created successfully');
      setOpenSnackbar(true);

      // Clear the input values
     // setFormValues([]);

      // Perform any further actions or display success message
    } catch (error: any) {
      console.error('Error creating purchase request:', error);
      setFlashMessage(error.message);
      // Handle error or display error message
    }
  };

  return (
    <>
      <Helmet>
        <title>Purchase</title>
      </Helmet>
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {flashMessage}
        </Alert>
      </Snackbar>
      {/* Your JSX code for the Purchase component goes here */}
      <RequestForm onSubmit={handleSubmit} />
    </>
  );
};

export default Purchase;