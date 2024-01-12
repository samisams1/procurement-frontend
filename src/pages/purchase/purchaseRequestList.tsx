import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { Grid, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const GET_PURCHASE_REQUESTS = gql`
  query GetPurchaseRequests {
    purchaseRequests {
      id
      status
      user {
        username
      }
      products {
        id
        title
      }
      suppliers {
        id
        user {
          id
          username
        }
      }
    }
  }
`;

interface PurchaseRequest {
  id: string;
  status: string;
  user: {
    username: string;
  };
  products: {
    id: string;
    title: string;
  }[];
  suppliers: {
    id: string;
    user: {
      id: string;
      username: string;
    };
  }[];
}

const PurchaseRequestList: React.FC = () => {
  const navigate = useNavigate();

  const { loading, error, data } = useQuery<{ purchaseRequests: PurchaseRequest[] }>(GET_PURCHASE_REQUESTS);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const { purchaseRequests } = data!;

  const handleClick = (id: string) => {
    navigate(`/purchaseRequestDetail/${id}`);
  };

  return (
    <div>
      <Typography variant="h3" component="div" style={{ color: '##3c44b1' }}>Requests</Typography>
      <Grid container spacing={2}>
        {purchaseRequests.map((request) => (
          <Grid item xs={12} sm={6} md={4} key={request.id} onClick={() => handleClick(request.id)}>
            <Paper
              elevation={3}
              style={{
                padding: '16px',
                cursor: 'pointer',
                backgroundColor: '#e0e0e0', // Customize the background color of the Paper component
              }}
            >
              <Typography variant="body1" component="div" style={{ color: '#3c44b1' }}>
                Request ID: {request.id}
              </Typography>
              <Typography variant="body1" component="div" style={{ color: '#555' }}>
                From Customer: {request.user.username}
              </Typography>
              <Typography variant="body1" component="div" style={{ color: '#888' }}>
               To Suppliers: {request.suppliers.map((supplier) => supplier.user.username).join(', ')}
              </Typography>
              <Typography variant="h6" component="div" style={{ color: '#333' }}>
                products: {request.products.map((product) => product.title).join(', ')}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default PurchaseRequestList;