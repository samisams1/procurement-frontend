import React, { useState } from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';
import Input from '../../Input';
import { Alert, Box, Button, MenuItem, Paper, TextField, ThemeProvider, Typography, createTheme } from '@mui/material';
import {  Table, TableBody, TableCell, TableContainer, TableRow,Checkbox } from '@mui/material';

import { Form } from '../../useForm';
//import Button from '../../Button';
import { Grid } from '@mui/material';
import MUIDataTable, { MUIDataTableOptions } from 'mui-datatables';
import { useNavigate } from 'react-router-dom';
import { GET_QUOTATION } from '../../../graphql/quotation';
import { useQuotation } from '../../../context/quotationContext';
import { Cancel, Drafts, RequestQuote, Save } from '@mui/icons-material';
import numberToWords from 'number-to-words';
import { useReactToPrint } from 'react-to-print';
import '../../PrintPage.css';
import PageHeader from '../../PageHeader';
interface Product {
  id: number;
  uom: string | null;
  title: string;
  quantity: string;
}

interface Quotation {
  purchaseRequestId: string;
  sentBy:string;
  remark:string;
  availabilityDate:string;
  shippingPrice:number;
}
interface ProductPrice {
  id: number;
  createdAt: string;
  price: string;
  status: string;
  product: Product;
  quotation: Quotation;
  disCountPrice: number;
  remark:string;
  sentBy:string;
  
}

interface QuotationByRequestIdAdSupplierIdData {
  quotationByRequestIdAdSupplierId: ProductPrice[];
}

interface QuotationByRequestIdAdSupplierIdVariables {
  id: number | null;
  supplierId: number;
}

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
interface Props {
  id: number;
  qId: number;
  supplierId: number;
  status: string;
  customerId: string;
  referenceNumber:string;
  requestedDate:string;
  customerName:string;
  category:string;

}

const SendRfqComponent: React.FC<Props> = ({ id,qId, status, customerId, supplierId,referenceNumber,requestedDate,customerName,category }) => {
  const {quotations, setQuotations } = useQuotation();
  const [prices, setPrices] = useState<{ [key: string]: string }>({});
  const [disCountPrice, setDisCountPrices] = useState<{ [key: string]: string }>({});
  const [isSelectedMap, setIsSelectedMap] = useState<{ [key: number]: boolean }>({});
  const handleCheckboxChange = (productId: number) => {
    setIsSelectedMap(prevState => ({
      ...prevState,
      [productId]: !prevState[productId]
    }));
  };
  //const [otherPayment,setOtherPayment] =useState<number>(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');  
  const printRef = React.useRef(null);
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });
  const navigate = useNavigate();
  const { loading, error, data,refetch } = useQuery<
    QuotationByRequestIdAdSupplierIdData,
    QuotationByRequestIdAdSupplierIdVariables
  >(GET_QUOTATION_QUERY, {
    variables: { id,  supplierId },
  });
  const { data: quotationData, refetch: qRefetch } = useQuery(GET_QUOTATION, {
    variables: { supplierId: Number(supplierId), status: "pending" }, // Set status to "pending" or "quoted"
  });
  const { data: quotationQuetedData, refetch: qPendingRefetch } = useQuery(GET_QUOTATION, {
    variables: { supplierId: Number(supplierId), status: "quoted" }, // Set status to "pending" or "quoted"
  });
  const [updateQuotation] = useMutation(UPDATE_QUOTATION_MUTATION);
 
console.log("setQuotations")
const currentDate = new Date().toLocaleDateString();
  const quotationByRequestIdAdSupplierId = data?.quotationByRequestIdAdSupplierId || [];
