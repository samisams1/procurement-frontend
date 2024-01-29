import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { Grid, createTheme, ThemeProvider, Typography } from '@mui/material';
import MUIDataTable, { MUIDataTableOptions,MUIDataTableColumn, Responsive } from 'mui-datatables';
import { useNavigate } from 'react-router-dom';
import { RequestPageOutlined } from '@mui/icons-material';
import { SectionTitle } from '../../Section';
import PageHeader from '../../PageHeader';
import Button from '../../Button';


interface Payment {
    id: number;
    paidAt: string;
    status: string;
    referenceNumber: string;
    paymentMethod: string;
  }
  const GET_PAYMENTS = gql`
  query GetPayments {
    payments {
      id
      paidAt
      status
      referenceNumber
      paymentMethod
    }
  }
`;

// Define your GraphQL query
const InvoiceAdmin: React.FC = () => {
    const { loading, error, data } = useQuery<{ payments: Payment[] }>(GET_PAYMENTS);
    const navigate = useNavigate();
    const handleViewDetail = (id: number) => {
        navigate(`/paymentConfirmation/${id}`)
      };
     if (loading) {
       return <div>Loading...</div>;
     }
   
     if (error) {
       return <div>Error: {error.message}</div>;
     }
  const { payments } = data!;
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
      name: 'Reference Number',
      options: {
        customBodyRenderLite: (dataIndex) => {
          return payments[dataIndex].referenceNumber;
        },
      },
    },
    {
        name: 'Payment Method',
        options: {
          customBodyRenderLite: (dataIndex) => {
            return payments[dataIndex].paymentMethod;
          },
        },
      },
    {
      name: 'Paid At',
      options: {
        customBodyRenderLite: (dataIndex) => {
          return payments[dataIndex].paidAt;
        },
      },
    },
    {
      name: 'Status',
      options: {
        customBodyRenderLite: (dataIndex) => {
          return payments[dataIndex].status;
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
             onClick={() => handleViewDetail(payments[dataIndex].id)}
              style={{ cursor: 'pointer' }}
            />
          );
        },
      },
    },
  ];

  const tableData = payments.map((payment) => [
  
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
          <PageHeader title="Invoice" icon={<RequestPageOutlined />} />
        </SectionTitle>
      </Grid>
      <Grid item xs={12}>
        <ThemeProvider theme={theme}>
          <MUIDataTable
            title="Invoice"
            data={tableData}
            columns={columns}
            options={options}
          />
        </ThemeProvider>
      </Grid>
    </Grid>
  );
};
export default InvoiceAdmin;