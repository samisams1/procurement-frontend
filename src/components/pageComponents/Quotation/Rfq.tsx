import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { Grid, Paper, Typography } from '@mui/material';
import MUIDataTable, { MUIDataTableColumn } from 'mui-datatables';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../PageHeader';
import { PeopleTwoTone } from '@mui/icons-material';

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
        customBodyRenderLite: (dataIndex) => {
          return (
            <div onClick={() => handleClick(quotations[dataIndex].purchaseRequestId)} style={{ cursor: 'pointer' }}>
             <Typography  component="div" style={{ color: 'blue', }}>Manage Rfq</Typography>
            </div>
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
 const options = {
    selectableRows: 'none' as const,
    download: false,
    print: false,
    search: false,
    pagination: false,
    viewColumns: false,
  };
  return (
    <Grid container spacing={2}>
    <Grid item xs={12}>
      <Paper elevation={3} sx={{ padding: '20px' }}>
      <PageHeader
       title=" The Request for Quotation (RFQ)"
       subTitle="The Request for Quotation (RFQ) "
       icon={<PeopleTwoTone fontSize="large" />}
      />
      <MUIDataTable title="" data={tableData} columns={columns} options={options} />
  </Paper>
  </Grid>
  </Grid>
  );
};

export default RfqComponent;