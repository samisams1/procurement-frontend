import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Grid, Paper } from '@mui/material';
import Button from '../../Button';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../PageHeader';
import { RequestPageTwoTone } from '@mui/icons-material';

// Define your GraphQL query
const GET_QUOTES = gql`
  query GetQuotes {
    purchaseRequests {
      id
      referenceNumber
      status
      createdAt
      products {
        title
        partNumber
        quantity
        partNumber
      }
      user {
        username
      }
      suppliers {
        user {
          username
        }
      }
    }
  }
`;

const ManageRequisitionComponent: React.FC = () => {
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(GET_QUOTES);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // Access the data returned by the query
  const purchaseRequests = data.purchaseRequests;
console.log(data)
  // Render your component using the data
  const handleClick = (id: string) => {
    navigate(`/purchaseRequest/${id}`);
  };
  return (
    <Grid container spacing={2}>
    <Grid item xs={12}>
      <Paper elevation={3} sx={{ padding: '20px' }}>
      <PageHeader
              title="M"
              subTitle="mange requests"
              icon={<RequestPageTwoTone fontSize="large" />}
          /> 
    <TableContainer>
      <Table className="blue-bordered-table">
        <TableHead>
        <TableRow className="blue-row">
            <TableCell>SN</TableCell>
            <TableCell>ID</TableCell>
            <TableCell>Reference Number</TableCell>
            <TableCell>User</TableCell>
            <TableCell>Suppliers</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Action</TableCell>
           
          </TableRow>
        </TableHead>
        <TableBody>
          {purchaseRequests.map((purchaseRequest: any,index: number) => (
             <TableRow key={purchaseRequest.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{purchaseRequest.id}</TableCell>
              <TableCell>{purchaseRequest.referenceNumber}</TableCell>
              <TableCell>{purchaseRequest.user.username}</TableCell>
              <TableCell>
                {purchaseRequest.suppliers.map((supplier: any) => supplier.user.username).join(', ')}
              </TableCell>
              <TableCell><span style={{color:"red"}}>{purchaseRequest.status}</span></TableCell>
              <TableCell>{purchaseRequest.createdAt}</TableCell>
              <TableCell><Button text="View Detals"   onClick={() => handleClick(purchaseRequest.id)}  style={{ cursor: 'pointer' }}/></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </Paper></Grid>
    <style>{`
      .blue-bordered-table {
        border: 2px solid  #1c9fef;
      }
      
      .blue-row {
        background-color: #1c9fef;
        color: white;
      }
      `}</style>
    </Grid>
  );
};

export default ManageRequisitionComponent;