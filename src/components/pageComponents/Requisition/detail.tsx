import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { gql, useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
 /* interface request {
          id:string;
        referenceNumber:string;
        addressDetail:string;
        remark:string;
        estimatedDelivery:string;
        createdAt:Date;  
        status:string;
          products :Product[];
          user:{
             firstName:string;
             lastName:string;
             email:string;
          };
          suppliers: {
            id:string;
            user :{
              id:string;
              username:string;
            }
          }
        }*/
        interface Product {
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
const GET_ORDER_QUERY = gql`
query PurchaseRequestById($id: Int!) {
  purchaseRequestById(id: $id) {
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
    userId
    id
    status
    remark
    addressDetail
    estimatedDelivery
    referenceNumber
    createdAt
  }
}
`;
const Detail: React.FC = () => {
 const { id } = useParams<{ id?: string }>();
    const { loading, error, data } = useQuery(GET_ORDER_QUERY, {
        variables: { id: Number(id) },
      });
    
      if (loading) {
        return <div>Loading...</div>;
      }
      if (error) {
        return <div>Error: {error.message}</div>;
      }
const requests = data?.purchaseRequestById;
const customer = "samisams";
const email = "forsamisams@gmail.cpm";
const addressDetail = requests?.addressDetail;
const referenceNumber = requests?.referenceNumber;  
const Date = requests?.createdAt;  
const remark = requests?.remark;  
const estimatedDelivery = requests?.estimatedDelivery;  
const status = requests?.status;  

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <div className="main">
      <div className="header">
  <div className="purchase-order">
    <h1>Purchase Request</h1>
  </div>
  <div className="address">
    <p>{addressDetail}</p>
  </div>
  <div className="logo-container">
    <img src={require('../../../assets/pro.png')} alt="logo" />
  </div>
</div>
        <div className="purchase-info">
        <div className="order-by">
        <p>|Requested By</p>
        <h4>Name : {customer}</h4>
        <p>Email : {email}</p>
        <p>Address : {addressDetail}</p>
        </div>
        <div className="order-to">
        <p>|Requested  To</p>
        <h6>reference  Number # : {referenceNumber}</h6>
        <h6>Requested  Date : {Date}</h6>
        <h6>Estimated  Delivery Day : With in  {estimatedDelivery}</h6>
        </div>
        <div className="payment-record">
         <p>| info</p>
         <p> status: {status}</p>
        </div>
        </div>
        <TableContainer>
          <Table className="blue-bordered-table">
            <TableHead>
              <TableRow className="blue-row">
                <TableCell>Item Name</TableCell>
                <TableCell>Item Code</TableCell>
                <TableCell>Part Number</TableCell>
                <TableCell>UOM</TableCell>
                <TableCell>QTY</TableCell>

                <TableCell>Description</TableCell>
                <TableCell>Mark</TableCell>
                <TableCell>Model</TableCell>

                </TableRow>
                </TableHead>
                <TableBody>
              {requests?.products?.map((product: Product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.title}</TableCell>
                  <TableCell>{product.code}</TableCell>
                  <TableCell>{product.partNumber}</TableCell>
                  <TableCell>{product.uom}</TableCell>
                  <TableCell>{product.quantity}</TableCell>

                  <TableCell>{product.Description}</TableCell>
                  <TableCell>{product.mark}</TableCell>
                  <TableCell>{product.model}</TableCell>
                  </TableRow>
              ))}
                </TableBody>
                </Table>
                </TableContainer>
       
        <div className="invoice-detail">
  <div className="remark">
    <Typography> Remark <span className="float-right">{remark} </span> </Typography>
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
      <style>{`
     .header {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        color: #00b0ad; 
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
        border: 2px solid  #00b0ad;
      }
      
      .blue-row {
        background-color: #00b0ad;
        color: white;
      }

      .invoice-detail {
        display: flex;
        justify-content: space-between;
      }
      
      .detail {
        flex-basis: 80%;
      }
      
      .remark {
        flex-basis: 80%;
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

export default Detail;
