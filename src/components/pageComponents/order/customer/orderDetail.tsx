import React, { useContext } from 'react';
import { useQuery } from '@apollo/client';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid, Paper, Typography } from '@mui/material';
//import numberToWords from 'number-to-words';
import { gql } from '@apollo/client';
import PageHeader from '../../../PageHeader';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../../auth/UserContext';
import Spinner from '../../../Spinner';
import Button from '../../../Button';

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
  getOrderDetailByOrderId: OrderDetail[];
}

interface OrderDetailVariables {
  id: number;
}

function ProductTable({ orderId }: { orderId: number }) {
  const navigate = useNavigate();

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
  const orderDetail = data?.getOrderDetailByOrderId[0]; // Assuming there's only one order detail for a given order ID
  
  const status = orderDetail?.order?.status[0];
  const shippingCost = data?.getOrderDetailByOrderId[0].order.shippingCost || 0;
  const subTotal = data?.getOrderDetailByOrderId.reduce((total, orderDetail) => {
    return total + orderDetail.price * orderDetail.quantity;
  }, 0) || 0;
  const taxTotal = 5000;
  const grandTotal = subTotal + taxTotal + shippingCost;
    const handlePrint = () => {
      window.print();
    };
    //grand total in words
   // const amountInWords = numberToWords.toWords(grandTotal);
  
    const handlePayment = () => {
      // Handle payment logic here
      // Open the payment page in a new tab or window
      navigate(`/payment/${1}`);
    };
 /*   const formatDate = (dateString: string): string => {
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
      const date: Date = new Date(dateString);
      return date.toLocaleDateString(undefined, options);
    };*/
    
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
            Customer Name: {orderDetail?.order.customer.username}
          </Typography>
          <Typography variant="body1">
            Reference Number: {orderDetail?.order.referenceNumber}
          </Typography>
          <Typography variant="body1">
            Created At: {orderDetail?.order.createdAt}
          </Typography>
        </Paper>
      </Grid>

      {/* Order To */}
      <Grid item xs={4}>
        <Paper>
          <Typography variant="h6">Order To</Typography>
          <Typography variant="body1">
            Supplier Name: {orderDetail?.order.supplier.name}
          </Typography>
          <Typography variant="body1">
            Shipping Cost: {orderDetail?.order.shippingCost}
          </Typography>
        </Paper>
      </Grid>

      {/* More */}
      <Grid item xs={4}>
        <Paper>
          <Typography variant="h6">More</Typography>
          <Typography variant="body1">
            Status: {orderDetail?.order.status}
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
          {data?.getOrderDetailByOrderId.map((orderDetail) => (
            <TableRow key={orderDetail.id}>
              <TableCell>{orderDetail.orderId}</TableCell>
              <TableCell>{orderDetail.title}</TableCell>
              <TableCell>{orderDetail.price}</TableCell>
              <TableCell>{orderDetail.quantity}</TableCell>
              <TableCell>{orderDetail.product.Description}</TableCell>
              <TableCell>{orderDetail.product.code}</TableCell>
              <TableCell>{orderDetail.product.manufacture}</TableCell>
              <TableCell>{orderDetail.product.model}</TableCell>
              <TableCell>{orderDetail.product.partNumber}</TableCell>
              <TableCell>{orderDetail.product.uom}</TableCell>
            </TableRow>
          ))}
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
    <div>
      <button className="print-button" onClick={handlePrint}>
        Print
      </button>
      {currentUser.role === "ADMIN"  &&(
        <div style={{ display: 'flex', alignItems: 'center' }}>
        <h1 style={{ color: 'green', marginRight: '10px' }}>
          The Order Status is Approved. Please Make Payment!
        </h1>
        <Button
          variant="contained"
          color="secondary"
          onClick={handlePayment}
          text="Make Payment"
        />
      </div>
      )}
        {currentUser.role === "SUPPLIER"  &&  status === "pending" &&(
         <h1 style={{color:"red"}}>The Order Status is pending Please wait for Supplier Comformation!</h1>
      )}
       {currentUser.role === "CUSTOMER"  &&(
         <h1 style={{color:"#1c9fef"}}>The Order Status is comformed Please wait for Admin Approval!</h1>
      )}
      </div>
    </div>
  );
}

function Detail() {
  return (
    <div>
      <ProductTable orderId={1} /> {/* Replace 1 with the actual order ID */}
    </div>
  );
}

export default Detail;