//const availabilityDate = quotationByRequestIdAdSupplierId[0]?.avalabilityDate;
console.log(quotationByRequestIdAdSupplierId)
const [remark, setRemark] = useState(quotationByRequestIdAdSupplierId[0]?.quotation.remark || '');
const [sentBy, setSentBy] = useState(quotationByRequestIdAdSupplierId[0]?.quotation.sentBy || '');
const [estimatedDelivery, setEstimatedDelivery] = useState(quotationByRequestIdAdSupplierId[0]?.quotation.availabilityDate || '');
const [shippingCost, setShippingCost] = useState<number>(quotationByRequestIdAdSupplierId[0]?.quotation.shippingPrice || 0);
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
  const handleRemarkChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRemark(event.target.value);
  };
  const handleSentByChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSentBy(event.target.value);
  };
  const handlePriceChange = (productId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
  
    setPrices((prevPrices) => {
      if (value === '') {
        const { [productId]: valueToRemove, ...newPrices } = prevPrices;
        return newPrices;
      } else if (/^\d+$/.test(value)) {
        return { ...prevPrices, [productId]: value };
      } else {
        return { ...prevPrices, [productId]: '' };
      }
    });
  };
  const handlePriceDiscountChange = (productId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setDisCountPrices((prevPrices) => ({
      ...prevPrices,
      [productId]: value,
    }));
  };
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEstimatedDelivery(event.target.value);
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
      qRefetch();
      qPendingRefetch();
      setQuotations(quotationData?.quotationBydSupplierId);
      setQuotations(quotationQuetedData?.quotationBydSupplierId);
    //  const quotation = response?.data;
      console.log('Quotation:', quotations);
      setSuccessMessage('Quotation send successfully!');
      setErrorMessage('');
      await refetch();
      setTimeout(() => {
        setSuccessMessage('');
      }, 1500);
      navigate('/purchaseRequests')
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
      qRefetch();
      qPendingRefetch();
      setQuotations(quotationData?.quotationBydSupplierId);
      setQuotations(quotationQuetedData?.quotationBydSupplierId);
     // const quotation = response?.data;
      console.log('Quotation:', quotations);
      setSuccessMessage('Quotation send successfully!');
      setErrorMessage('');
      await refetch();
      setTimeout(() => {
        setSuccessMessage('');
      }, 15000);
      navigate('/purchaseRequests')
    } catch (error) {
      console.error('Mutation error:', error);
      setErrorMessage('Failed to update the quotation.');
      setSuccessMessage('');
  
      setTimeout(() => {
        setErrorMessage('');
      }, 15000);
  }
}
  const calculateSubtotalRow = (price: number, quantity: string) => {
    const parsedQuantity = parseFloat(quantity);
    if (isNaN(price)) {
      return 0;
    }
    return parsedQuantity * price;
  };
 
  const calculateSubtotal = () => {
    let subtotal = 0;
  
    quotationByRequestIdAdSupplierId.forEach((quotation) => {
      console.log("sami kaba")
      const price = parseFloat(prices[quotation.id.toString()]) || 0;
      const quantity = parseFloat(quotation.product.quantity) || 0;
      subtotal += price * quantity;
    });
  
    if (Number.isFinite(shippingCost)) {
      subtotal += shippingCost;
    }
  
    return subtotal.toFixed(2);
  };
  const calculateDisCountSubtotal = () => {
    let subtotal = 0;
    quotationByRequestIdAdSupplierId.forEach((quotation) => {
      const discountPrice = parseFloat(quotation.product.quantity) || 0;
      const quantity = parseFloat(disCountPrice[quotation.id.toString()]) || 0;
      subtotal += discountPrice * quantity;
    });
    return subtotal.toFixed(2);
  };
  const calculateTax = (grandTotal: number, taxRate: number): string => {
    const taxAmount = grandTotal * taxRate;
    return taxAmount.toFixed(2);
  };
  
  const convertToWords = (num: number): string => {
    return numberToWords.toWords(num);
  };
  const sub_total = Number(calculateSubtotal())
  const taxRate: number = 0.35; // Assuming the tax rate is 8%
  const vatRate: number = 0.15;
  const servieRate = 0.01;
  const tax: string = calculateTax(sub_total, taxRate);
  const vat:string = calculateTax(sub_total, vatRate);
  const serviceCharge:string = calculateTax(sub_total, servieRate);

  const total = Number(sub_total)  + Number(tax) + Number(serviceCharge) + Number(vat);
 const payable =  total - Number(calculateDisCountSubtotal());
  console.log(tax); // Output the calculated tax amount
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  const columns = [
    { name: 'SN', options: { filter: false, sort: false } },
    { name: 'Select', options: { filter: false, sort: false } },
    {
      name: 'Product/Service description',
      options: {
        display: true,
      },
    },
    {
      name: 'Item code',
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
      },
    },
    {

      name: 'Disc',
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
  const tableData = quotationByRequestIdAdSupplierId.map((quotation: any, index: number) => {
    return [
      index + 1,
      <Checkbox
        checked={isSelectedMap[quotation.product.id]}
        onChange={() => handleCheckboxChange(quotation.product.id)}
        key={quotation.product.id}
      />,
      quotation.product.title,
      quotation.product.code,
      quotation.product.uom,
    
    <TableCell sx={{ padding: '4px', height: '32px' }}>
    <TextField
          placeholder="Please Enter the Price"
          value={prices[quotation.id.toString()] !== undefined ? prices[quotation.id.toString()] : quotation.price || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePriceChange(quotation.id.toString(), e)}
         //  error={itemCodeErrors[index] !== ''}
           fullWidth
           InputLabelProps={{
             shrink: true,
           }}
           InputProps={{
             disableUnderline: true,
             style: { height: '30px', paddingLeft: '1px',width:'200px' }
           }}
           FormHelperTextProps={{
             children: "* Required field"
           }}
         />
    </TableCell>,
      <TextField
        placeholder="Please Enter Disc"
        value={disCountPrice[quotation.id.toString()] || quotation.disCountPrice}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePriceDiscountChange(quotation.id.toString(), e)}
        fullWidth
        InputLabelProps={{
          shrink: true,
        }}
        InputProps={{
          disableUnderline: true,
          style: { height: '30px', paddingLeft: '1px',width:'200px' }
        }}
        FormHelperTextProps={{
          children: "* Required field"
        }}
      />,
      quotation.product.quantity,
      calculateSubtotalRow(parseFloat(prices[quotation.id.toString()] || ''), quotation.product.quantity),
    ];
  });
  
  const options: MUIDataTableOptions = {
    filter: true,
    download: true,
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
              <Typography>{sub_total}</Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="center">
              <Typography>Tax (35%)</Typography>
            </TableCell>
            <TableCell align="center">
              <Typography>{Number(tax).toLocaleString()}</Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="center">
              <Typography>VAT (15%)</Typography>
            </TableCell>
            <TableCell align="center">
              <Typography>{Number(vat).toLocaleString()}</Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="center">
              <Typography>Service charge (1%)</Typography>
            </TableCell>
            <TableCell align="center">
              <Typography>{serviceCharge.toLocaleString()}</Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="center">
              <Typography>Total</Typography>
            </TableCell>
            <TableCell align="center">
              <Typography> {total.toLocaleString()}</Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="center">
              <Typography>Total discount</Typography>
            </TableCell>
            <TableCell align="center">{calculateDisCountSubtotal().toLocaleString()}</TableCell>
          </TableRow>
         
          <TableRow>
            <TableCell align="center">
              <Typography>payable</Typography>
            </TableCell>
            <TableCell align="center">
              <Typography> {payable.toLocaleString()}</Typography>
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
          Amounts in word: <span style={{ color: 'red' }}>{convertToWords(payable)}</span>
        </TableBody>
      </Table>
    </TableContainer>
  </div>
        </Grid>
      </Grid>
     
      );
    }
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
     <div ref={printRef} className="print-content">
    <Grid container spacing={3} >
      <Grid item xs={12}>
      <PageHeader
    title="Send Quotation"
    icon={<RequestQuote/>}
    imageSrc="tra.jpg"
    />
      <Grid>
      {successMessage && (
      <Alert variant="filled" severity="success" style={{ marginTop: 10 }}>
        {successMessage}
      </Alert>
    )}
    {errorMessage && (
      <Alert variant="filled" severity="error" style={{ marginTop: 10 }}>
        {errorMessage}
      </Alert>
    )}
      </Grid>
      <Grid container spacing={2}>
  <Grid item xs={12} sm={4}>
    <Paper elevation={3} sx={{ padding: '20px' }}>
      <div>
        <Typography>Quotation: Purchase Request</Typography>
      </div>
      <div>
        
        <Typography>Reference Number: {referenceNumber}</Typography>
      </div>
     
    </Paper>
  </Grid>
  <Grid item xs={12} sm={4}>
    <Paper elevation={3} sx={{ padding: '20px' }}>
      <div>
      <Typography>Category: {category}</Typography>
      </div>
      <div>
        <Typography>Requested Date: {requestedDate}</Typography>
      </div>
    </Paper>
  </Grid>
  <Grid item xs={12} sm={4}>
    <Paper elevation={3} sx={{ padding: '20px' }}>
    <div>
        <Typography>Customer Name: {customerName}</Typography>
      </div>
    <div>
        <Typography>Due Date: {currentDate}</Typography>
      </div>
    </Paper>
  </Grid>
  <Button onClick={handlePrint} className="no-print">Print</Button>
