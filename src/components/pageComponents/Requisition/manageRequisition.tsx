/*import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { Grid, createTheme, ThemeProvider } from '@mui/material';
import MUIDataTable, { MUIDataTableOptions, Responsive } from 'mui-datatables';
import PageHeader from '../../PageHeader';
import { Edit, RequestPageOutlined } from '@mui/icons-material';
import Button from '../../Button';
import { useNavigate } from 'react-router-dom';
import { SectionTitle } from '../../Section';
import { GET_QUOTES } from '../../../graphql/rquest';

const ManageRequisitionComponent: React.FC = () => {
  const navigate = useNavigate();
  const { loading, error, data, refetch } = useQuery(GET_QUOTES);

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 10000); // Refetch data every 10 seconds

    return () => {
      clearInterval(interval);
    };
  }, [refetch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const { purchaseRequests } = data;

  const handleClick = (id: string) => {
    navigate(`/purchaseRequest/${id}`);
  };

  const columns = [
    { name: 'SN', options: { filter: false, sort: false } },
    'ID',
    'Reference Number',
    'User',
    'Purchase type',
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
              variant="outlined"
              startIcon={<Edit />}
              onClick={() => handleClick(purchaseRequestId)}
              style={{ whiteSpace: 'nowrap', color: '#00b0ad' }}
              text="  View Item"
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
    'sams',
    'Costruction',
    purchaseRequest.status === 'pending' ? (
      <span style={{ color: 'red' }}>{purchaseRequest.status}</span>
    ) : (
      <span style={{ color: 'green' }}>{purchaseRequest.status}</span>
    ),
    purchaseRequest.createdAt,
  ]);

  const options: MUIDataTableOptions = {
    filter: true,
    download: true,
    print: true,
    search: true,
    selectableRows: 'none',
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
            backgroundColor: '#00b0ad',
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

export default ManageRequisitionComponent; */
import React from 'react';
import { useQuery } from '@apollo/client';
import { Grid, createTheme, ThemeProvider } from '@mui/material';
import MUIDataTable, { MUIDataTableOptions, Responsive } from 'mui-datatables';
import PageHeader from '../../PageHeader';
import { RequestPageOutlined } from '@mui/icons-material';
import Button from '../../Button';
import { useNavigate } from 'react-router-dom';
import { SectionTitle } from '../../Section';
import { PURCHASE_REQUESTS_BY_USER_ID } from '../../../graphql/rquest';

interface PurchaseRequestData {
  purchaseRequestByUserId: {
    id: string;
    userId: number;
    status: string;
    remark: string;
    addressDetail: string;
    estimatedDelivery: string;
    referenceNumber: string;
    createdAt: string;
    user: {
      username: string;
    };
    suppliers: {
      user: {
        username: string;
      };
    }[];
  }[];
}

const ManageRequisitionComponent: React.FC = () => {
  const { loading, error, data } = useQuery<PurchaseRequestData>(PURCHASE_REQUESTS_BY_USER_ID, {
    variables: { userId:1 },
  });

  const navigate = useNavigate();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const purchaseRequests = data?.purchaseRequestByUserId || [];

  const handleClick = (id: string) => {
    navigate(`/purchaseRequest/${id}`);
  };

  const columns = [
    { name: 'SN', options: { filter: false, sort: false } },
    'ID',
    'Reference Number',
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

  const tableData = purchaseRequests.map((purchaseRequest, index) => [
    index + 1,
    purchaseRequest.id,
    purchaseRequest.referenceNumber,
    /*purchaseRequest.suppliers.map((supplier) => supplier.user.username).join(', '), */
    purchaseRequest.status === 'pending' ? (
      <span style={{ color: 'red' }}>{purchaseRequest.status}</span>
    ) : (
      <span style={{ color: 'green' }}>{purchaseRequest.status}</span>
    ), 
    new Date(purchaseRequest.createdAt).toLocaleString(),
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
            backgroundColor: 'red',
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
          <MUIDataTable title="Requests" data={tableData} columns={columns} options={options} />
        </ThemeProvider>
      </Grid>
    </Grid>
  );
};

export default ManageRequisitionComponent;