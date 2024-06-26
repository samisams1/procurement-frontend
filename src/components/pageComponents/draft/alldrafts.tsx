import React, { useContext, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { usePurchaseRequest } from '../../../context/purchaseRequestContext';
import { PURCHASE_REQUESTS_BY_USER_ID } from '../../../graphql/rquest';
import { UserContext } from '../../../auth/UserContext';
import { Grid, createTheme, ThemeProvider, Button } from '@mui/material';
import MUIDataTable, { MUIDataTableOptions, Responsive } from 'mui-datatables';
import PageHeader from '../../PageHeader';
import { RequestPageOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
interface PurchaseRequest {
  id: string;
  userId: number;
  status: string;
  remark: string;
  addressDetail: string;
  requestedBy:string;
  approvedBy:string;
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

const AllDrafts: React.FC = () => {
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
  const handleClick = (purchaseRequest: PurchaseRequest) => {
    const { id, estimatedDelivery, remark, addressDetail,requestedBy,approvedBy, categoryId,products } = purchaseRequest;
    const sourceType = "supplier"
    console.log("krish")
    console.log(products)
    navigate('/newRequest', { state: { id, estimatedDelivery, remark, addressDetail,requestedBy,approvedBy, categoryId, sourceType,products } });
  };
  console.log('Purchase requests:', purchaseRequests);
  const columns = [
    { name: 'SN', options: { filter: false, sort: false } },
    'ID',
    'Reference Number',
    'Status',
    'Date',
    /*{
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
    },*/
    {
      name: 'Action',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value: any, tableMeta: any) => {
          const purchaseRequest = purchaseRequests[tableMeta.rowIndex];
          return (
           <Button
           onClick={() => handleClick(purchaseRequest)}
           >
            View Details
           </Button>
          );
        },
      },
    },
  ];

  const tableData = purchaseRequests
  .filter((purchaseRequest) => purchaseRequest.status === 'saved')
  .map((purchaseRequest, index) => [
    index + 1,
    purchaseRequest.id,
    purchaseRequest.referenceNumber,
    (
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
          <PageHeader title="Draft Requests" icon={<RequestPageOutlined />} imageSrc = "salesForce.png" />
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

export default AllDrafts;