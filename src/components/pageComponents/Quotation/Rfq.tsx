import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import { Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface RfqComponentProps {
  userId: number;
}

interface Product {
  id: string;
  Description: string;
  code: string;
  manufacture: string;
  model: string;
  partNumber: string;
  quantity: number;
  title: string;
  uom: string;
}

interface Quotation {
  id: number;
  shippingPrice: number;
  purchaseRequestId: string;
  status: string;
  customerId: number;
  supplierId: number;
}

interface ProductPrice {
  id: string;
  productId: string;
  price: number;
  quotationId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  product: Product;
  quotation: Quotation;
}

interface GetAllProductPricesResponse {
  getAllProductPrices: ProductPrice[];
}

const GET_ALL_PRODUCT_PRICES = gql`
  query GetAllProductPrices($id: Int!) {
    getAllProductPrices(id: $id) {
      id
      productId
      price
      quotationId
      status
      createdAt
      updatedAt
      product {
        id
        Description
        code
        model
        partNumber
        quantity
        title
        uom
      }
      quotation {
        id
        shippingPrice
        status
        purchaseRequestId
        supplierId
        customerId
      }
    }
  }
`;

const RfqComponent: React.FC<RfqComponentProps> = ({ userId }) => {
  const { loading, error, data } = useQuery<GetAllProductPricesResponse>(GET_ALL_PRODUCT_PRICES, {
    variables: { id: userId },
  });
  const theme = useTheme();
  const navigate = useNavigate();
  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const uniquePurchaseRequestIds = Array.from(
    new Set(data?.getAllProductPrices.map((productPrice) => productPrice.quotation.purchaseRequestId))
  );

  const handleClick = (productId: string, customerId: number, supplierId: number) => {
    navigate('/manageRfq', { state: { productId, customerId, supplierId } });
  };

  if (uniquePurchaseRequestIds.length === 0) {
    return (
      <Grid container justifyContent="center" alignItems="center">
        <Typography variant="h6">
          <Typography>Sorry, no matching records found</Typography>
        </Typography>
      </Grid>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>S.N</TableCell>
              <TableCell>Request ID</TableCell>
              <TableCell>No. of Suppliers</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>RFQ Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {uniquePurchaseRequestIds.map((purchaseRequestId, index) => {
              const productPrice = data?.getAllProductPrices.find(
                (productPrice) => productPrice.quotation.purchaseRequestId === purchaseRequestId
              );

              if (!productPrice) {
                return null;
              }

              return (
                <TableRow
                  key={productPrice.id}
                  hover
                  onClick={() =>
                    handleClick(
                      productPrice.quotation.purchaseRequestId,
                      productPrice.quotation.customerId,
                      productPrice.quotation.supplierId
                    )
                  }
                  style={{ cursor: 'pointer' }}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{productPrice.id}</TableCell>
                  <TableCell>{"9"}</TableCell>
                  <TableCell>{"Electronics"}</TableCell>
                  <TableCell>{productPrice.createdAt}</TableCell>
                  <TableCell>
                    <span style={{ color: 'red' }}>{productPrice.status}</span>
                  </TableCell>
                  <TableCell>
                   
                    <Button
                      type="submit"
                      variant="outlined"
                      color="primary"
                      style={{ whiteSpace: 'nowrap' }}
                    onClick={() => handleClick(productPrice.productId, productPrice.quotation.customerId, productPrice.quotation.supplierId)}
                    >
                      Detail
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </ThemeProvider>
  );
};

export default RfqComponent;