import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { List, ListItem, ListItemText, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

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
  shippingPrice: number;
  purchaseRequestId:string;
  status: string;
  customerId:number;
  supplierId:number;
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
  query GetAllProductPrices {
    getAllProductPrices {
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
        shippingPrice
        status
        purchaseRequestId
        supplierId
        customerId
      }
    }
  }
`;

const RfqComponent: React.FC = () => {
  const { loading, error, data } = useQuery<GetAllProductPricesResponse>(GET_ALL_PRODUCT_PRICES);
  const theme = useTheme();
  const navigate = useNavigate();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }
  const handleClick = (productId: string,customerId:number,supplierId:number) => {
  navigate('/manageRfq', { state: { productId,customerId,supplierId} });
  };
  return (
    <ThemeProvider theme={theme}>
      <List>
        {data?.getAllProductPrices.map((productPrice) => (
          <ListItem
            key={productPrice.id}
            alignItems="flex-start"
            disableGutters={!isMobile}
            divider
            onClick={() => handleClick(productPrice.quotation.purchaseRequestId,productPrice.quotation.customerId,productPrice.quotation.supplierId)}
            style={{ cursor: 'pointer' }}
          >
            <ListItemText
              primary={
                <Typography variant="h6" color="primary">
                  Request ID: {productPrice.id}
                </Typography>
              }
              secondary={
                <>
                  <Typography variant="body2" color="textSecondary">
                    Created At: {productPrice.createdAt}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                  Status  <span style={{ color: 'red' }}>: {productPrice.status}</span>
                  </Typography>
                </>
              }
            />
            <div>
              <Typography variant="h6" color="primary">
                Products:
              </Typography>
              {productPrice.quotation && (
                <Typography variant="body2">
                  - Shipping Price: {productPrice.quotation.shippingPrice}
                </Typography>
              )}
            </div>
          </ListItem>
        ))}
      </List>
    </ThemeProvider>
  );
};

export default RfqComponent;