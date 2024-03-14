import React, { useContext } from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';
import { Button, Grid, Paper, Table, TableCell,TableRow, Typography,TableHead, TableBody } from '@mui/material';
import MUIDataTable, { MUIDataTableOptions, MUIDataTableMeta } from 'mui-datatables';
import PageHeader from '../../../PageHeader';
import numberToWords from 'number-to-words';
import Spinner from '../../../Spinner';
import { UserContext } from '../../../../auth/UserContext';
import { useNavigate, useParams } from 'react-router-dom';
import PageFooter from '../../../PageFooter';
import { Add, Cancel, ConfirmationNumberTwoTone, Print, Send } from '@mui/icons-material';
import { styled } from '@mui/system';
interface Product {
  id: number;
  Description: string | null;
  code: string | null;
  manufacture: string | null;
  model: string | null;
  partNumber: string | null;
  quantity: number;
  title: string | null;
  uom: string | null;
}

interface OrderDetail {
  id: number;
  orderId: number;
  title: string | null;
  price?: number; // Make the price property optional
  quantity: number;
  productId: number;
  createdAt: string;
  updatedAt: string;
  product: Product;
  order: {
    id: number;
    customerId: number;
    supplierId: number;
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
      address:string;
      category: {
        name: string;
      };
    };
    customer: {
      username: string | null;
      address:string;
    };
  };
}

interface GetOrderDetailByOrderIdResponse {
  getOrderDetailByOrderId: OrderDetail[];
}

interface GetOrderDetailByOrderIdVariables {
  getOrderDetailByOrderIdId: number;
}

