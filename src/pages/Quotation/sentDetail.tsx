import { gql, useQuery } from '@apollo/client';
import { Box, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableRow, TextField, ThemeProvider, Typography, createTheme } from '@mui/material';
import MUIDataTable, { MUIDataTableOptions } from 'mui-datatables';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {RequestQuote } from '@mui/icons-material';
import PageHeader from '../../components/PageHeader';

const GET_QUOTATION_QUERY = gql`
  query QuotationByRequestIdAdSupplierId($id: Int!, $supplierId: Int!) {
    quotationByRequestIdAdSupplierId(id: $id, supplierId: $supplierId) {
      id
      createdAt
      price
      disCountPrice
      status
      remark
      sentBy
      product {
        id
        uom
        title
        quantity
        code
        uom
      }
      quotation {
        purchaseRequestId
        remark
        sentBy
        availabilityDate
        shippingPrice
      }
    }
  }
`;
interface Product {
  id: number;
  uom: string | null;
  title: string;
  quantity: string;
}

interface Quotation {
  purchaseRequestId: string;
  sentBy: string;
  remark: string;
  availabilityDate: string;
  shippingPrice: number;
}

interface ProductPrice {
  id: number;
  createdAt: string;
  price: string;
  status: string;
  product: Product;
  quotation: Quotation;
  disCountPrice: number;
  remark: string;
  sentBy: string;
}

interface QuotationByRequestIdAdSupplierIdData {
  quotationByRequestIdAdSupplierId: ProductPrice[];
}

interface QuotationByRequestIdAdSupplierIdVariables {
  id: number | null;
  supplierId: number;
}

