import React from 'react';
import { useQuery } from '@apollo/client';
import { Grid, createTheme, ThemeProvider } from '@mui/material';
import MUIDataTable, { MUIDataTableOptions, Responsive } from 'mui-datatables';
import PageHeader from '../../PageHeader';
import {RequestPageOutlined } from '@mui/icons-material';
import Button from '../../Button';
import { useNavigate } from 'react-router-dom';
import { SectionTitle } from '../../Section';
import { GET_QUOTES } from '../../../graphql/rquest';
// Define your GraphQL query
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
  // Render your component using the data
  const handleClick = (id: string) => {
    navigate(`/purchaseRequest/${id}`);
  };
  const columns = [
    { name: 'SN', options: { filter: false, sort: false } },
    'ID',
    'Reference Number',
    'User',
    'Suppliers',
    'Status',
    'Date',
    {
      name: 'Action',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value: any, tableMeta: any) => {
          const purchaseRequestId = tableMeta.rowData[1];
          return (
            <Button
              text="View Details"
              onClick={() => handleClick(purchaseRequestId)}
              style={{ cursor: 'pointer' }}
            />
          );
        },
      },
    },
  ];

  const tableData = purchaseRequests.map((purchaseRequest: any, index: number) => [
    index + 1,
    purchaseRequest.id,
    purchaseRequest.referenceNumber,
    purchaseRequest.user.username,
    purchaseRequest.suppliers.map((supplier: any) => supplier.user.username).join(', '),
    purchaseRequest.status ==="pending" ?
    <span style={{ color: 'red' }}>{purchaseRequest.status}</span>:
    <span style={{ color: 'green' }}>{purchaseRequest.status}</span>,
    purchaseRequest.createdAt,
    '',
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

export default ManageRequisitionComponent;