import React, { useContext } from 'react';
import { useQuery, gql } from '@apollo/client';
import { Grid, Paper, Typography } from '@mui/material';
import Spinner from '../../Spinner';
import { useParams } from 'react-router-dom';
import QuotationDetail from './Detail';
import PageHeader from '../../PageHeader';
import { PeopleTwoTone } from '@mui/icons-material';
import { UserContext } from '../../../auth/UserContext';

interface PurchaseRequest {
  id: number;
  purchaseRequestId: string;
  supplierId: string;
  referceNumber:string
  customerId: string;
  status: string;
  createdAt: string;
  productPrices: {
    id: number;
    product: {
      title: string;
      quantity: string;
      partNumber: string;
      code: string;
      Description: string;
      status: string;
    };
    price: number;
  }[];
}
interface CreateOrderComponentProps {
  customerId: number;
  fullName:string;

}
const PURCHASE_REQUEST_BY_SUPPLIER_QUERY = gql`
  query GetQuotationByRequestId($requestId: Float!) {
    quotationByRequestId(requestId: $requestId) {
      purchaseRequestId
      id
      customerId
      supplierId
      status
      createdAt
      productPrices {
        id
        product {
          title
          quantity
          partNumber
          code
          Description
          status
        }
        price
      }
    }
  }
`;

const ManageRfqComponent: React.FC =()=> {
const { currentUser } = useContext(UserContext);

if (!currentUser) {
  return <Spinner />;
}
const customerId = currentUser.id as number; // Type assertion
const fullName = currentUser.firstName;

return <CreateOrderComponent  fullName = {fullName} customerId = {customerId}  />;
};

const CreateOrderComponent: React.FC<CreateOrderComponentProps> = ({ customerId,fullName }) => {
  const { id } = useParams<{ id?: string }>();
  const { loading, error, data } = useQuery(PURCHASE_REQUEST_BY_SUPPLIER_QUERY, {
    variables: { requestId: Number(id) },
  });

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const purchaseRequests = data?.quotationByRequestId;
  /*const formatCreatedAt = (createdAt: string): string => {
    // ... (formatting logic remains the same)
  };*/

  // Filter purchase requests where product status is "wait"
  const filteredPurchaseRequests = purchaseRequests.filter(
    (request: PurchaseRequest) =>
      request.productPrices.some(
        (price) => price.product.status === 'wait'
      )
  );

  if (filteredPurchaseRequests.length === 0) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
    <Typography variant="h4">No RFQs available  Waiting ...</Typography>
  </div>;
  }

  return (
    <div>
      <div>
      <PageHeader
            title="send New Order"
            subTitle="You can comapre the price and select and send order RFQ Details"
            icon={<PeopleTwoTone fontSize="large" />}
        /> 
      <Grid container spacing={2}>
        {purchaseRequests.map((request:PurchaseRequest) => (
          request.status === "comformed" ?
          <Grid item xs={12} sm={12} md={12} key={request.id} >
            <Paper
              elevation={3}
              style={{
                padding: '16px',
                cursor: 'pointer',
                backgroundColor: '#e0e0e0',
                position: 'relative',
              }}
            > 
               <Typography variant="body1" component="div" style={{ color: '#3c44b1' }}>
                Supplier ID: {request.supplierId}
              </Typography>
              <Typography variant="body1" component="div" style={{ color: '#3c44b1' }}>
                Customer Full Name: {fullName}
              </Typography>
              <Typography variant="body1" component="div" style={{ color: '#3c44b1' }}>
                Request ID: {request.purchaseRequestId}
              </Typography>
              <Typography variant="body1" component="div" style={{ color: '#3c44b1' }}>
                Request ID: {request.status}
              </Typography>
              <Typography variant="body1" component="div" style={{ color: '#555' }}>
              </Typography>
            </Paper>
           <QuotationDetail id={1}  newId = {customerId}/>
          </Grid>: ''
        
        ))}
      </Grid>
    
    </div>
    </div>
  );
};

export default ManageRfqComponent;