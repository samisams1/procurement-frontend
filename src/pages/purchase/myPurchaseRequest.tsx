import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

type Product = {
  name: string;
  price: number;
  quantity: number;
};

const MyPurchaseRequest: React.FC = () => {
  const companyName = 'Yosis Software Company';
  const date = 'January 12, 2024';
  const products: Product[] = [
    { name: 'Product 1', price: 10, quantity: 2 },
    { name: 'Product 2', price: 15, quantity: 1 },
    { name: 'Product 3', price: 5, quantity: 3 },
  ];
  const address = '123 Main Street, City, State';
  const shippingPrice = 200;
  const subTotal = products.reduce((total, product) => shippingPrice + total + product.price * product.quantity, 0);
  const taxRate = 0.1; // 10% tax rate
  const taxTotal = subTotal * taxRate;
  const grandTotal = subTotal + taxTotal;

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <div className="main">
      <div className="purchase-date">
            <p>Date: {date}</p>
          </div>
        <div className="purchase-order">
          <h1>Purchase Rquest</h1>
        </div>
        <div className="project-item-category">
          <div className="left-align">For/Project Item...................</div>
          <div className="center-align">Item Category : Constraction</div>
          <div className="right-align">Req No: 524</div>
        </div>
        <TableContainer component={Paper}>
  <Table>
    <TableHead>
      <TableRow>
        <TableCell>Item Name</TableCell>
        <TableCell>Item Code</TableCell>
        <TableCell>Part Number</TableCell>
        <TableCell>Uom</TableCell>
        <TableCell>Quantity</TableCell>
        <TableCell>Price</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {products.map((product, index) => (
        <TableRow key={index}>
          <TableCell>{product.name}</TableCell>
          <TableCell>{product.name}</TableCell>
          <TableCell>{product.name}</TableCell>
          <TableCell>{product.name}</TableCell>
          <TableCell>{product.quantity}</TableCell>
          <TableCell></TableCell> {/* Empty Price Column */}
        </TableRow>
      ))}
      <TableRow>
        <TableCell colSpan={5}>Shipping Price:</TableCell>
        <TableCell>${shippingPrice.toFixed(2)}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={5}>Address:</TableCell>
        <TableCell>${address}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={5}>Estimated Delivery Date:</TableCell>
        <TableCell>Within 15 Days</TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={5}>Remark:</TableCell>
        <TableCell>bla bla</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</TableContainer>
        <div className="approval-section">
          <div className="approval-item">
            <span>Requested By: Samson</span>
          </div>
          <div className="approval-item">
            <span>Checked By: ..............</span>
          </div>
          <div className="approval-item">
            <span>Approved By: ..............</span>
          </div>
        </div>
      </div>
      <button className="print-button" onClick={handlePrint}>
        Print
      </button>
      <style>{`
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        .header-content {
          display: flex;
          align-items: center;
        }
        .logo-container {
          flex: 0 0 auto;
        }
        .company-details {
          flex: 1 1 auto;
          text-align:center;
        }
        .purchase-date {
          flex: 0 0 auto;
        }
        .purchase-order {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 16px;
        }
        .project-item-category {
            display: flex;
            justify-content: space-between;
            margin-bottom: 16px;
          }
          
          .left-align {
            text-align: left;
          }
          
          .center-align {
            text-align: center;
          }
          
          .right-align {
            text-align: right;
          }
        .invoice-details,
        .address,
        .approval-section {
          margin-bottom: 16px;
        }
        .approval-section {
          display: flex;
          justify-content: space-between;
        }
        .approval-item {
          flex: 1;
        }
        .print-button {
          margin-top: 16px;
        }
        .MuiTableCell-root {
          border: 1px solid black;
        }
        .MuiTableRow-root:not(:last-child) {
          border-bottom: 1px solid black;
        }
        @media print {
          .print-button {
            display: none;
          }
          .menu,
          .sidebar {
            display: none;
          }
        }
      `}</style>
    </>
  );
};

export default MyPurchaseRequest;