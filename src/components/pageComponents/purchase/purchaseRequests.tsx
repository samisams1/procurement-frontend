import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { List, ListItem, ListItemText, Typography, CircularProgress } from '@mui/material';
import {ThemeProvider, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Popup from '../../Popup';
import PurchaseDetail from './purchaseDetail';
import { useNavigate } from 'react-router-dom';
interface PurchaseRequest {
  id: number;
  userId: number;
  status: string;
  products: {
    title: string;
    id: number;
  }[];
}

interface PurchaseRequestData {
  purchaseRequestBYSupplierId: PurchaseRequest[];
}

interface PurchaseRequestVars {
  userId: number;
}

const PURCHASE_REQUEST_BY_SUPPLIER_QUERY = gql`
  query PurchaseRequestBYSupplierId($userId: Int!) {
    purchaseRequestBYSupplierId(userId: $usTypographyerId) {
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
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedId] = useState<number | null>(null);
  const [status] = useState<string>('');
  const [customerId] = useState<string>('');
  const navigate = useNavigate();
  const { loading, error, data } = useQuery<PurchaseRequestData, PurchaseRequestVars>(PURCHASE_REQUEST_BY_SUPPLIER_QUERY, {
    variables: { userId: 1 }, // Replace with the desired user ID
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const { purchaseRequestBYSupplierId } = data!;

  return (
    <ThemeProvider theme={theme}>Typography
      <List>
        {purchaseRequestBYSupplierId.map((request) => (
          <ListItem key={request.id} alignItems="flex-start" disableGutters={!isMobile} divider onClick={() => {
            /*setSelectedId(request.id);
            setStatus(request.status);
            setCustomerId("1");
            setOpenPopup(true);*/
            navigate('/sendRfq')
          }}>
            <ListItemText
              primary={
                <Typography variant="h6" color="primary">
                  Request ID: {request.id}
                </Typography>
              }
              secondary={
                <>
                  <Typography variant="body2" color="textSecondary">
                    User ID: {request.userId}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Status: {request.status}
                  </Typography>
                </>
              }
            />
            <div>
              <Typography variant="h6" color="primary">
                Products:
              </Typography>
              {request.products.map((product) => (
                <Typography variant="body2" key={product.id}>
                  - {product.title}
                </Typography>
              ))}
            </div>
          </ListItem>
        ))}
      </List>
      <Popup title="Purchase Request " openPopup={openPopup} setOpenPopup={setOpenPopup}>
        <PurchaseDetail id={selectedId} status={status} customerId={customerId} supplierId={1} />
      </Popup>
    </ThemeProvider>
  );
};

export default PurchaseRequests;