const StyledTableHeadCell = styled(TableCell)`
  background-color: #00b0ad;
  font-size: 15px;
  color:#ffffff;
`;
const GET_PAYMENT_BY_ORDER_ID = gql`
  query PaymentByPrderId($orderId: Int!) {
    paymentByPrderId(orderId: $orderId) {
      id
      amount
      paidAt
      paymentMethod
      userId
      orderId
      status
      referenceNumber
      fullName
    }
  }
`;
const GET_ORDER_DETAIL_BY_ORDER_ID = gql`
  query GetOrderDetailByOrderId($getOrderDetailByOrderIdId: Int!) {
    getOrderDetailByOrderId(id: $getOrderDetailByOrderIdId) {
      id
      orderId
      title
      price
      quantity
      productId
      createdAt
      updatedAt
      product {
        id
        Description
        code
        manufacturer
        model
        partNumber
        quantity
        title
        uom
      }
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
          address
          category {
            name
          }
        }
        customer {
          address
          username
        }
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

const Detail = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [updateOrder] = useMutation(UPDATE_ORDER);
  const { loading, error, data } = useQuery<GetOrderDetailByOrderIdResponse, GetOrderDetailByOrderIdVariables>(
    GET_ORDER_DETAIL_BY_ORDER_ID,
    {
      variables: { getOrderDetailByOrderIdId: Number(id)},
    }
  );
  const { currentUser } = useContext(UserContext);

 const { loading:paymentLoding, error:paymentError, data:paymentData } = useQuery(GET_PAYMENT_BY_ORDER_ID, {
    variables: {orderId:Number(id)},
  })
  const payment = paymentData?.paymentByPrderId;
console.log("fasile")
console.log(payment)
  if (!currentUser) {
    return <Spinner />;
  }
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  if (paymentLoding) return <p>Loading...</p>;
  if (paymentError) return <p>Error: {paymentError.message}</p>;

  const orderDetail = data?.getOrderDetailByOrderId[0];
  const order = orderDetail?.order;
  const products = orderDetail?.product;
 
  
  const columns = [
    // Define your product table columns here
    {
      name: 'title',
      field: 'title',
    },
    
    {
      name: 'Description',
      field: 'Description',
    },
    // ... add other columns as needed
    {
      name: 'quantity',
      field: 'quantity',
    },
    {
      name: 'Price',
      field: 'price',
      options: {
        customBodyRender: (value: number | undefined, tableMeta: MUIDataTableMeta) => {
          return   orderDetail?.price
           
        },
      },
    },
  ];

  const productsArray: Product[] = products ? [products] : [];

  const options: MUIDataTableOptions = {
    selectableRows: 'none',
    customFooter: () => {
      return (
        <Grid container spacing={3}>
        <Grid item xs={6}>
          <Typography>Invoice total i words</Typography>
        <Grid><h3><span style={{color:"red"}}>{amountInWords}</span> Birr</h3></Grid>
        <Typography>Payments</Typography>
        <Table>
  <TableHead>
    <TableRow>
      <StyledTableHeadCell>Date</StyledTableHeadCell>
      <StyledTableHeadCell>Amount</StyledTableHeadCell>
      <StyledTableHeadCell>Status</StyledTableHeadCell>
    </TableRow>
  </TableHead>
  <TableBody>
    <TableRow>
      <TableCell>{payment.amount}</TableCell>
      <TableCell>{payment?.amount}</TableCell>
      <span style={{background:"green",color:"#ffffff"}}><TableCell>{payment?.status}</TableCell></span> 
    </TableRow>
  </TableBody>
</Table>
        </Grid>
        <Grid item xs={6}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '16px' }}>
          <div style={{ marginRight: 'auto' }}>
             <Typography variant="h6" align="right">Subtotal:&nbsp;</Typography>
            <Typography variant="h6" align="right">Shipping Cost:</Typography>
            <Typography variant="h6" align="right">Tax:</Typography>
            <Typography variant="h6" align="right">Grand Total:</Typography>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <Typography variant="h6" align="left">{subtotal.toLocaleString()} Birr</Typography>
            <Typography variant="h6" align="left">{order?.shippingCost.toLocaleString()} Birr</Typography>
            <Typography variant="h6" align="left">{tax.toLocaleString()} Birr</Typography>
            <Typography variant="h6" align="left">{grandTotal.toLocaleString()} Birr</Typography>
          </div>
        </div>
        </Grid>
      </Grid>
      );
    },
  };

  const subtotal = productsArray.reduce((acc, product) => {
    return acc + (product?.quantity ?? 0) * (orderDetail?.price ?? 0);
  }, 0);

  const tax = subtotal * 0.15;
  const grandTotal = subtotal + tax + (order?.shippingCost ?? 0);
  const amountInWords = numberToWords.toWords(grandTotal);
 /* const handlePayment = () => {
    navigate(`/payment/${1}`);
  };*/

  const handlePayment = () => {
    const paymentId = id;
    const userId = currentUser.id;
    navigate(`/payment?id=${paymentId}&total=${grandTotal}&userId=${userId}`);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data } = await updateOrder({ variables: { id:Number(id), input:"comformed" } });
      console.log('Order updated:', data.updateOrder);
    } catch (updateError) {
      console.error('Failed to update order:', updateError);
    }
  };
  const handleUpdateReject = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data } = await updateOrder({ variables: { id:Number(id), input:"reject" } });
      console.log('Order updated:', data.updateOrder);
    } catch (updateError) {
      console.error('Failed to update order:', updateError);
    }
  };
  const handleUpdateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data } = await updateOrder({ variables: { id:Number(id), input:"approved" } });
      console.log('Order updated:', data.updateOrder);
    } catch (updateError) {
      console.error('Failed to update order:', updateError);
    }
  };
  const handlePrint = () => {
    window.print();
  };
  const createdDate = orderDetail?.order.createdAt ? new Date(orderDetail.createdAt) : null;
  const formattedDate = createdDate?.toLocaleString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
  
  
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Grid>
        <PageHeader
      title="Purchas Order"
      subTitle ="pircase Order"
      imageSrc="tra.jpg"
      />
        <Button
        variant="outlined"
        color="primary"
        startIcon={<Print />}
        onClick={handlePrint}
        style={{ whiteSpace: 'nowrap' }}
      >
        Print Page
      </Button>
    <Grid container spacing={2}>
      {/* Order By */}
      <Grid item xs={4}>
        <Paper>
          <Typography variant="h6">Order By</Typography>
          <Typography variant="body1">
          Customer Name: {orderDetail?.order?.customer?.username}
          </Typography>
          <Typography variant="body1">
            Reference Number: {orderDetail?.order?.referenceNumber}
          </Typography>
          <Typography variant="body1">
            Requested Date: {formattedDate?.toString()}
         
          </Typography>
          <Typography variant="body1">
            Address: {orderDetail?.order?.customer?.address}
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={4}>
        <Paper>
          <Typography variant="h6">Order To</Typography>
          <Typography variant="body1">
            Supplier Name: {orderDetail?.order?.supplier.name}
          </Typography>
          <Typography variant="body1">
            Category: {orderDetail?.order?.supplier?.category?.name}
          </Typography>
          <Typography variant="body1">
            Address: {orderDetail?.order?.supplier.address}
          </Typography>
        </Paper>
      </Grid>

      {/* More */}
      <Grid item xs={4}>
        <Paper>
          <Typography variant="h6">More</Typography>
          <Typography variant="body1">
            Status <span style={{color:"red"}}>: {orderDetail?.order?.status}</span>
          </Typography>
        </Paper>
      </Grid>
      </Grid>
        </Grid>
        <MUIDataTable
          title="Product Details"
          data={productsArray}
          columns={columns}
          options={options}
        />
       
        <Grid>
        {orderDetail?.order?.status === "comformed" && (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {currentUser.role !== "ADMIN" && (
        <h1 style={{ color: 'green', marginRight: '10px' }}>
          Waiting for Admin approval for the order.
        </h1>
      )}
      {currentUser.role === "ADMIN" && (
         <Grid item xs={12} textAlign="center">
         <Paper elevation={3} sx={{ padding: '20px', paddingTop: '10px', paddingBottom: '10px',marginTop:'10px',mariginBottom:'10px', border: '1px dashed #00b0ad' }}>
         <Typography variant="h6" component="h2" sx={{ marginBottom: '10px' }}>
         Order Actions
           </Typography>
                      <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '10px',
          }}>
        <Button
        variant="outlined"
        color="primary"
        startIcon={<Add />}
        onClick={handleUpdateAdmin}
        style={{ whiteSpace: 'nowrap' }}
      >
        Approve Order
      </Button>
      </div>
      </Paper>
      </Grid>
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
         <Grid item xs={12} textAlign="center">
<Paper elevation={3} sx={{ padding: '20px', paddingTop: '10px', paddingBottom: '10px',marginTop:'10px',mariginBottom:'10px', border: '1px dashed #00b0ad' }}>
<Typography variant="h6" component="h2" sx={{ marginBottom: '10px' }}>
Order Actions
  </Typography>
             <div style={{
   display: 'flex',
   alignItems: 'center',
   justifyContent: 'space-between',
   marginBottom: '10px',
 }}>
              <Button
                startIcon={<ConfirmationNumberTwoTone />}
                variant="outlined"
                color="primary"
                onClick={handleUpdate}
              >
                Confirm Order
              </Button>
              <Button
        variant="outlined"
        startIcon={<Cancel />}
        onClick={handleUpdateReject}
        style={{ whiteSpace: 'nowrap',color:"red" }}
      >
        Reject Order 
      </Button>
   </div>
         </Paper>
   </Grid>
      
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
    
    <Grid item xs={12} textAlign="center">
    <Paper elevation={3} sx={{ padding: '20px', paddingTop: '10px', paddingBottom: '10px',marginTop:'10px',mariginBottom:'10px', border: '1px dashed #00b0ad' }}>
    <Typography variant="h6" component="h2" sx={{ marginBottom: '10px' }}>
    Order Actions
      </Typography>
                 <div style={{
       display: 'flex',
       alignItems: 'center',
       justifyContent: 'space-between',
       marginBottom: '10px',
     }}>
                     <Typography> Please make the payment for the order.</Typography>
  <Button
    type="submit"
    variant="outlined"
    color="primary"
    style={{ whiteSpace: 'nowrap' }}
    onClick={handlePayment}
  >
    <Send /> Make Payment
  </Button>
       </div>
             </Paper>
       </Grid>
      )}
      
    </div>
  )}
  <PageFooter/>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Detail;