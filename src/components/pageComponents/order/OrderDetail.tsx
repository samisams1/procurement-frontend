/* { gql, useMutation, useQuery } from '@apollo/client';
import { Grid, TextField, Typography } from '@mui/material';
import Spinner from '../../Spinner';
import { Form } from '../../useForm';
import Button from '../../Button';
import { ORDER_QUERY } from '../../../graphql/Order';
import { UserContext } from '../../../auth/UserContext';

const UPDATE_ORDER_MUTATION = gql`
  mutation UpdateOrder($id: Float!, $status: String!) {
    updateOrder(id: $id, status: $status) {
      id
      status
    }
  }
`;

const GET_ORDER_QUERY = gql`
  query GetOrderDetailByOrderId($id: Float!) {
    getOrderDetailByOrderId(id: $id) {
      id
      title
      price
      quantity
    }
  }
`;

const OrderDetail = ({ id, status, newstatus }: { id: number; status: string; newstatus: string }) => {
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { currentUser } = useContext(UserContext);
  const [updateOrder] = useMutation(UPDATE_ORDER_MUTATION, {
    refetchQueries: [{ query: ORDER_QUERY }],
  });

  const { loading, error, data } = useQuery(GET_ORDER_QUERY, {
    variables: { id:id },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateOrder({
        variables: { id, status: newstatus },
      });
      setSuccessMessage('Success message');
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  if (!currentUser || loading) {
    return <Spinner />;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const order = data.getOrderDetailByOrderId;

  // Calculate total amount
  let totalAmount = 0;
  order.forEach((orderDetail: any) => {
    totalAmount += orderDetail.quantity * orderDetail.price;
  });

  let buttonArea = null;
  let message = '';

  if (status === 'pending') {
    buttonArea = (
      <Grid container justifyContent="center">
        <Grid item>
          <Button
            type="submit"
            text="Comformed"
            style={{ backgroundColor: '#9ac96f', color: 'white' }}
          />
        </Grid>
      </Grid>
    );
    message = 'Please   Review the order and comform!';
  } else if (status === 'comformed') {
    message = 'Supplier comformed the order Waiting for admin approval!';
  } else if (status === 'approved') {
    message = 'The admin aproved wait for customer make payments!';
  }

  return (
    <Grid container spacing={2}>
      <Form onSubmit={handleSubmit}>
        {order.map((orderDetail: any, index: number) => (
          <Grid
            container
            key={index}
            spacing={2}
            style={{ marginTop: '10px' }}
          >
            <Grid item xs={4}>
              <TextField
                label={`Product Name ${index + 1}`}
                value={orderDetail.title}
                InputProps={{
                  readOnly: true,
                }}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label={`Price ${index + 1}`}
                value={orderDetail.price}
                InputProps={{
                  readOnly: true,
                }}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label={`Quantity ${index + 1}`}
                value={orderDetail.quantity}
                InputProps={{
                  readOnly: true,
                }}
                variant="outlined"
                fullWidth
              />
            </Grid>
          </Grid>
        ))}

        <Grid container justifyContent="center">
          <Grid item>
            <h3>Total Amount = {totalAmount}</h3>
          </Grid>
        </Grid>

        <Typography>{successMessage}</Typography>
        <Typography>{errorMessage}</Typography>
        <Typography style={{ color: 'green', textAlign: 'center' }}>{message}</Typography>
        {buttonArea}
      </Form>
    </Grid>
  );
};

export default OrderDetail;
*/
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import numberToWords from 'number-to-words';
import Button from '../../Button';
import { ORDER_QUERY } from '../../../graphql/Order';

interface OrderData {
    id: string;
    title: string;
    price: number;
    shippingCost:number;
    status:string;
    referenceNumber:string;
    purchaseRequest:{
      id:string;
      referenceNumber:string;
      estimatedDelivery:string;
      addressDetail:string;
    };
    suppliers: {
      name:string;
    };
    orderDetails: {
      id: string;
      price: number;
      product: {
        id: string;
        title: string;
        quantity: number;
        code: string;
        Description: string;
        partNumber: string;
        mark: string;
        model: string;
        uom: string;
      };
    };
    quantity: number;
  }
