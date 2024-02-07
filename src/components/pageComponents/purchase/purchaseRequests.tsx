import React, { useContext, useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { Grid, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../auth/UserContext';
import Spinner from '../../Spinner';
import Popup from '../../Popup';
import PurchaseDetail from './purchaseDetail';
import PageHeader from '../../PageHeader';

interface PurchaseRequest {
  id: number;
  status: string;
  createdAt: string;
  user: {
    id:string;
    username: string;
  };
  products: Product[];
  suppliers: Supplier[];
}
interface Product {
  id: number;
  title: string;
}

interface Supplier {
  id: number;
  user: {
    id: number;
    username: string;
  };
}

interface PurchaseRequestBySupplierQueryData {
  purchaseRequestBySupplier: PurchaseRequest[] | null;
}

interface PurchaseRequestBySupplierQueryVars {
  userId: number;
}

const PURCHASE_REQUEST_BY_SUPPLIER_QUERY = gql`
query PurchaseRequestBYSupplierId($userId: Int!) {
  purchaseRequestBYSupplierId(userId: $userId) {
    id
    userId
    status
    products {
      title
      id
    }
  }
}
`;

const PurchaseRequests: React.FC = () => {
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();

  if (!currentUser) {
    return <Spinner />;
  }

  const id = currentUser.id as number; // Type assertion

  return <PurchaseRequestList id={id} navigate={navigate} />;
};

const PurchaseRequestList: React.FC<{ id: number; navigate: any }> = ({ id, navigate }) => {
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [status, setStatus] = useState<string>('');
  const [customerId, setCustomerId] = useState<string>('');
  const { loading, error, data } = useQuery<PurchaseRequestBySupplierQueryData, PurchaseRequestBySupplierQueryVars>(
    PURCHASE_REQUEST_BY_SUPPLIER_QUERY,
    {
      variables: { userId: id },
    }
  );

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
console.log(data)
  const purchaseRequests = data?.purchaseRequestBySupplier || [];

  const formatCreatedAt = (createdAt: string): string => {
    const date = new Date(createdAt);
    const year = date.getFullYear().toString().padStart(4, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const milliseconds = date.getMilliseconds().toString().padStart(3, '0');
    return `${year}-${month}-${day} time ${hours}:${minutes}:${seconds}.${milliseconds}`;
  };

  return (
    <div>
      <Typography
        variant="h3"
        component="div"
        style={{
          color: '#3c44b1',
          textAlign: 'center',
          margin: 'auto',
        }}
      >
     <PageHeader  title = "Requests"/>
      </Typography>
      <Grid container spacing={2}>
        {purchaseRequests.map((request) => (
          <Grid item xs={12} sm={6} md={4} key={request.id} onClick={() => {
            setSelectedId(request.id);
            setStatus(request.status);
            setCustomerId(request.user.id);
            setOpenPopup(true);
          }}>
            <Paper
              elevation={3}
              style={{
                padding: '16px',
                cursor: 'pointer',
                backgroundColor: '#e0e0e0',
                position: 'relative',
              }}
            >
              {request.status === 'wait' && (
               <div
               style={{
                 position: 'absolute',
                 top: 5,
                 right: 0,
                 width: `${request.status.length * 8}px`,
                 height: '18px',
                 backgroundColor: 'red',
                 borderRadius: '50%',
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 fontSize: '12px',
                 color: 'white',
                 fontWeight: 'bold',
                 zIndex: 9999,
               }}
             >
               {request.status}
             </div>
              )}
              {request.status === 'comformed' && (
               <div
               style={{
                 position: 'absolute',
                 top: 5,
                 right: 0,
                 width: `${request.status.length * 8}px`,
                 height: '18px',
                 backgroundColor: 'green',
                 borderRadius: '50%',
                 alignItems: 'center',
                 justifyContent: 'center',
                 fontSize: '12px',
                 color: 'white',
                 fontWeight: 'bold',
                 zIndex: 9999,
               }}
             >
               {request.status}
             </div>
              )}
              <Typography variant="body1" component="div" style={{ color: '#3c44b1' }}>
                Request ID: {request.id}
              </Typography>
              <Typography variant="body1" component="div" style={{ color: '#3c44b1' }}>
                Request ID: {request.status}
              </Typography>
              <Typography variant="body1" component="div" style={{ color: '#555' }}>
                From Customer: {request.user.username}
              </Typography>
              <Typography variant="body1" component="div" style={{ color: '#555' }}>
                Created At: {formatCreatedAt(request.createdAt)}
              </Typography>
              <Typography variant="h6" component="div" style={{ color: '#333' }}>
                Products: {request.products.map((product) => product.title).join(', ')}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Popup title="Purchase Request " openPopup={openPopup} setOpenPopup={setOpenPopup}>
        <PurchaseDetail id={selectedId} status={status} customerId={customerId} supplierId={id} />
      </Popup>
    </div>
  );
};

export default PurchaseRequests;