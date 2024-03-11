import React, { useContext } from 'react';
import { useQuery } from '@apollo/client';
import { Grid, createTheme, ThemeProvider } from '@mui/material';
import MUIDataTable, { MUIDataTableOptions, Responsive } from 'mui-datatables';
import PageHeader from '../../PageHeader';
import { RequestPageOutlined } from '@mui/icons-material';
import Button from '../../Button';
import { useNavigate } from 'react-router-dom';
import { SectionTitle } from '../../Section';
import {  SAVED_REQUESTS_BY_USER_ID } from '../../../graphql/rquest';
import Spinner from '../../Spinner';
import { UserContext } from '../../../auth/UserContext';

interface PurchaseRequest {
  id: string;
  userId: number;
  status: string;
  remark: string;
  addressDetail: string;
  estimatedDelivery: string;
  referenceNumber: string;
  createdAt: string;
  categoryId:number,
  sourceType :string
  products: {
    id:number
    quantity:number
    title:string
  },
  user: {
    username: string;
  };
  suppliers: {
    user: {
      username: string;
    };
  }[];
}

interface PurchaseRequestData {
  savedRequestByUserId: PurchaseRequest[];
}

const AllDrafts: React.FC = () => {
  const { currentUser } = useContext(UserContext);

  if (!currentUser) {
    return <Spinner />;
  }

  return <PurchaseRequisitions userId={currentUser.id} />;
};

const PurchaseRequisitions: React.FC<{ userId: number }> = ({ userId }) => {
  const { loading, error, data } = useQuery<PurchaseRequestData>(SAVED_REQUESTS_BY_USER_ID, {
    variables: { userId: Number(userId) },
  });

  const navigate = useNavigate();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const purchaseRequests = data?.savedRequestByUserId || [];
  const handleClick = (purchaseRequest: PurchaseRequest) => {
    const { id, estimatedDelivery, remark, addressDetail, categoryId,products } = purchaseRequest;
    const sourceType = "supplier"
    console.log("krish")
    console.log(products)
    navigate('/newRequest', { state: { id, estimatedDelivery, remark, addressDetail, categoryId, sourceType,products } });
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
          const purchaseRequest = purchaseRequests[tableMeta.rowIndex];
          return (
            <Button
              text="Revise and Send"
              onClick={() => handleClick(purchaseRequest)}
              style={{ cursor: 'pointer' }}
            />
          );
        },
      },
    },
  ];

 /* const tableData = purchaseRequests?.map((purchaseRequest, index) => [
    index + 1,
    purchaseRequest.id,
    purchaseRequest.referenceNumber,
    purchaseRequest?.user?.username,
    purchaseRequest?.suppliers?.map((supplier) => supplier.user.username).join(', '),
    purchaseRequest?.status === 'pending' ? (
      <span style={{ color: 'red' }}>{purchaseRequest.status}</span>
    ) : (
      <span style={{ color: 'green' }}>{purchaseRequest.status}</span>
    ),
    new Date(purchaseRequest.createdAt).toLocaleString(),
    '',
  ]);*/
  const tableData = purchaseRequests
  .filter((purchaseRequest) => purchaseRequest.status === 'seved')
  .map((purchaseRequest, index) => [
    index + 1,
    purchaseRequest.id,
    purchaseRequest.referenceNumber,
    (
      <span style={{ color: 'green' }}>{purchaseRequest.status}</span>
    ),
    purchaseRequest?.suppliers?.map((supplier:any) => supplier.user.first).join(', '),
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
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <SectionTitle variant="outlined" square>
          <PageHeader
            title="Saved Request"
            icon={<RequestPageOutlined />}
            subTitle="this page is your saved Request You can re Send as you need"
          />
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

export default AllDrafts;