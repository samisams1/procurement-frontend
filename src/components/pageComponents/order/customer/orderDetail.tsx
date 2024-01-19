import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { gql, useQuery } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../../Button';
interface OrderData {
    id: string;
    title: string;
    price: number;
    shippingCost:number;
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
const GET_ORDER_QUERY = gql`
query GetOrderById($id: Int!) {
    getOrderById(id: $id) {
      id
      shippingCost
      referenceNumber
      createdAt
      orderDetails {
        id
        product{
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
const OrderDetail: React.FC = () => {
 const { id } = useParams<{ id?: string }>();
 const navigate = useNavigate();
    const { loading, error, data } = useQuery(GET_ORDER_QUERY, {
        variables: { id: Number(id) },
      });
    
      if (loading) {
        return <div>Loading...</div>;
      }
    
      if (error) {
        return <div>Error: {error.message}</div>;
      }
  const order = data?.getOrderById;
 
  const address = '123 Main Street, City, State';
  let subtotal = 0;
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
  const handlePayment = () => {
    // Handle payment logic here
    // Open the payment page in a new tab or window
    navigate('/payment');
  };
  return (
    <>
      <div className="main">
      <div className="header">
  <div className="purchase-order">
    <h1>Purchase Order</h1>
  </div>
  <div className="address">
    <p>{address}</p>
  </div>
  <div className="logo-container">
    <img src={require('../../../../assets/pro.png')} alt="logo" />
  </div>
</div>
        <div className="purchase-info">
        <div className="order-by">
        <p>|Order By</p>
        <h4>supplier1</h4>
        </div>
        <div className="order-to">
        <p>|order To</p>
        <h6>Request reference Number # 2541</h6>
        <h6>order   reference Number # {referenceNumber}</h6>
        <h6>Order Date {createdAt}</h6>
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
                  <TableCell>{orderDetail.price}</TableCell>
                  <TableCell>{orderDetail.price * orderDetail.product.quantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div className="invoice-detail">
  <div className="detail">
    <p>Customer Address {address}</p>
    <h5>Invoice Total in words</h5>
    <h3>fifty Thousend Birre</h3>
    payments
    <Table>
        <thead>
            <td>id</td>
            <td>name</td>
            <td>amount</td>
            <td>status</td>
        </thead>
        <tbody>
            <td>1</td>
            <td>2</td>
            <td>78</td>
            <td>5</td>
        </tbody>
    </Table>
  </div>
  <div className="calculate">
    Sub Total: <span className="float-right">{subtotal} Birr</span>
    <Typography> Shiping Cost <span className="float-right">{shippingCost} Birr</span> </Typography>
    <Typography> Sub Total inc.(Shiping Cost)<span className="float-right">{SubtotalShiping} Birr</span></Typography>
    <Typography> Taxable Amont <span className="float-right">{taxTotal} Birr</span></Typography>
    <Typography> Grand Total  <span className="float-right">{grandTotal} Birr</span></Typography>
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
      <Button
        variant="contained"
        color="secondary"
        //style={styles.paymentButton}
        onClick={handlePayment}
      >
        Make Payment
      </Button>
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
      
      .address {
        flex-grow: 1;
        text-align: center;
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
        flex-basis: 80%;
      }
      
      .calculate {
        flex-basis: 20%;
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

export default OrderDetail;