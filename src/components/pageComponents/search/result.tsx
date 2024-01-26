import { useLazyQuery, gql } from '@apollo/client';
import { useEffect } from 'react';
import { Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import PageHeader from '../../PageHeader';
import { Search } from '@mui/icons-material';

interface Order {
  id: number;
  orderNumber: string;
  referenceNumber: string;
}

interface PurchaseRequest {
  id: number;
  amount: number;
  referenceNumber: string;
}

interface GeneralSearchData {
  searchOrders: Order[];
  searchPurchaseRequests: PurchaseRequest[];
}
interface GeneralSearchVars {
    query: string | null;
  }

const GENERAL_SEARCH_QUERY = gql`
  query GeneralSearch($query: String!) {
    searchOrders(query: $query) {
      id
      referenceNumber
    }
    searchPurchaseRequests(query: $query) {
      id
      referenceNumber
    }
  }
`;

function Result() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchTerm = searchParams.get('searchTerm');

  const [search, { loading, error, data }] = useLazyQuery<GeneralSearchData, GeneralSearchVars>(GENERAL_SEARCH_QUERY);

  useEffect(() => {
    search({ variables: { query: searchTerm } });
  }, [search,searchTerm]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const handleOrderClick = (orderId: number) => {
    navigate(`/orderDetail/${orderId}`);
    console.log(`Order clicked: ${orderId}`);
  };

  const handleRequestClick = (requestId: number) => {
    navigate(`/purchaseRequest/${requestId}`);
    console.log(`Request clicked: ${requestId}`);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
      <Paper
              elevation={3}
              style={{
                padding: '16px',
                cursor: 'pointer',
                position: 'relative',
              }}
            >
        {data && (
          <div>
            <PageHeader
            icon = {<Search/>}
            title= "Search Results"
            subTitle = "search Request order invoice "
            />
            <div>
              <PageHeader
                title="Orders"
              />
              {data.searchOrders.length > 0 ? (
                <div>
                  {data.searchOrders.map((order) => (
                    <Paper
                      key={order.id}
                      onClick={() => handleOrderClick(order.id)}
                      style={{ cursor: 'pointer', padding: '10px', marginBottom: '10px', width: '100%' }}
                    >
                      Order Reference Number: {order.referenceNumber}
                    </Paper>
                  ))}
                </div>
              ) : (
                <p>No orders found.</p>
              )}
            </div>

            <div>
              <PageHeader
                title="Purchase Requests"
              />
              {data.searchPurchaseRequests.length > 0 ? (
                <div>
                  {data.searchPurchaseRequests.map((request) => (
                    <Paper
                      key={request.id}
                      onClick={() => handleRequestClick(request.id)}
                      style={{ cursor: 'pointer', padding: '10px', marginBottom: '10px', width: '100%' }}
                    >
                      Request Reference Number: {request.referenceNumber}
                    </Paper>
                  ))}
                </div>
              ) : (
                <p>No requests found.</p>
              )}
            </div>
          </div>
        )}
        </Paper>
      </Grid>
    </Grid>
  );
}

export default Result;