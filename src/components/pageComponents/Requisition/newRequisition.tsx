import React, { useContext, useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { Helmet } from 'react-helmet';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { UserContext } from '../../../auth/UserContext';
import Spinner from '../../Spinner';
import RequestForm, { SaleInput } from '../purchase/requestForm';
import { GET_QUOTES } from '../../../graphql/rquest';
import { useNavigate } from 'react-router-dom';

const CREATE_PURCHASE_REQUEST_MUTATION = gql`
mutation CreatePurchaseRequest($input: CreatePurchaseRequestInput!) {
  createPurchaseRequest(input: $input) {
    id
    userId
    status
    remark
    addressDetail
    estimatedDelivery
    products {
      id
      Description
      code
      manufacture
      model
      partNumber
      quantity
      title
      uom
    }
  }
}
`;

/*mutation CreatePurchaseRequest($input: CreatePurchaseRequestInput!) {
  createPurchaseRequest(input: $input) {
    id
   
  }
}*/

export interface AdditionalData {
  remark: string;
  estimatedDelivery: string;
  addressDetail: string;
}
const NewRequisitionComponent: React.FC = () => {
  const navigate = useNavigate();
  const [flashMessage, setFlashMessage] = useState('');
  const [createPurchaseRequest] = useMutation(CREATE_PURCHASE_REQUEST_MUTATION, {
    refetchQueries: [{ query:GET_QUOTES }],
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { currentUser } = useContext(UserContext);

  if (!currentUser) {
    return <Spinner />;
  }

  const userId = currentUser.id as number; // Type assertion

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleSubmit = async (
    products: SaleInput[],
    supplierNewId: string[],
    additional: AdditionalData,
    selectedType: string
  ): Promise<void> => {
    try {
      if (selectedType !== 'supplier' && selectedType !== 'agent' && selectedType !== 'x-company') {
       // throw new Error('Invalid selected type');
      }
      const validProducts = products.filter((product) => product.productTitle.trim() !== '');
      const input = {
        userId:  Number(userId),
        status: 'pending',
        remark: additional.remark,
        addressDetail: additional.addressDetail,
        estimatedDelivery: additional.estimatedDelivery,
        selectedType: selectedType,

      //  suppliers: supplierNewId.map((supplierId) => ({ id: supplierId })),
      suppliers: [
        {
          "id": 1
        }
      ],
      products: validProducts.map((product) => ({
        title: product.productTitle,
        quantity: product.quantity,
        Description: product.description,
      })),

      };
      console.log(input)
      const response = await createPurchaseRequest({ variables: { input } });

      console.log('Mutation response:', response);

      setFlashMessage('Purchase request created successfully');
      setOpenSnackbar(true);

      setTimeout(() => {
        if (response.data && response.data.createPurchaseRequest && response.data.createPurchaseRequest.id) {
          navigate(`/purchaseRequest/${response.data.createPurchaseRequest.id}`);
        } else {
          console.error('Invalid response data');
          // Handle the case when the response data is not as expected
        }
      }, 2000);

    } catch (error: any) {
      console.error('Error creating purchase request:', error);
      setFlashMessage(error.message);
      // Handle error or display error message
    }
  };

  return (
    <>
      <Helmet>
        <title>New Requisition</title>
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

export default NewRequisitionComponent;