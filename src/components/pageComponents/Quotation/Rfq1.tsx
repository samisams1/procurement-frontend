import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { Grid, createTheme, ThemeProvider } from '@mui/material';
import MUIDataTable, { MUIDataTableOptions,MUIDataTableColumn, Responsive } from 'mui-datatables';

import PageHeader from '../../PageHeader';
import {RequestPageOutlined } from '@mui/icons-material';
import Button from '../../Button';
import { useNavigate } from 'react-router-dom';
import { SectionTitle } from '../../Section';
const GET_QUOTATIONS = gql`
  query {
    quotations {
      id
      supplierId
      customerId
      status
      purchaseRequestId
      shippingPrice
      productPrices {
        price
        product {
          title
        }
      }
    }
  }
`;

interface Quotation {
  id: string;
  supplierId: string;
  customerId: string;
  shippingPrice: number;
  status:string;
  purchaseRequestId:string;
  productPrices: {
    price: number;
    product: {
      title: string;
    };
  }[];
}
// Define your GraphQL query
const RfqComponent: React.FC = () => {
  const navigate = useNavigate();
  const { loading, error, data } = useQuery<{ quotations: Quotation[] }>(GET_QUOTATIONS);
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  const { quotations } = data!;
  const handleClick = (id: string) => {
    navigate(`/manageRfq/${id}`);
  };

  const calculateSubtotal = (quotation: Quotation) => {
    let subtotal = 0;
    quotation.productPrices.forEach((product) => {
      subtotal += product.price;
    });
    return subtotal;
  };
  const calculateTotal = (quotation: Quotation) => {
    const subtotal = calculateSubtotal(quotation);
    const vat = subtotal * 0.2; // Assuming 20% VAT
    const total = subtotal + vat + quotation.shippingPrice;
    return total;
  };

  const columns: MUIDataTableColumn[] = [
    {
      name: 'SN',
      options: {
        customBodyRenderLite: (dataIndex) => {
          return (
            <div>
              {dataIndex + 1}
            </div>
          );
        },
      },
    },
    {
      name: 'Request Id',
      options: {
        customBodyRenderLite: (dataIndex) => {
          return quotations[dataIndex].purchaseRequestId;
        },
      },
    },
    {
      name: 'Customer ID',
      options: {
        customBodyRenderLite: (dataIndex) => {
          return quotations[dataIndex].customerId;
        },
      },
    },
    {
      name: 'Status',
      options: {
        customBodyRenderLite: (dataIndex) => {
          return quotations[dataIndex].status;
        },
      },
    },
    {
      name: 'Action',
      options: {
        filter: false,
        sort: false,
        customBodyRenderLite: (dataIndex) => {
          return (
            <Button
              text="View Details"
              onClick={() => handleClick(quotations[dataIndex].purchaseRequestId)}
              style={{ cursor: 'pointer' }}
            />
          );
        },
      },
    },
  ];

  const tableData = quotations.map((quotation) => [
    quotation.id,
    quotation.supplierId,
    quotation.customerId,
    quotation.shippingPrice,
    calculateSubtotal(quotation),
    calculateSubtotal(quotation) * 0.2,
    calculateTotal(quotation),
    quotation.id,
  ]);

  const options: MUIDataTableOptions = {
    filter: true,
    download: true,
    print: true,
    search: true,
    selectableRows: 'none', // or 'single' for single row selection
    responsive: 'standard' as Responsive,
    viewColumns: true,
    rowsPerPage: 10,
    rowsPerPageOptions: [10, 25, 50],
  };

  const theme = createTheme({
    components: {
      MUIDataTableHeadCell: {
        styleOverrides: {
          root: {
            backgroundColor: '#1976d2',
            color: 'white',
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            paddingTop: 0,
            paddingBottom: 0,
          },
        },
      },
    },
  });

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <SectionTitle variant="outlined" square>
          <PageHeader title="Request" icon={<RequestPageOutlined />} />
        </SectionTitle>
      </Grid>
      <Grid item xs={12}>
        <ThemeProvider theme={theme}>
          <MUIDataTable
            title="Requests"
            data={tableData}
            columns={columns}
            options={options}
          />
        </ThemeProvider>
      </Grid>
    </Grid>
  );
};

export default RfqComponent;