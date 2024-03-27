import { gql, useMutation, useQuery } from '@apollo/client';
import { Box, Grid, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableRow, TextField, ThemeProvider, Typography, createTheme } from '@mui/material';
import MUIDataTable, { MUIDataTableOptions } from 'mui-datatables';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Form } from '../../components/useForm';
import { Cancel, RequestQuote, Save } from '@mui/icons-material';
import Button from '../../components/Button';
import Input from '../../components/Input';
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
const UPDATE_QUOTATION_MUTATION = gql`
  mutation UpdateQuotation($id: Int!, $input: UpdateQuotationInput!) {
    updateQuotation(id: $id, input: $input) {
      id
      status
      productPrices {
        id
        price
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

const RevisedRfq = () => {
  const location = useLocation();
  const id = location.state?.id;
  const qId = location.state.qId;
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

 // const {quotations, setQuotations } = useQuotation();
  const [prices] = useState<{ [key: string]: string }>({});
  const [disCountPrice] = useState<{ [key: string]: string }>({});
 
  
  //const [otherPayment,setOtherPayment] =useState<number>(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');  

  const [formattedData, setFormattedData] = useState<any[]>([]);
  
  const currentDate = new Date().toLocaleDateString();
  const [updateQuotation] = useMutation(UPDATE_QUOTATION_MUTATION);

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
  const [remark, setRemark] = useState(data?.quotationByRequestIdAdSupplierId[0]?.quotation.remark || '');
const [sentBy, setSentBy] = useState(data?.quotationByRequestIdAdSupplierId[0]?.quotation.sentBy || '');
const [estimatedDelivery, setEstimatedDelivery] = useState(data?.quotationByRequestIdAdSupplierId[0]?.quotation.availabilityDate || '');

const handleRemarkChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRemark(event.target.value);
  };
  const handleSentByChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSentBy(event.target.value);
  };
 /* const handleShippingCostChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = parseFloat(event.target.value);
    setShippingCost(newValue);
  }; */
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
      name: 'U. Price',
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
      name: 'Subtotal',
      options: {
        display: true,
      },
    },
  ];
  const renderDateOptions = () => {
    const options = [];
    for (let i = 1; i <= 30; i++) {
      options.push(
        <MenuItem key={i} value={i.toString()}>
         The price is valide for    {" " + i} {i===1? "day":"days"}
       </MenuItem>
      );
    }
    return options;
  };
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
              <Typography>Shipping Cost</Typography>
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
  /*const calculateDiscountTotal = (): number => {
    let total = 0;
    formattedData.forEach((row) => {
      total += parseFloat(row[5]);
    });
    const result = total + shippingCost;
    return result;
  };*/
  const calculateTax = (): number => {
    // Calculate tax logic goes here
    // Replace this with your actual tax calculation logic
    const taxRate = 0.35; // 10% tax rate
    const total = calculateTotal();
    const tax = total * taxRate;
    return tax;
  };
  const calculateVat = (): number => {
    // Calculate tax logic goes here
    // Replace this with your actual tax calculation logic
    const vatRate = 0.15; // 10% tax rate
    const total = calculateTotal();
    const vat = total * vatRate;
    return vat;
  };
  const calculateServiceCharge = (): number => {
    // Calculate tax logic goes here
    // Replace this with your actual tax calculation logic
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
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const input = {
      status: "quoted",
      remark:remark,
      sentBy:sentBy,
      shippingPrice: shippingCost,
     productPrices: Object.keys(prices).map((key) => ({
        id: parseInt(key),
        price: parseFloat(prices[key]),
        disCountPrice: parseFloat(disCountPrice[key]),
      })),
      availabilityDate:Number(estimatedDelivery),
    };
    console.log('Samisams:', input);
    try {
    await updateQuotation({ variables: { id:qId, input } });
      //qRefetch();
      //qPendingRefetch();
      //setQuotations(quotationData?.quotationBydSupplierId);
     // setQuotations(quotationQuetedData?.quotationBydSupplierId);
    //  const quotation = response?.data;
      setSuccessMessage('Quotation send successfully!');
      setErrorMessage('');
      setTimeout(() => {
        setSuccessMessage('');
      }, 1500);
     // navigate('/purchaseRequests')
    } catch (error) {
      console.error('Mutation error:', error);
      setErrorMessage('Failed to update the quotation.');
      setSuccessMessage('');
  
      setTimeout(() => {
        setErrorMessage('');
      }, 1500);
    }
  };
    const hadleSeveAsDraftAndCancel = async (status:string): Promise<void> => {
    const input = {
      status: status,
      remark:remark,
      sentBy:sentBy,
      shippingPrice: shippingCost,
      productPrices: Object.keys(prices).map((key) => ({
        id: parseInt(key),
        price: parseFloat(prices[key]),
        disCountPrice: parseFloat(disCountPrice[key]),
      })),
      availabilityDate:Number(estimatedDelivery),
    };
    console.log('Quotation:', input);
    try {
       await updateQuotation({ variables: { id:qId, input } });
     // qRefetch();
      //qPendingRefetch();
      //setQuotations(quotationData?.quotationBydSupplierId);
      //setQuotations(quotationQuetedData?.quotationBydSupplierId);
     // const quotation = response?.data;
      //console.log('Quotation:', quotations);
      setSuccessMessage('Quotation send successfully!');
      setErrorMessage('');
      //await refetch();
      setTimeout(() => {
        setSuccessMessage('');
      }, 15000);
      //navigate('/purchaseRequests')
    } catch (error) {
      console.error('Mutation error:', error);
      setErrorMessage('Failed to update the quotation.');
      setSuccessMessage('');
  
      setTimeout(() => {
        setErrorMessage('');
      }, 15000);
  }
}
const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEstimatedDelivery(event.target.value);
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
    title="Drafted Quotation"
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
  <Form onSubmit={handleSubmit}>
  <Grid container spacing={2} justifyContent="center">
  <Grid container spacing={3}>
  <Grid item xs={12} sm={4}>
    <Input
      label="Sent Approved By"
      placeholder="Please specify approved By"
      value={sentBy}
      fullWidth
      sx={{ paddingTop: '10px', paddingBottom: '10px', marginBottom: '10px' }}
      onChange={handleSentByChange}
    />
  </Grid>
  <Grid item xs={12} sm={4}>
    <TextField
      select
      required
      label="Availability Date of Price"
      value={estimatedDelivery}
      onChange={handleDateChange}
      fullWidth
      sx={{ paddingTop: '10px', paddingBottom: '10px', marginBottom: '10px' }}
    >
      { renderDateOptions()}
    </TextField>
  </Grid>
  <Grid item xs={12} sm={4}>
    <Input
      label="Remark"
      value={remark}
      placeholder="Please enter Remark"
      fullWidth
      sx={{ paddingTop: '10px', paddingBottom: '10px' }}
      onChange={handleRemarkChange}
    />
  </Grid>
</Grid>
  <Grid item xs={12} textAlign="center">
    {!successMessage && !errorMessage && (
    <div>
        <Grid item xs={12} sm={12}>
        <Paper elevation={3} sx={{ padding: '20px' }}>
  <Grid item xs={12} sm={12} style={{ display: 'flex', justifyContent: 'center' }}>
    <div style={{ border: '1px solid black', padding: '10px' }}>
    I declare that the information mentioned above is true and correct to the best of my knowledge.
    </div>
  </Grid>
<div>
  <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
    <Button
      variant="outlined"
      color="primary"
      type="submit"
      startIcon={<Save />}
      //onClick={handleAddTitle}
      style={{ whiteSpace: 'nowrap', backgroundColor: 'green', color: '#ffffff' }}
      text = "Send Quotation"
    >
      
    </Button>
    <Button
      variant="outlined"
      //color="Secodary"
      startIcon={<Cancel />}
      onClick={() => hadleSeveAsDraftAndCancel('canceled')}
      style={{ whiteSpace: 'nowrap', backgroundColor: 'red', color: '#ffffff' }}
      text = "Cancel"
    >
    </Button>
  </Box>
</div>
       </Paper>
        </Grid>
    </div>
    )}
  </Grid>
</Grid>
  </Form>
</Box>
        </>
      )}
    </>
  );
};

export default RevisedRfq;