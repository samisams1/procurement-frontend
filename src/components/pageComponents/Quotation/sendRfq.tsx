import React, { useState } from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';
import Input from '../../Input';
import { Alert, Box, Button, MenuItem, Paper, TextField, Typography } from '@mui/material';
import { Form } from '../../useForm';
//import Button from '../../Button';
import { Grid, createTheme, ThemeProvider } from '@mui/material';
import MUIDataTable, { MUIDataTableOptions } from 'mui-datatables';
import { useNavigate } from 'react-router-dom';
import { GET_QUOTATION } from '../../../graphql/quotation';
import { useQuotation } from '../../../context/quotationContext';
import { Cancel, Drafts, Save } from '@mui/icons-material';
import numberToWords from 'number-to-words';
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
}

const SendRfqComponent: React.FC<Props> = ({ id,qId, status, customerId, supplierId,referenceNumber,requestedDate }) => {
  const [prices, setPrices] = useState<{ [key: string]: string }>({});
  const [disCountPrice, setDisCountPrices] = useState<{ [key: string]: string }>({});
 
  
  //const [otherPayment,setOtherPayment] =useState<number>(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');  



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
  const {quotations, setQuotations } = useQuotation();
console.log("setQuotations")

  const quotationByRequestIdAdSupplierId = data?.quotationByRequestIdAdSupplierId || [];
//const availabilityDate = quotationByRequestIdAdSupplierId[0]?.avalabilityDate;
console.log(quotationByRequestIdAdSupplierId)
const [remark, setRemark] = useState(quotationByRequestIdAdSupplierId[0]?.quotation.remark || '');
const [sentBy, setSentBy] = useState(quotationByRequestIdAdSupplierId[0]?.quotation.sentBy || '');
const [estimatedDelivery, setEstimatedDelivery] = useState(quotationByRequestIdAdSupplierId[0]?.quotation.availabilityDate || '');
const [shippingCost, setShippingCost] = useState<number>(quotationByRequestIdAdSupplierId[0]?.quotation.shippingPrice ||0);
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
      } else {
        return { ...prevPrices, [productId]: value };
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
    if (isNaN(parsedQuantity)) {
      return 0;
    }
    return price * parsedQuantity;
  };
 
  const calculateSubtotal = () => {
    let subtotal = 0;
  
    quotationByRequestIdAdSupplierId.forEach((quotation) => {
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
    subtotal += shippingCost;
    return subtotal.toFixed(2);
  };
  const calculateTax = (grandTotal: number, taxRate: number): string => {
    const taxAmount = grandTotal * taxRate;
    return taxAmount.toFixed(2);
  };
  
  /*const convertToWords = (num: number): string => {
    return numberToWords.toWords(num);
  };*/
  const taxRate: number = 0.15; // Assuming the tax rate is 8%
  const grandTotal: number = parseFloat(calculateSubtotal());
  const tax: string = calculateTax(grandTotal, taxRate);

  console.log(tax); // Output the calculated tax amount
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  const columns = [
    { name: 'SN', options: { filter: false, sort: false } },
    {
      name: 'Created At',
      options: {
        display: true,
      },
    },
    {
      name: 'Item Name',
      options: {
        display: true,
      },
    },
    {
      name: 'Price',
      options: {
        display: true,
      },
    },
    {
      name: 'Discount',
      options: {
        display: true,
      },
    },
    {
      name: 'Quantity',
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
   /* {
      name: 'Status',
      options: {
        display: true,
      },
    },*/
  ];
  const tableData = quotationByRequestIdAdSupplierId.map(
    (quotation: any, index: number) => {
      const createdAtDate = new Date(quotation.createdAt);
      const formattedDate = createdAtDate.toLocaleDateString();
      return [
        index + 1,
        formattedDate, // Converted date
        quotation.product.title,
        <Input
        productId={quotation.id.toString()}
        value={prices[quotation.id.toString()] || quotation.disCountPrice || ''}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handlePriceChange(quotation.id.toString(), e)
        }
      />,
        <Input
          placeholder="Please Enter discount"
          value={disCountPrice[quotation.id.toString()] || quotation.disCountPrice}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handlePriceDiscountChange(quotation.id.toString(), e)
          }
        />,
        quotation.product.quantity,
        calculateSubtotalRow(
          parseFloat(prices[quotation.id.toString()] || ''),
          quotation.product.quantity
        ),
     /*   quotation.status === 'pending' ? (
          <span style={{ color: 'red' }}>{quotation.status}</span>
        ) : (
          <span style={{ color: 'green' }}>{quotation.status}</span>
        ),*/
      ];
    }
  );

  const options: MUIDataTableOptions = {
    filter: true,
    download: true,
    print: true,
    search: true,
    responsive: 'vertical',
    selectableRows: 'none',
    viewColumns: true,
    rowsPerPage: 10,
    rowsPerPageOptions: [10, 25, 50],
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
    <ThemeProvider theme={theme}> 
    <Grid container spacing={3}>
    
      <Grid item xs={12}>
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
      <Grid item xs={12} sm={12}>
        <Paper elevation={3} sx={{ padding: '20px' }}>
            <div style={{
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '10px',
}}>
  
  <Typography>Reference Number : {referenceNumber} </Typography>
  <Typography>Requested  Date : {requestedDate} </Typography>
 <Typography>Due Date : </Typography>
</div>
</Paper>
        </Grid>
          <MUIDataTable
            title="Quotation products"
            data={tableData}
            columns={columns}
            options={options}
          />
       <Box mt={2}>
  <Form onSubmit={handleSubmit}>
  <Grid container spacing={2} justifyContent="center">
  <Grid item xs={12} md={12}>
  <Grid container spacing={2}>
    <Grid item xs={12}>
     <TextField
  type="number"
  label="Shipping Cost"
  placeholder="Enter Shipping Cost"
  value={Number.isFinite(shippingCost) ? shippingCost.toString() : ''}
  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
    setShippingCost(parseFloat(e.target.value))
  }
  fullWidth
  sx={{ paddingTop: '10px', paddingBottom: '10px' }}
/>
      <Typography variant="subtitle1" align="right" fontWeight="bold">
  Subtotal: {calculateSubtotal()} Birr
</Typography>
<Typography variant="subtitle1" align="right" fontWeight="bold">
Tax(15%): {tax} Birr
</Typography>
<Typography variant="subtitle1" align="right" fontWeight="bold">
 Grand Total: {Number(grandTotal)  + Number(tax)} Birr

</Typography>

      {
        Number(calculateDisCountSubtotal()) >0?  <Typography variant="subtitle1" align="right" fontWeight="bold">
        Discount : {calculateDisCountSubtotal()} Birr
     </Typography>:''
      } 
      <Typography variant="subtitle1" align="right" fontWeight="bold">
       
        
      </Typography>
  
    </Grid>
  </Grid>
</Grid>

<Grid item xs={12} sm={12}>
  <Paper elevation={3} sx={{ padding: '20px' }}>
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '10px',
    }}>
      <Input
        label="Sent Approved By"
        placeholder="Please specify approved By"
        value={sentBy}
        fullWidth
        sx={{ paddingTop: '10px', paddingBottom: '10px', marginRight: '10px' }}
        onChange={handleSentByChange}
      />
        <TextField
        select
        required
        label="Availability Date of Price"
        value={estimatedDelivery}
        onChange={handleDateChange}
        fullWidth
        sx={{ paddingTop: '10px', paddingBottom: '10px', marginRight: '10px' }}
      >
        {renderDateOptions()}
      </TextField>
      <Input
        label="Remark"
        value={remark }
        placeholder="Please enter Remark"
        fullWidth
        sx={{ paddingTop: '10px', paddingBottom: '10px', marginLeft: '10px' }}
        onChange={handleRemarkChange}
      />
    </div>
  </Paper>
</Grid>
  <Grid item xs={12} textAlign="center">
    {!successMessage && !errorMessage && (
    <div>
        <Grid item xs={12} sm={12}>
        <Paper elevation={3} sx={{ padding: '20px' }}>
            <div style={{
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '10px',
}}>
  
  <Button
    variant="outlined"
    color="primary"
    type="submit"
    startIcon={<Save />}
    //onClick={handleAddTitle}
    style={{ whiteSpace: 'nowrap',backgroundColor:"green",color:"#ffffff"}}
  >
   Send Quotation
  </Button>
  <Button
    variant="outlined"
    color="primary"
    startIcon={<Drafts />}
    onClick={()=>hadleSeveAsDraftAndCancel("draft")}
    style={{ whiteSpace: 'nowrap',backgroundColor:"gray",color:"#ffffff" }}
  >
  Seve as Drafts
  </Button>
  <Button
    variant="outlined"
    //color="Secodary"
    startIcon={<Cancel />}
    onClick={()=>hadleSeveAsDraftAndCancel("canceled")}
    style={{ whiteSpace: 'nowrap',backgroundColor:"red",color:"#ffffff" }}
  >
    Cancel
  </Button>
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
    </ThemeProvider>
  );
};

export default SendRfqComponent;