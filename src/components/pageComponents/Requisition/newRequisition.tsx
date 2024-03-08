import React, { useContext, useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { Helmet } from 'react-helmet';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { UserContext } from '../../../auth/UserContext';
import Spinner from '../../Spinner';
import RequestForm, { SaleInput } from '../purchase/requestForm';
import { GET_QUOTES } from '../../../graphql/rquest';
import { useLocation, useNavigate } from 'react-router-dom';
import SavedForm from '../purchase/savedForm';

const CREATE_PURCHASE_REQUEST_MUTATION = gql`
mutation CreatePurchaseRequest($input: CreatePurchaseRequestInput!) {
  createPurchaseRequest(input: $input) {
    id
    userId
    status
    remark
    imageUrl
    addressDetail
    estimatedDelivery
    referenceNumber
    createdAt
  }
}
`;
const SAVE_PURCHASE_REQUEST_MUTATION = gql`
mutation CreateDraftequest($input: CreatePurchaseRequestInput) {
  createDraftequest(input: $input) {
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
      manufacturer
      model
      partNumber
      quantity
      title
      uom
      mark
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
  approvedBy:string;
  requestedBy:string;
}
const NewRequisitionComponent: React.FC = () => {
  const location = useLocation();
  const id = location.state?.id;
  const samis =location.state?.estimatedDelivery;
  const address =  location.state?.addressDetail;
  const remark =  location.state?.remark;
  const categoryId =  location.state?.categoryId;
  const sourceType = location.state?.sourceType;
  
  const navigate = useNavigate();
  const [flashMessage, setFlashMessage] = useState('');
  const [createPurchaseRequest] = useMutation(CREATE_PURCHASE_REQUEST_MUTATION, {
    refetchQueries: [{ query:GET_QUOTES }],
  });
  const [savePurchaseRequest] = useMutation(SAVE_PURCHASE_REQUEST_MUTATION, {
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

  /*const handleSubmit = async (
    products: SaleInput[],
    supplierNewId: string[],
    additional: AdditionalData,
    selectedType: string,
    categoryId:string,
    buttonType:string,
  ): Promise<void> => {
    try {
      if (selectedType !== 'supplier' && selectedType !== 'agent' && selectedType !== 'x-company') {
       // throw new Error('Invalid selected type');
      }
      const validProducts = products.filter((product) => product.productTitle.trim() !== '');
      const input = {
       
        purchaseRequest : {
        userId:  Number(userId),
        status: 'pending',
        remark: additional.remark,
        addressDetail: additional.addressDetail,
        estimatedDelivery: additional.estimatedDelivery,
        selectedType: selectedType,
        categoryId:Number(categoryId),
        },
        suppliers: supplierNewId.map((supplierId) => ({ id: supplierId })),
        products: validProducts.map((product) => ({
        title: product.productTitle,
        quantity: product.quantity,
        mark:product.mark,
        uom:product.uom,
        Description: product.description,
        code:product.code,
        manufacturer: product.manufacturer,
        partNumber: product.partNumber,
        model:product.model,
      })),

      };
      const inputSave = {
       
        purchaseRequest : {
        userId:  Number(userId),
        status: 'saved',
        remark: additional.remark,
        addressDetail: additional.addressDetail,
        estimatedDelivery: additional.estimatedDelivery,
        referenceNumber: "samisam",
        selectedType: selectedType,
        categoryId:Number(categoryId),
        }
      };
      console.log(input)
      if(buttonType==="save"){
        alert("saved")
        const response = await savePurchaseRequest({ variables: { inputSave } });
        console.log("fasile");
        console.log(inputSave)
        setFlashMessage('Your request are Saved successfully');
        setOpenSnackbar(true);
  
        setTimeout(() => {
          if (response.data && response.data.createPurchaseRequest && response.data.createPurchaseRequest.id) {
            navigate(`/purchaseRequest/${response.data.createPurchaseRequest.id}`);
          } else {
            console.error('Invalid response data');
            // Handle the case when the response data is not as expected
          }
        }, 2000); 
      }if(buttonType==="send"){
        const response = await createPurchaseRequest({ variables: { input } });

        console.log('Mutation response:', response);
  
        setFlashMessage('Your request are sent successfully');
        setOpenSnackbar(true);
  
        setTimeout(() => {
          if (response.data && response.data.createPurchaseRequest && response.data.createPurchaseRequest.id) {
            navigate(`/purchaseRequest/${response.data.createPurchaseRequest.id}`);
          } else {
            console.error('Invalid response data');
            // Handle the case when the response data is not as expected
          }
        }, 2000); 
      }
    } catch (error: any) {
      console.error('Error creating purchase request:', error);
      setFlashMessage(error.message);
      // Handle error or display error message
    }
  };
*/
const handleSubmit = async (
  products: SaleInput[],
  supplierNewId: string[],
  additional: AdditionalData,
  selectedType: string,
  categoryId: string,
  buttonType: string,
): Promise<void> => {
  try {
    if (
      selectedType !== 'supplier' &&
      selectedType !== 'agent' &&
      selectedType !== 'x-company'
    ) {
      throw new Error('Invalid selected type');
    }
    const validProducts = products.filter(
      (product) => product.productTitle.trim() !== ''
    );
    const input = {
      purchaseRequest: {
        userId: Number(userId),
        status: 'pending',
        remark: additional.remark,
        addressDetail: additional.addressDetail,
        estimatedDelivery: additional.estimatedDelivery,
        sourceType: selectedType,
        categoryId: Number(categoryId),
        approvedBy:additional.approvedBy,
        requestedBy:additional.requestedBy
      },
      suppliers: supplierNewId.map((supplierId) => ({ id: supplierId })),
      products: validProducts.map((product) => ({
        title: product.productTitle,
        quantity: product.quantity,
        mark: product.mark,
        uom: product.uom,
        Description: product.description,
        code: product.code,
        manufacturer: product.manufacturer,
        partNumber: product.partNumber,
        model: product.model,
      })),
    };
    const inputSave = {
      purchaseRequest: {
        userId: Number(userId),
        status: 'saved',
        remark: additional.remark,
        addressDetail: additional.addressDetail,
        estimatedDelivery: additional.estimatedDelivery,
        referenceNumber: "samisam",
        sourceType: selectedType,
        categoryId: Number(categoryId),
        approvedBy:additional.approvedBy,
        requestedBy:additional.requestedBy
      },
      products: validProducts.map((product) => ({
        title: product.productTitle,
        quantity: product.quantity,
        mark: product.mark,
        uom: product.uom,
        Description: product.description,
        code: product.code,
        manufacturer: product.manufacturer,
        partNumber: product.partNumber,
        model: product.model,
      })),
    };
    console.log(input);
    if (buttonType === "save") {
      alert("saved");
      const response = await savePurchaseRequest({ variables: { input: inputSave } });
      console.log("response:", response);
      setFlashMessage('Your request is saved successfully');
      setOpenSnackbar(true);
      setTimeout(() => {
        if (response.data && response.data.savePurchaseRequest && response.data.savePurchaseRequest.id) {
          navigate(`/purchaseRequest/${response.data.savePurchaseRequest.id}`);
        } else {
          console.error('Invalid response data');
          // Handle the case when the response data is not as expected
        }
      }, 2000);
    } else if (buttonType === "send") {
      const response = await createPurchaseRequest({ variables: { input } });
      console.log('Mutation response:', response);
      setFlashMessage('Your request is sent successfully');
      setOpenSnackbar(true);
      setTimeout(() => {
        if (response.data && response.data.createPurchaseRequest && response.data.createPurchaseRequest.id) {
          navigate(`/purchaseRequest/${response.data.createPurchaseRequest.id}`);
        } else {
          console.error('Invalid response data');
          // Handle the case when the response data is not as expected
        }
      }, 2000);
    }
  } catch (error: any) {
    console.error('Error creating/saving purchase request:', error);
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
      {
        id ?<SavedForm onSubmit={handleSubmit} purchaseRequestId={id} estimatedDate={samis} 
        addressData={address} remarkData={remark} categoryIdData =  {categoryId} sourceType= {sourceType}/>:
        <RequestForm onSubmit={handleSubmit}/>
      }
    </>
  );
};

export default NewRequisitionComponent;