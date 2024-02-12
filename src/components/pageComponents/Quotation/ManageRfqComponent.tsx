import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { ThemeProvider, useTheme } from '@mui/material/styles';
//import useMediaQuery from '@mui/material/useMediaQuery';
//import { List, ListItem, ListItemText, Typography } from '@mui/material';
//import { useNavigate } from 'react-router-dom';
import QuotationDetail from './Detail';

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
  status: string;
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
        codedata
        manufacture
        model
        partNumber
        quantity
        title
        uom
      }
      quotation {Typography
        shippingPrice
        status
      }
    }
  }
`;

const ManageRfqComponent: React.FC = () => {
  const { loading, error } = useQuery<GetAllProductPricesResponse>(GET_ALL_PRODUCT_PRICES);
  const theme = useTheme();
  //const navigate = useNavigate();

  //const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  /*const handleProductClick = (productId: string) => {
    // Handle the click event, e.g., show the details of the product
    console.log(`Clicked on product with ID: ${productId}`);
  };*/
  /*const handleClick = (productId: string) => {
    navigate(`/manageRfq/${productId}`);
  };*/

  return (
    <ThemeProvider theme={theme}>
      <QuotationDetail/>
    </ThemeProvider>
  );
};
export default ManageRfqComponent;