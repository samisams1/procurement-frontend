import React, { useContext, useEffect, useState } from 'react';
import {  gql, useMutation, useQuery } from '@apollo/client';
import { Helmet } from 'react-helmet';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { UserContext } from '../../../auth/UserContext';
import RequestForm, { SaleInput } from '../purchase/requestForm';
import {PURCHASE_REQUESTS_BY_USER_ID } from '../../../graphql/rquest';
import { useLocation, useNavigate } from 'react-router-dom';
import SavedForm from '../purchase/savedForm';
import { CREATE_PURCHASE_REQUEST_MUTATION } from '../../../graphql/quotation';
//import { usePurchaseRequest } from '../../../context/purchaseRequestContext';
import { PurchaseRequestData } from './manageRequisition';
const UPDATE_PURCHASE_REQUEST = gql`
mutation UpdatePurchaseRequest($input: UpdatePurchaseRequestInput) {
  updatePurchaseRequest(input: $input) {
    id
  }
}
`;
export interface AdditionalData {
  remark: string;
  estimatedDelivery: string;
  addressDetail: string;
  approvedBy:string;
  requestedBy:string;
}
const NewRequisitionComponent: React.FC = () => {
  const location = useLocation();
  const [buttonLoading, setButtonLoading] = useState(false);
  const id = location.state?.id;
  const samis =location.state?.estimatedDelivery;
  const address =  location.state?.addressDetail;
  const remark =  location.state?.remark;
  const categoryId =  location.state?.categoryId;
  const sourceType = location.state?.sourceType;
  const requestedBy = location.state?.requestedBy;
  const approvedBy = location.state?.approvedBy;
  const products=location.state?.products || [];
  const navigate = useNavigate();
  const [flashMessage, setFlashMessage] = useState('');
  const { currentUser } = useContext(UserContext);
  const userId = currentUser?.id || '';
  const [createPurchaseRequest] = useMutation(CREATE_PURCHASE_REQUEST_MUTATION, {
    refetchQueries: [
      {
        query: PURCHASE_REQUESTS_BY_USER_ID,
        variables: { userId: userId,status:"pending" },
      },
    ],
  });
 /* const [savePurchaseRequest] = useMutation(SAVE_PURCHASE_REQUEST_MUTATION, {
    refetchQueries: [{ query:GET_QUOTES }],
});*/
const {refetch } = useQuery<PurchaseRequestData>(PURCHASE_REQUESTS_BY_USER_ID, {
  variables: { userId: Number(userId),status:"pending" },
});
const [updatePurchaseRequest] = useMutation(UPDATE_PURCHASE_REQUEST);

  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
const handleSubmit = async (
  products: SaleInput[],
  supplierNewId: string[],
  additional: AdditionalData,
  selectedType: string,
  categoryId: string,
  buttonType: string,
): Promise<void> => {
  try {
    setButtonLoading(true); 
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
      // id:id,
        userId: Number(userId),
        status: "sent",
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
        model: product.model,
      })),
    };
    console.log(input)
    const inputSave = {
      purchaseRequest: {
        userId: Number(userId),
        status: 'saved',
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
        model: product.model,
      })),
    };
    const saveUpdate = {
      purchaseRequest: {
        id:id,
        userId: Number(userId),
        status: 'saved',
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
        model: product.model,
      })),
    };
    const draftSent = {
      purchaseRequest: {
        id:Number(id),
        userId: Number(userId),
        status: 'sent',
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
        model: product.model,
      })),
    };
    console.log(input); 
    if (buttonType === "save") {
     console.log("kebebush") 
      const response = await createPurchaseRequest({ variables: { input:inputSave } });
      refetch();
      setButtonLoading(false);
      console.log('Mutation response:', response);
      setFlashMessage('Your request is sent successfully sams');
      setOpenSnackbar(true);
      setTimeout(() => {
        if (response.data && response.data.createPurchaseRequest && response.data.createPurchaseRequest.id) {

          navigate(`/drafts`);
        } else {
          console.error('Invalid response data');
          // Handle the case when the response data is not as expected
        }
      }, 5000);
    } else if (buttonType === "saveUpdate") {
      
      const response = await updatePurchaseRequest({ variables: { input:saveUpdate } });
      refetch();
      setButtonLoading(false);
      console.log('Mutation response:', response);
      setFlashMessage('Your request is saved successfully');
      setOpenSnackbar(true);
      setTimeout(() => {
        if (response.data) {
          navigate(`/requisitions`);
        } else {
          console.error('Invalid response data');
          // Handle the case when the response data is not as expected
        }
      }, 5000);
    }else if (buttonType === "draftSent") {
      
      const response = await updatePurchaseRequest({ variables: { input:draftSent } });
      refetch();
      setButtonLoading(false);
      console.log('Mutation response:', response);
      setFlashMessage('Your request is saved successfully');
      setOpenSnackbar(true);
      setTimeout(() => {
        if (response.data) {
          //navigate(`/requisitions`);
         navigate(`/purchaseRequest/${id}`);

        } else {
          console.error('Invalid response data');
          // Handle the case when the response data is not as expected
        }
      }, 5000);
    } else if (buttonType === "send") {
      const response = await createPurchaseRequest({ variables: { input } });
      refetch();
      setButtonLoading(false);
      console.log('Mutation response:', response);
      setFlashMessage('Your request is sent successfully');
      setOpenSnackbar(true);
      setTimeout(() => {
        if (response.data && response.data.createPurchaseRequest && response.data.createPurchaseRequest.id) {
         // navigate(`/purchaseRequest/${response.data.createPurchaseRequest.id}`);
         navigate('/requisitions')
        } else {
          console.error('Invalid response data');
          // Handle the case when the response data is not as expected
        }
      }, 5000);
    }
  } catch (error: any) {
    console.error('Error creating/saving purchase request:', error);
    setFlashMessage(error.message);
    // Handle error or display error message
  }
};
useEffect(() => {
  refetch();
}, [location.pathname, refetch]);
  return (
    <>
      <Helmet>
        <title>New Requisition</title>
      </Helmet>
      <Snackbar
  open={openSnackbar}
 // autoHideDuration={6000}
  onClose={handleCloseSnackbar}
  style={{
    left: '50%',
    transform: 'translateX(-50%)',
  }}
>
  <Alert onClose={handleCloseSnackbar} severity="success">
    {flashMessage}
  </Alert>
</Snackbar>
      {
        id ?<SavedForm loading={buttonLoading}  onSubmit={handleSubmit} purchaseRequestId={id} estimatedDate={samis} 
        addressData={address} remarkData={remark} categoryIdData =  {categoryId} sourceType= {sourceType} savedProducts={products}
        requestedData = {requestedBy} approvedData = {approvedBy} 
        />:
        <RequestForm   loading={buttonLoading} onSubmit={handleSubmit}/>
      }
      {id}
    </>
  );
};
export default NewRequisitionComponent;