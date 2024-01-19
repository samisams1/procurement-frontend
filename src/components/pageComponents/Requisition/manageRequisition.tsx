import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Grid } from '@mui/material';
import Button from '../../Button';
import { useNavigate } from 'react-router-dom';

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
    <Grid> 
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
            <TableCell>Products</TableCell>
           
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
              <TableCell>
                <Table className="blue-bordered-table">
                  <TableHead>
                    <TableRow className="blue-row">
                      <TableCell>SN</TableCell>
                      <TableCell>Item Name</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Part Number</TableCell>
                      <TableCell>Item Name</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Quantity</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {purchaseRequest.products.map((product: any,index:number) => (
                        <TableRow key={product.title}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{product.title}</TableCell>
                        <TableCell>{product.quantity}</TableCell>
                        <TableCell>{product.partNumber}</TableCell>
                        <TableCell>{product.title}</TableCell>
                        <TableCell>{product.quantity}</TableCell>
                        <TableCell>{product.quantity}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
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