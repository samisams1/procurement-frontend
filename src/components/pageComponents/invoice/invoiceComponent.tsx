import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const styles = {
  root: {
    margin: '16px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '16px',
  },
  customer: {
    marginBottom: '16px',
  },
  tableContainer: {
    marginBottom: '32px',
  },
  printButton: {
    marginTop: '16px',
  },
  paymentButton: {
    marginTop: '16px',
  },
};

const Invoice = () => {
  const navigate = useNavigate();
  const invoiceNumber = 'INV-123';
  const invoiceDate = '2024-01-19';
  const customerName = 'John Doe';
  const items = [
    { description: 'Item 1', quantity: 2, price: 10, total: 20 },
    { description: 'Item 2', quantity: 1, price: 15, total: 15 },
    { description: 'Item 3', quantity: 3, price: 5, total: 15 },
  ];
  const totalAmount = 50;

  // Data validation (optional)
  if (!invoiceNumber || !invoiceDate || !customerName || items.length === 0) {
    return <div>Invalid invoice data.</div>;
  }

  // Localization
  const formattedInvoiceDate = new Date(invoiceDate).toLocaleDateString();

  const handlePrint = () => {
    window.print();
  };

  const handlePayment = () => {
    // Handle payment logic here
    // Open the payment page in a new tab or window
    navigate('/payment');
  };
/*const handleSubmit = async (selectedType: string): Promise<void> => {
    try {
      if (selectedType !== 'supplier' && selectedType !== 'agent' && selectedType !== 'x-company') {
        throw new Error('Invalid selected type');
      }
    } catch (error) {
      console.log(error);
    }
  };
*/
  return (
    <div style={styles.root}>
      <div style={styles.header}>
        <Typography variant="h4">Invoice</Typography>
        <div>
          <Typography>Invoice Number: {invoiceNumber}</Typography>
          <Typography>Invoice Date: {formattedInvoiceDate}</Typography>
        </div>
      </div>

      <div style={styles.customer}>
        <Typography variant="h5">Customer: {customerName}</Typography>
      </div>

      <TableContainer component={Paper} style={styles.tableContainer}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Description</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.price}</TableCell>
                <TableCell>{item.total}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableBody>
            <TableRow>
              <TableCell colSpan={3}>Total Amount:</TableCell>
              <TableCell>{totalAmount}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Button variant="contained" color="primary" style={styles.printButton} onClick={handlePrint}>
        Print
      </Button>

      <Button
        variant="contained"
        color="secondary"
        style={styles.paymentButton}
        onClick={handlePayment}
      >
        Make Payment
      </Button>
    </div>
  );
};

export default Invoice;