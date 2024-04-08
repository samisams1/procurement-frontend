import React from 'react';
import { useQuery, gql } from '@apollo/client';
import MUIDataTable, { MUIDataTableOptions } from 'mui-datatables';
import { Button, Grid, ThemeProvider, Typography, } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { tableTheme } from '../Table/table';
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
  const { loading, error, data: { getAllProductPrices = [] } = {} } = useQuery<GetAllProductPricesResponse>(GET_ALL_PRODUCT_PRICES, {
    variables: { id: userId },
  });
  const navigate = useNavigate();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const uniquePurchaseRequestIds = Array.from(new Set(getAllProductPrices.map((productPrice) => productPrice.quotation.purchaseRequestId)));

  const handleClick = (productId: number, customerId: number, supplierId: number) => {
    navigate('/manageRfq', { state: { productId, customerId, supplierId } });
  };

  if (uniquePurchaseRequestIds.length === 0) {
    return (
      <Grid container justifyContent="center" alignItems="center">
        <Typography variant="h6">Sorry, no matching records found</Typography>
      </Grid>
    );
  }
  const tableOptions: MUIDataTableOptions = {
    filter: true,
    download: true,
    print: false,
    search: true,
    selectableRows: 'none',
    responsive: 'standard',
    viewColumns: true,
    rowsPerPage: 10,
    rowsPerPageOptions: [10, 25, 50],
  };

  const tableData = uniquePurchaseRequestIds.map((purchaseRequestId, index) => {
    const productPrice = getAllProductPrices.find(
      (productPrice) => productPrice.quotation.purchaseRequestId === purchaseRequestId
    );
    if (!productPrice) {
      return [];
    }
    return [
      index + 1,
      productPrice.id,
      'Electronics',
      <>
      <p>{productPrice.createdAt ? new Date(productPrice.createdAt).toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }) : ''}</p>
    </>,
      <span style={{ color: 'red' }}>{productPrice.status}</span>,
      <Button
        type="submit"
        variant="outlined"
        color="primary"
        style={{ whiteSpace: 'nowrap' }}
        onClick={() =>
          handleClick(productPrice.quotation.id, productPrice.quotation.customerId, productPrice.quotation.supplierId)
        }
      >
        Detail
      </Button>,
    ];
  });

  const tableColumns = [
    'S.N',
    'Request ID',
    'Category',
    'RFQ Date',
    'Status',
    'Action',
  ];

  return (
    <ThemeProvider theme={tableTheme}>
      <MUIDataTable title="" data={tableData} columns={tableColumns} options={tableOptions} />
    </ThemeProvider>
  );
};

export default RfqComponent;