</Grid>
        <ThemeProvider theme={theme}>
          <MUIDataTable
            title="Quotation products"
            data={tableData}
            columns={columns}
            options={options}
          />
          </ThemeProvider>
          <Box mt={2} sx={{ padding: { xs: '10px', sm: '20px' } }}>
  <Form onSubmit={handleSubmit}>
    <Grid container spacing={2} justifyContent="center">
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Input
            label="Sent Approved By"
            placeholder="Please specify approved By"
            value={sentBy}
            fullWidth
            required
            sx={{
              paddingTop: { xs: '10px', sm: '10px' },
              paddingBottom: { xs: '10px', sm: '10px' },
              marginBottom: '10px'
            }}
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
            sx={{
              paddingTop: { xs: '10px', sm: '10px' },
              paddingBottom: { xs: '10px', sm: '10px' },
              marginBottom: '10px'
            }}
          >
            {renderDateOptions()}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Input
            label="Remark"
            value={remark}
            placeholder="Please enter Remark"
            fullWidth
            sx={{
              paddingTop: { xs: '10px', sm: '10px' },
              paddingBottom: { xs: '10px', sm: '10px' }
            }}
            onChange={handleRemarkChange}
          />
        </Grid>
        <Grid sx={{ padding: { xs: '10px', sm: '20px' }, display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
  I declare that the information mentioned above is true and correct to the best of my knowledge.
</Grid>
      </Grid>
      <Grid item xs={12} textAlign="center">
        {!successMessage && !errorMessage && (
          <div>
            <Grid item xs={12} sm={12}>
              <Paper elevation={3} sx={{ padding: '20px' }}>
                <div>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: { xs: 'center', sm: 'space-between' },
                      gap: '10px',
                      flexWrap: 'wrap'
                    }}
                    className="no-print"
                  >
                    <Button
                      variant="outlined"
                      color="primary"
                      type="submit"
                      startIcon={<Save />}
                      style={{
                        whiteSpace: 'nowrap',
                        backgroundColor: 'green',
                        color: '#ffffff'
                      }}
                    >
                      Send Quotation
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<Drafts />}
                      onClick={() => hadleSeveAsDraftAndCancel('draft')}
                      style={{
                        whiteSpace: 'nowrap',
                        backgroundColor: 'gray',
                        color: '#ffffff'
                      }}
                    >
                      Save as Draft
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Cancel />}
                      onClick={() => hadleSeveAsDraftAndCancel('canceled')}
                      style={{
                        whiteSpace: 'nowrap',
                        backgroundColor: 'red',
                        color: '#ffffff'
                      }}
                    >
                      Cancel
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
</Grid>
    </Grid>
    </div>

  );
}; 
export default SendRfqComponent;