import React, { useContext } from 'react';
import { useQuery } from '@apollo/client';
import { Grid, Paper, Typography, styled } from '@mui/material';
import { gql } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { UserContext } from '../../../auth/UserContext';
import Spinner from '../../Spinner';
import PageHeader from '../../PageHeader';
import MUIDataTable, { MUIDataTableColumnDef } from 'mui-datatables';

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

  const columns: MUIDataTableColumnDef[] = [
    {
      name: 'id',
      label: 'Requested Detail',
    },
    {
      name: 'title',
      label: 'Title',
    },
    {
      name: 'quantity',
      label: 'Quantity',
    },
  ];

  const tableData = orderDetail?.products.map((product) => ({
    id: product.id,
    title: product.title,
    quantity: product.quantity,
  }));

  return (
    <div>
      <PageHeader title="Purchase Request" subTitle="Purchase Request" />
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

      <MUIDataTable
        title="Product Table"
        data={tableData || []}
        columns={columns}
        options={{
          selectableRows: 'none',
          print: false,
          download: false,
          viewColumns: false,
          search: false,
        }}
      />
      <button onClick={handlePrint}>Print</button>
    </div>
  );
}

export default Detail;