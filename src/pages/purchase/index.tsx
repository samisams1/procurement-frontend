import React, { useContext, useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { Helmet } from 'react-helmet';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import RequestForm, { SaleInput } from '../../components/pageComponents/purchase/requestForm';
import { UserContext } from '../../auth/UserContext';
import Spinner from '../../components/Spinner';

const CREATE_PURCHASE_REQUEST_MUTATION = gql`
  mutation CreatePurchaseRequest($input: CreatePurchaseRequestInput!) {
    createPurchaseRequest(input: $input) {
      id
    }
  }
`;
export interface AdditionalData {
  remark: string;
  estimatedDelivery: string;
  addressDetail: string;
}

const Purchase: React.FC = () => {
  const [flashMessage, setFlashMessage] = useState('');
  const [createPurchaseRequest] = useMutation(CREATE_PURCHASE_REQUEST_MUTATION);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { currentUser } = useContext(UserContext);

  if (!currentUser) {
    return <Spinner />;
  }

  const userId = currentUser.id as number; // Type assertion

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const hadleFormReset = ()=>{
    console.log("remove")
  }
  const handleSubmit = async (
    products: SaleInput[],
    selectedSuppliers: number[],
    additional: AdditionalData
  ): Promise<void> => {
    try {
      // Perform any necessary validation or data transformations before calling the mutation
      const validProducts = products.filter((product) => product.productTitle.trim() !== '');
      // Format the input object
      const input = {
        userId: userId,
        status: "wait",
        remark: additional.remark,
        addressDetail: additional.addressDetail,
        estimatedDelivery: additional.estimatedDelivery,
        products: validProducts.map((product) => ({
          title: product.productTitle,
          code: product.code,
          partNumber: product.partNumber,
          uom: product.uom,
          quantity: product.quantity,
          mark: product.mark,
          model: product.model,
          Description: product.description,
          manufacturer: product.manufacturer,
        })),
        suppliers: selectedSuppliers.map((supplierId) => ({ id: supplierId })),
      };

      console.log("input");
      console.log(input);

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
      <RequestForm onSubmit={handleSubmit} />
    </>
  );
};

export default Purchase;