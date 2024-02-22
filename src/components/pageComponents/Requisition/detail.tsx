import React, { useContext } from 'react';
import { useQuery } from '@apollo/client';
import { Grid,createTheme, Paper,ThemeProvider,Typography, styled } from '@mui/material';
import { gql } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { UserContext } from '../../../auth/UserContext';
import Spinner from '../../Spinner';
import PageHeader from '../../PageHeader';
import MUIDataTable, {MUIDataTableOptions, Responsive } from 'mui-datatables';
import { SectionTitle } from '../../Section';
import { RequestPageOutlined } from '@mui/icons-material';
const GET_PURCHASE_REQUEST_BY_ID = gql`
  query PurchaseRequestById($id: Int!) {
    purchaseRequestById(id: $id) {
      id
      userId
      status
      remark
      addressDetail
      estimatedDelivery
      referenceNumber
      createdAt
      products {
        id
        Description
        code
        manufacture
        model
        partNumber
        quantity
        title
        uom
      }
    }
  }
`;

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

interface PurchaseRequest {
  id: string;
  userId: string;
  status: string;
  remark: string;
  addressDetail: string;
  estimatedDelivery: string;
  referenceNumber: string;
  createdAt: string;
  products: Product[];
}

interface OrderDetailData {
  purchaseRequestById: PurchaseRequest[];
}

interface OrderDetailVariables {
  id: number;
}

const MobileGrid = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
}));

function Detail() {
  const { id } = useParams<{ id?: string }>();
  const { loading, error, data } = useQuery<OrderDetailData, OrderDetailVariables>(GET_PURCHASE_REQUEST_BY_ID, {
    variables: { id: Number(id) },
  });
  const { currentUser } = useContext(UserContext);

  if (!currentUser || loading) {
    return <Spinner />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  const orderDetail = data?.purchaseRequestById[0]; // Assuming there's only one order detail for a given order ID
  const handlePrint = () => {
    window.print();
  };

  const columns = [
    {
      name: 'id',
      label: 'Requested Detail',
    },
    {
      name: 'title',
      label: 'Title',
    },
    {
      name: 'uom',
      label: 'uom',
    },
    {
      name: 'partNumber',
      label: 'partNumber',
    },
    {
      name: 'model',
      label: 'model',
    },
    {
      name: 'manufacture',
      label: 'manufacture',
    },
    {
      name: 'code',
      label: 'code',
    },
    {
      name: 'Description',
      label: 'Description',
    },
    {
      name: 'quantity',
      label: 'Quantity',
    }
  ];

  const tableData = orderDetail?.products.map((product) => ({
    id: product.id,
    title: product.title,
    quantity: product.quantity,
    code: product.code,
    manufacture: product.manufacture,
    partNumber: product.partNumber,
    model: product.model,
    uom: product.uom,
  }));

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
    <Grid container spacing={2}>
    <Grid item xs={12}>
     
      <SectionTitle variant="outlined" square>
          <PageHeader title="Purchase Request" subTitle="Purchase Request" icon={<RequestPageOutlined />} />
       </SectionTitle>
      <MobileGrid container spacing={2}>
        {/* Order By */}
        <Grid item xs={12} sm={4}>
          <Paper>
            <Typography variant="h6">Requested By</Typography>
            <Typography variant="body1">Customer Name: {orderDetail?.userId}</Typography>
            <Typography variant="body1">Reference Number: {orderDetail?.referenceNumber}</Typography>
            <Typography variant="body1">Created At: {orderDetail?.createdAt}</Typography>
          </Paper>
        </Grid>

        {/* Order To */}
        <Grid item xs={12} sm={4}>
          <Paper>
            <Typography variant="h6">Requested To</Typography>
            <Typography variant="body1">Supplier Name: {orderDetail?.addressDetail}</Typography>
          </Paper>
        </Grid>

        {/* More */}
        <Grid item xs={12} sm={4}>
          <Paper>
            <Typography variant="h6">More</Typography>
            <Typography variant="body1">Status: {orderDetail?.status}</Typography>
          </Paper>
        </Grid>
      </MobileGrid>
      <ThemeProvider theme={theme}>
      <MUIDataTable
        title="Created Products"
        data={tableData || []}
        columns={columns}
        options={options}
      />
        </ThemeProvider>
      <button onClick={handlePrint}>Print</button>
    
    </Grid>
    </Grid>
  );
}

export default Detail;