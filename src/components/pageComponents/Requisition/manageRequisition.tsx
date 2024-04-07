import React, { useContext, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { usePurchaseRequest } from '../../../context/purchaseRequestContext';
import { PURCHASE_REQUESTS_BY_USER_ID } from '../../../graphql/rquest';
import { UserContext } from '../../../auth/UserContext';

import { Grid, createTheme, ThemeProvider, Button } from '@mui/material';
import MUIDataTable, { MUIDataTableOptions, Responsive } from 'mui-datatables';
import PageHeader from '../../PageHeader';
import { RequestPageOutlined } from '@mui/icons-material';
//import Button from '../../Button';
import { useNavigate } from 'react-router-dom';

export interface PurchaseRequestData {
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

const RequisitionComponent: React.FC = () => {
  const { currentUser } = useContext(UserContext);
  const userId = currentUser?.id || '';
  const { purchaseRequests, setPurchaseRequests } = usePurchaseRequest();
  const navigate = useNavigate();
  const { loading, error, data } = useQuery<PurchaseRequestData>(PURCHASE_REQUESTS_BY_USER_ID, {
    variables: { userId: Number(userId) },
  });

  useEffect(() => {
    if (!loading && !error && data) {
      console.log('Fetched data:', data);
      setPurchaseRequests(data?.purchaseRequestByUserId || []);
    }
  }, [loading, error, data, setPurchaseRequests]);

  console.log('Purchase requests:', purchaseRequests);
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
onClick={() => handleClick(purchaseRequestId)}
style={{ cursor: 'pointer', color:"#00b0ad"}}
>
View Details
</Button>
          );
        },
      },
    },
  ];

  const tableData = purchaseRequests
  .filter((purchaseRequest) => purchaseRequest.status === 'sent')
  .map((purchaseRequest, index) => [
    index + 1,
    purchaseRequest.id,
    purchaseRequest.referenceNumber,
    (
      <span style={{ color: 'green' }}>{"sent"}</span>
    ),
    //purchaseRequest?.suppliers?.map((supplier:any) => supplier.user.first).join(', '),
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
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : purchaseRequests && purchaseRequests.length > 0 ? (
    <Grid container spacing={3}>
      <Grid item xs={12}>
          <PageHeader title="Tis is your Requests" icon={<RequestPageOutlined />} imageSrc = "salesForce.png" />
      </Grid>
      <Grid item xs={12}>
        <ThemeProvider theme={theme}>
          <MUIDataTable title="Requests" data={tableData} columns={columns} options={options} />
        </ThemeProvider>
      </Grid>
    </Grid>
      ) : (
        <p>No purchase requests found.</p>
      )}
      
    </div>
  );
};

export default RequisitionComponent;