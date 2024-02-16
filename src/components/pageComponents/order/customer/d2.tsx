import React, { useContext } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid, Paper, Typography } from '@mui/material';
//import numberToWords from 'number-to-words';
import { gql } from '@apollo/client';
import PageHeader from '../../../PageHeader';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../../../../auth/UserContext';
import Spinner from '../../../Spinner';
import Button from '../../../Button';
//import { number } from 'prop-types';

const GET_ORDER_DETAIL_BY_ORDER_ID = gql`
  query GetOrderDetailByOrderId($id: Int!) {
    getOrderDetailByOrderId(id: $id) {
      id
      orderId
      title
      price
      quantity
      productId
      createdAt
      order {
        id
        customerId
        supplierId
        totalPrice
        tax
        shippingCost
        status
        createdAt
        updatedAt
        referenceNumber
        purchaseRequestId
        supplier {
          name
        }
        customer {
          username
        }
      }
      product {
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
const UPDATE_ORDER = gql`
mutation UpdateOrder($id: Int!, $input: String!) {
  updateOrder(id: $id, input: $input) {
    id
    status
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

interface OrderDetail {
  id: string;
  orderId: string;
  title: string;
  price: number;
  quantity: number;
  productId: string;
  createdAt: string;
  order: {
    id: string;
    customerId: string;
    supplierId: string;
    totalPrice: number;
    tax: number;
    shippingCost: number;
    status: string;
    createdAt: string;
    updatedAt: string;
    referenceNumber: string;
    purchaseRequestId: string;
    supplier: {
      name: string;
    };
    customer: {
      username: string;
    };
  };
  product: Product;
}



interface OrderDetailData {
  getOrderDetailByOrderId: OrderDetail;
}

interface OrderDetailVariables {
  id: number;
}

function ProductTable({ orderId }: { orderId: number }) {
  const navigate = useNavigate();
  //const [updateOrder] = useMutation(UPDATE_ORDER);
  //const [updateOrder, { loading: loadingOrder, error: errorOrder }] = useMutation(UPDATE_ORDER);

  const [updateOrder] = useMutation(UPDATE_ORDER);

  const { loading, error, data } = useQuery<OrderDetailData, OrderDetailVariables>(GET_ORDER_DETAIL_BY_ORDER_ID, {
    variables: { id: orderId },
  });

  const { currentUser } = useContext(UserContext);
  if (!currentUser) {
    return <Spinner />;
  }
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
 // const orderDetail = data?.getOrderDetailByOrderId[0]; // Assuming there's only one order detail for a given order ID
  const orderDetail = data?.getOrderDetailByOrderId;

  //const status = orderDetail?.order?.status[0];
  const shippingCost = 10;
  const subTotal = 110;
  const taxTotal = 5000;
  const grandTotal = subTotal + taxTotal + shippingCost;
    const handlePrint = () => {
      window.print();
    };
  
    const handlePayment = () => {
      navigate(`/payment/${1}`);
    };
    const handleUpdate = async (e: React.FormEvent) => {
      e.preventDefault();
  
      try {
        const { data } = await updateOrder({ variables: { id:orderId, input:"comformed" } });
        console.log('Order updated:', data.updateOrder);
      } catch (updateError) {
        console.error('Failed to update order:', updateError);
      }
    };

    
  return (
    <div>
      <PageHeader
      title="Purchas Order"
      subTitle ="pircase Order"
      />
    <Grid container spacing={2}>
      {/* Order By */}
      <Grid item xs={4}>
        <Paper>
          <Typography variant="h6">Order By</Typography>
          <Typography variant="body1">
          <p>Customer Name: {orderDetail?.order?.customer?.username}</p>
          </Typography>
          <Typography variant="body1">
            Reference Number: {orderDetail?.order?.referenceNumber}
          </Typography>
          <Typography variant="body1">
            Created At: {orderDetail?.order?.createdAt}
          </Typography>
        </Paper>
      </Grid>

      {/* Order To */}
      <Grid item xs={4}>
        <Paper>
          <Typography variant="h6">Order To</Typography>
          <Typography variant="body1">
            Supplier Name: {orderDetail?.order?.supplier.name}
          </Typography>
          <Typography variant="body1">
            Shipping Cost: {orderDetail?.order?.shippingCost}
          </Typography>
        </Paper>
      </Grid>

      {/* More */}
      <Grid item xs={4}>
        <Paper>
          <Typography variant="h6">More</Typography>
          <Typography variant="body1">
            Status: {orderDetail?.order?.status}
          </Typography>
        </Paper>
      </Grid>
    </Grid>
    <TableContainer component={Paper}>
      <Table  aria-label="Product Table">
        <TableHead>
          <TableRow>
            <TableCell>OrderDetail</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Code</TableCell>
            <TableCell>Manufacture</TableCell>
            <TableCell>Model</TableCell>
            <TableCell>Part Number</TableCell>
            <TableCell>UOM</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
      <TableRow key={orderDetail?.id}>
        <TableCell>{orderDetail?.orderId}</TableCell>
        <TableCell>{orderDetail?.title}</TableCell>
        <TableCell>{orderDetail?.price}</TableCell>
        <TableCell>{orderDetail?.quantity}</TableCell>
        <TableCell>{orderDetail?.product?.Description}</TableCell>
        <TableCell>{orderDetail?.product?.code}</TableCell>
        <TableCell>{orderDetail?.product?.manufacture}</TableCell>
        <TableCell>{orderDetail?.product?.model}</TableCell>
        <TableCell>{orderDetail?.product?.partNumber}</TableCell>
        <TableCell>{orderDetail?.product?.uom}</TableCell>
      </TableRow>
    </TableBody>
      </Table>
      <Typography>
        Shipping Cost <span className="float-right">{shippingCost.toLocaleString()} Birr</span>
      </Typography>
      <Typography>
        Sub Total inc.(Shipping) <span className="float-right">{subTotal.toLocaleString()} Birr</span>
      </Typography>
      <Typography>
        Taxable Amount <span className="float-right">{taxTotal.toLocaleString()} Birr</span>
      </Typography>
      <Typography>
        Grand Total <span className="float-right">{grandTotal.toLocaleString()} Birr</span>
      </Typography>
    </TableContainer>
    <button className="print-button" onClick={handlePrint}>
        Print
      </button>
      <div>
  {orderDetail?.order?.status === "comformed" && (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {currentUser.role !== "ADMIN" && (
        <h1 style={{ color: 'green', marginRight: '10px' }}>
          Waiting for Admin approval for the order.
        </h1>
      )}
      {currentUser.role === "ADMIN" && (
        <Button
          variant="contained"
          color="secondary"
          onClick={handleUpdate}
          text="Approve Order"
        />
      )}
    </div>
  )}

  {orderDetail?.order?.status === "pending" && (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {currentUser.role !== "SUPPLIER" && (
        <h1 style={{ color: 'green', marginRight: '10px' }}>
          Waiting for Supplier confirmation for the order.
        </h1>
      )}
      {currentUser.role === "SUPPLIER" && (
        <div>
          <h4 style={{ color: 'green', marginRight: '10px' }}>
            Please confirm the order.
          </h4>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleUpdate}
            text="Confirm Order"
          />
        </div>
      )}
    </div>
  )}

  {orderDetail?.order?.status === "approved" && (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {currentUser.role !== "CUSTOMER" && (
        <h4 style={{ color: 'green', marginRight: '10px' }}>
          Waiting for Customer payment for the order.
        </h4>
      )}
      {currentUser.role === "CUSTOMER" && (
        <div>
          <h4>
            Please make the payment for the order.
          </h4>
          <Button
            variant="contained"
            onClick={handlePayment}
            text="Make Payment"
          />
        </div>
      )}
    </div>
  )}
</div>
</div>
  );
}

function Detail() {
  const { id } = useParams<{ id?: string }>();
  return (
    <div>
      <ProductTable orderId={Number(id)} /> 
    </div>
  );
}

export default Detail;