const UPDATE_ORDER_MUTATION = gql`
  mutation UpdateOrder($id: Float!, $status: String!) {
    updateOrder(id: $id, status: $status) {
      id
      status
    }
  }
`;
const GET_PAYMENT_QUERY = gql`
query Payment($id: Int!) {
  payment(id: $id){
    id
    paidAt
    user{
      firstName
    }
    amount
    referenceNumber
    paidAt
    status
  }
}
`;
const GET_ORDER_QUERY = gql`
query GetOrderById($id: Int!) {
  getOrderById(id: $id) {
    id
    shippingCost
    referenceNumber
    createdAt
    status
    customer{
      user{
        username
      }
    }
    suppliers {
      name
      user {
        id
        username
      }
    }
    purchaseRequest {
      id
      referenceNumber
      estimatedDelivery
      addressDetail
      user {
        username
      }
    }
    orderDetails {
      id
      product {
        title
        quantity
        uom
        code
        Description
        partNumber
        mark
        model
      }
      price
    }
  }
}
`;
const SubOrderDetail: React.FC = () => {
 const { id } = useParams<{ id?: string }>();
 const [successMessage, setSuccessMessage] = useState('');
 const [errorMessage, setErrorMessage] = useState('');
 const [updateOrder] = useMutation(UPDATE_ORDER_MUTATION, {
  refetchQueries: [{ query: ORDER_QUERY }],
});
 //const navigate = useNavigate();
    const { loading, error, data } = useQuery(GET_ORDER_QUERY, {
        variables: { id: Number(id) },
      });
      const { loading:paymentLoading, error:paymentError, data:paymentData } = useQuery(GET_PAYMENT_QUERY, {
        variables: { id: Number(id) },
      });
      if (loading) {
        return <div>Loading...</div>;
      }
    
      if (error) {
        return <div>Error: {error.message}</div>;
      }
     
      if (paymentLoading) {
        return <div>Loading...</div>;
      }
    
      if (paymentError) {
        return <div>Error: {paymentError.message}</div>;
      }
  const order = data?.getOrderById;
console.log(paymentData)
  let subtotal = 0;
  const status = order?.status;

  const requestReferenceNumber = order?.purchaseRequest.referenceNumber;
  const estimatedDelivery = order?.purchaseRequest.estimatedDelivery;
  const address = order?.purchaseRequest.addressDetail;
  // Calculate shipping Cost
const shippingCost = order?.shippingCost;  
const referenceNumber= order?.referenceNumber;
const createdAt= order?.createdAt;
  // Calculate subtotal
    order?.orderDetails.forEach((orderDetail: OrderData['orderDetails']) => {
        const itemSubtotal = orderDetail.price * orderDetail.product.quantity;
        subtotal += itemSubtotal;
      });
    // Subtotal Incclude  shipping Cost
    const SubtotalShiping = subtotal + shippingCost;
 // Calculate taxable
  const taxTotal = SubtotalShiping * 0.15;
   // Calculate grand total
  const grandTotal = SubtotalShiping + taxTotal ;
  const handlePrint = () => {
    window.print();
  };
  //grand total in words
  const amountInWords = numberToWords.toWords(grandTotal);


   const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(id);
    const intId = Number(id);
    try {
      await updateOrder({
        variables: { id:intId, status: "comformed" },
      });
      setSuccessMessage('Success message');
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const date: Date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  };
  
  return (
    <>
      <div className="main">
      <div className="header">
  <div className="purchase-order">
    <h1>Purchase Order </h1>
  </div>
  <div className="status">
    <h1>{status}</h1>
  </div>
  <div className="logo-container">
    <img src={require('../../../assets/pro.png')} alt="logo" />
  </div>
</div>
        <div className="purchase-info">
        <div className="order-by">
        <p>|Order By</p>
        <p>samsi sams </p>
        <p>Request reference Number # : {requestReferenceNumber}</p>
        <p>Estimated Delivery Days :   { " " + estimatedDelivery}</p>
        <p>Customer Address :   { " " + address}</p>
        </div>
        <div className="order-to">
        <p>|order To</p>
        <p>Supplier Company Name : {"Yosis Soft"}</p>
        <p>order   reference Number # : {referenceNumber}</p>
       
        <p>Order Date  :  {formatDate(createdAt)}</p>
        <h6>Due  Date 2541</h6>
        </div>
        <div className="payment-record">
         <p>| payment Record</p>
        </div>
        </div>
        <TableContainer>
          <Table className="blue-bordered-table">
            <TableHead>
              <TableRow className="blue-row">
                <TableCell>Item Name</TableCell>
                <TableCell>Item code</TableCell>
                <TableCell>partNumber</TableCell>
                <TableCell>UOM</TableCell>
                <TableCell>Qty</TableCell>
                <TableCell>price</TableCell>
                <TableCell>Subtotal</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order?.orderDetails.map((orderDetail: OrderData['orderDetails']) => (
                <TableRow key={orderDetail.id}>
                  <TableCell>{orderDetail.product.title}</TableCell>
                  <TableCell>{orderDetail.product.code}</TableCell>
                  <TableCell>{orderDetail.product.partNumber}</TableCell>
                  <TableCell>{orderDetail.product.uom}</TableCell>
                  <TableCell>{orderDetail.product.quantity}</TableCell>
                  <TableCell>{(orderDetail.price).toLocaleString()}</TableCell>
                  <TableCell>{(orderDetail.price * orderDetail.product.quantity).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div className="invoice-detail">
  <div className="detail">
    <p>Customer Address {address}</p>
    <h5>Invoice Total in words</h5>
    <h3 style={{color:"red"}}>{amountInWords + " "} Birr</h3>
   <Typography>payments</Typography> 
    <TableContainer>
      <Table className="blue-bordered-table">
        <TableHead>
        <TableRow className="blue-row">
            <TableCell>Invoice Num</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Customer Name</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {paymentData?.payment.map((mypayment: any) => (
        <TableRow>
            <TableCell>{mypayment.referenceNumber}</TableCell>
            <TableCell>{mypayment.amount.toLocaleString() + " "} Birr</TableCell>
            <TableCell>{mypayment.user.firstName}</TableCell>
            <TableCell>{formatDate(mypayment.paidAt)}</TableCell>
            <TableCell>{mypayment.status}</TableCell>

         </TableRow>
        ))}
        </TableBody>
        </Table>
   </TableContainer>
  </div>
  <div className="calculate">
    Sub Total: <span className="float-right">{subtotal.toLocaleString()} Birr</span>
    <Typography> Shiping Cost <span className="float-right">{shippingCost.toLocaleString()} Birr</span> </Typography>
    <Typography> Sub Total inc.(Shiping)<span className="float-right">{SubtotalShiping.toLocaleString()} Birr</span></Typography>
    <Typography> Taxable Amont <span className="float-right">{taxTotal.toLocaleString()} Birr</span></Typography>
    <Typography> Grand Total  <span className="float-right">{grandTotal.toLocaleString()} Birr</span></Typography>
  </div>
</div>
      </div>
      <div className="footer">
  <div className="terms-condition">
    <h4>Terms And Condition</h4>
    <p> The terms and conditions are governed by a specific jurisdiction's laws.</p>
    <p> Disputes arising from the agreement may be resolved through arbitration or litigation. .</p>

  </div>
  <div className="additionalnotes">
    <h4>Addtitinal Notes</h4>
    <p>it been long time to see you again</p>
  </div>
</div>
      <button className="print-button" onClick={handlePrint}>
        Print
      </button>
      {status === "pending" &&(
        <div style={{ display: 'flex', alignItems: 'center' }}>
        <h1 style={{ color: 'green', marginRight: '10px' }}>The order status is pending. Please wait for confirmation!</h1>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleSubmit}
          text="Comform"
        />
        <Typography>{successMessage}</Typography>
        <Typography>{errorMessage}</Typography>
      </div>
      )}
        {status === "approved" &&(
         <h1 style={{color:"red"}}>  The order status has been approved. Please wait for the customer to make the payment.</h1>
      )}
       {status === "comformed" &&(
         <h1 style={{color:"#1c9fef"}}>The order status has been confirmed. Please wait for admin approval!</h1>
      )}


      <style>{`
     .header {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        background-color: #d1e0eb;
        color: #79cbfd; 
      }
      
      .purchase-order {
        flex-grow: 1;
      }
      
      .status {
        flex-grow: 1;
        text-align: center;
        color:red;
      }
      
      .logo-container {
        flex-shrink: 0;
        margin-left: 20px;
      }
      
      .logo-container img {
        max-width: 100px;
      }

      .purchase-info {
        display: flex;
      }
      
      .order-by,
      .order-to,
      .payment-record {
        flex-grow: 1;
      }

      .blue-bordered-table {
        border: 2px solid  #1c9fef;
      }
      
      .blue-row {
        background-color: #1c9fef;
        color: white;
      }

      .invoice-detail {
        display: flex;
        justify-content: space-between;
      }
      
      .detail {
        flex-basis: 70%;
      }
      
      .calculate {
        flex-basis: 30%;
      }
      .footer {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        background-color: #d1e0eb;
        color: #79cbfd; 
      }
      .terms-condition{
        flex-basis: 80%;
         color: #060606; 
      }
      .additionalnotes{
        flex-basis: 20%;
         color: #060606; 
      }
      .float-right {
        float: right;
      }
      `}</style>
    </>
  );
};

export default SubOrderDetail;