const SendDetail = () => {
  const location = useLocation();
  const id = location.state?.id;
  //const qId = location.state.qId;
  const supplierId = location.state?.supplierId;
  const referenceNumber = location.state?.referenceNumber;
  const requestedDate = location.state?.requestedDate;
  const customerName = location.state?.customerName;
  
  const { loading, error, data } = useQuery<
    QuotationByRequestIdAdSupplierIdData,
    QuotationByRequestIdAdSupplierIdVariables
  >(GET_QUOTATION_QUERY, {
    variables: { id: Number(id), supplierId: Number(supplierId) },
  });

  const [formattedData, setFormattedData] = useState<any[]>([]);
  
  const currentDate = new Date().toLocaleDateString();

  const [shippingCost, setShippingCost] = useState<number>(
    data?.quotationByRequestIdAdSupplierId[0]?.quotation.shippingPrice || 0
  );
  useEffect(() => {
    if (data?.quotationByRequestIdAdSupplierId) {
      const updatedData = data.quotationByRequestIdAdSupplierId.map((productPrice, index) => {
        const subTotal = parseFloat(productPrice.price) * parseInt(productPrice.product.quantity);
        return [
          index + 1, // SN
          productPrice.product.title, // Product/Service description
          productPrice.product.uom, // Unit
          productPrice.price, // Unit Price (changed from TextField)
          productPrice.disCountPrice, // Discount
          productPrice.product.quantity,
          subTotal.toFixed(2), // Subtotal
        ];
      });

      setFormattedData(updatedData);
    }
  }, [data]);
  const [remark] = useState(data?.quotationByRequestIdAdSupplierId[0]?.quotation.remark || '');
const [sentBy] = useState(data?.quotationByRequestIdAdSupplierId[0]?.quotation.sentBy || '');
const [estimatedDelivery] = useState(data?.quotationByRequestIdAdSupplierId[0]?.quotation.availabilityDate || '');

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
    const newValue = event.target.value;
    const updatedData = [...formattedData];
    updatedData[index][3] = newValue;

    // Recalculate the subTotal
    const unitPrice = parseFloat(newValue);
    const quantity = parseInt(updatedData[index][5]);
    const subTotal = unitPrice * quantity;
    updatedData[index][6] = subTotal.toFixed(2);

    setFormattedData(updatedData);
  };

  const columns = [
    { name: 'SN', options: { filter: false, sort: false } },
    {
      name: 'Product/Service description',
      options: {
        display: true,
      },
    },
    {
      name: 'Unit',
      options: {
        display: true,
      },
    },
    {
      name: 'U. Price(ETB)',
      options: {
        display: true,
        customBodyRender: (value: string, tableMeta: any, updateValue: any) => (
            <TextField
            value={value}
            onChange={(event) => handlePriceChange(event, tableMeta.rowIndex)}
            type="number"
            inputProps={{
              inputMode: 'numeric',
              pattern: '[0-9]*',
            }}
            disabled  // Add the disabled prop here
          />
        ),
      },
    },
    {
      name: 'Discount',
      options: {
        display: true,
      },
    },
    {
      name: 'Qty',
      options: {
        display: true,
      },
    },
    {
      name: 'Subtotal(ETB)',
      options: {
        display: true,
      },
    },
  ];
  const options: MUIDataTableOptions = {
    filter: true,
    download: true,
    print: true,
    search: true,
    selectableRows: 'none',
    viewColumns: true,
    responsive: 'standard',
    rowsPerPage: 10,
    rowsPerPageOptions: [10, 25, 50],
    customFooter: () => {
      return (
        <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
        <div style={{ border: '1px solid black', padding: '10px', margin: '10px', textAlign: 'center' }}>
      <Typography variant="h6" style={{ textDecoration: 'underline', fontWeight: 'bold', textAlign: 'center' }}>
        Terms of Sales
      </Typography>
      <div style={{ border: '1px solid black', padding: '10px', margin: '10px', textAlign: 'center' }}>
        <Typography>
          Please order your purchase before valid days
        </Typography>
      </div>
      <div style={{ border: '1px solid black', padding: '10px', margin: '10px', textAlign: 'center' }}>
        <Typography>
          Buyers are responsible for the requested items
        </Typography>
      </div>
      <div style={{ border: '1px solid black', padding: '10px', margin: '10px', textAlign: 'center' }}>
        <Typography>
          If any change please notify us before 24hrs
        </Typography>
      </div>
      <div style={{ border: '1px solid black', padding: '10px', margin: '10px', textAlign: 'center' }}>
        <Typography>
          If any change please notify us before 24hrs
        </Typography>
      </div>
    </div>
        </Grid>
        <Grid item xs={12} sm={6}>
        <div style={{ border: '1px solid black', padding: '10px', margin: '10px', textAlign: 'center' }}>
    <TableContainer component={Paper} style={{ margin: '10px' }}>
      <Table>
        <TableBody>
        <TableRow>
            <TableCell align="center">
              <Typography>Shipping Cost(ETB)</Typography>
            </TableCell>
            <TableCell align="center" style={{ padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TextField
                placeholder="Enter Shipping Cost"
                value={Number.isFinite(shippingCost) ? shippingCost.toString() : ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setShippingCost(parseFloat(e.target.value))
                }
                fullWidth
                style={{ height: '30px' }}
                InputProps={{
                  style: {
                    padding: '0 8px',
                    height:'30px',
                  },
                }}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="center">
              <Typography>Sub Total</Typography>
            </TableCell>
            <TableCell align="center">
              <Typography>{calculateTotal().toLocaleString()}</Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="center">
              <Typography>Tax (35%)</Typography>
            </TableCell>
            <TableCell align="center">
              <Typography>{Number(calculateTax()).toLocaleString()}</Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="center">
              <Typography>VAT (15%)</Typography>
            </TableCell>
            <TableCell align="center">
              <Typography>{Number(calculateVat()).toLocaleString()}</Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="center">
              <Typography>Service charge (1%)</Typography>
            </TableCell>
            <TableCell align="center">
              <Typography>{calculateServiceCharge().toLocaleString()}</Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="center">
              <Typography>Total</Typography>
            </TableCell>
            <TableCell align="center">
              <Typography> {calculateGrandTotal().toLocaleString()}</Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="center">
              <Typography>Total discount</Typography>
            </TableCell>
            <TableCell align="center">{'-'}</TableCell>
          </TableRow>
         
          <TableRow>
            <TableCell align="center">
              <Typography>payable</Typography>
            </TableCell>
            <TableCell align="center">
              <Typography> {calculateGrandTotal().toLocaleString()}</Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="center">
              <Typography>Currency</Typography>
            </TableCell>
            <TableCell align="center">
              <Typography>ETB</Typography>
            </TableCell>
          </TableRow>
          Amounts in word:
        </TableBody>
      </Table>
    </TableContainer>
  </div>
        </Grid>
      </Grid>
     
      );
    }
  };

  const calculateTotal = (): number => {
    let total = 0;
    formattedData.forEach((row) => {
      total += parseFloat(row[6]);
    });
    const result = total + shippingCost;
    return result;
  };
 
  const calculateTax = (): number => {
    const taxRate = 0.35; // 10% tax rate
    const total = calculateTotal();
    const tax = total * taxRate;
    return tax;
  };
  const calculateVat = (): number => {
    const vatRate = 0.15; // 10% tax rate
    const total = calculateTotal();
    const vat = total * vatRate;
    return vat;
  };
  const calculateServiceCharge = (): number => {
    const serviceChargeRate = 0.01; // 10% tax rate
    const total = calculateTotal();
    const serviceCharge = total * serviceChargeRate;
    return serviceCharge;
  };
  const calculateGrandTotal = (): number => {
    const total = calculateTotal();
    const tax = calculateTax();
    const vat = calculateVat();
    const serviceCharge = calculateServiceCharge();
    const grandTotal = total + tax + vat + serviceCharge ;
    return grandTotal;
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
    <>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {formattedData.length > 0 && (
        <>
       <Grid item xs={12} sm={12}>
       <PageHeader
    title="Sent Quotation"
    icon={<RequestQuote/>}
    imageSrc="tra.jpg"
    />
        <Paper elevation={3} sx={{ padding: '20px' }}>
        <div style={{
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '10px',
}}>
  <div>
    <Typography> {"Quotation: Purchase Request"}</Typography>
  </div>
  <div>
    <Typography>Category: {"Electronics"}</Typography>
  </div>
  <div>
  <Typography>Customer Name: {customerName}</Typography>
  </div>
</div>
<div style={{
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '1',
}}>
  <div>
  <Typography>Reference Number: {referenceNumber}</Typography>
  </div>
  <div>
  <Typography>Requested Date: {requestedDate}</Typography>
  </div>
  <div>
  <Typography>Due Date: {currentDate}</Typography>
  </div>
</div>
</Paper>
        </Grid>
          <ThemeProvider theme={theme}>
          <MUIDataTable
            title="Revised RFQ"
            data={formattedData}
            columns={columns}
            options={options}
          />
          </ThemeProvider>
<Box mt={3}>
  <Grid container spacing={2} justifyContent="center">
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Typography variant="body1" sx={{ paddingTop: '10px', paddingBottom: '10px', marginBottom: '10px' }}>
            Sent Approved By : {sentBy}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="body1" sx={{ paddingTop: '10px', paddingBottom: '10px', marginBottom: '10px' }}>
            Availability Date of Price :{estimatedDelivery}
          </Typography>
        
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="body1" sx={{ paddingTop: '10px', paddingBottom: '10px' }}>
            Remark : {remark}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
</Box>
        </>
      )}
    </>
  );
};

export default SendDetail;