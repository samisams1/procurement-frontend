import React, { useState } from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';
import Input from '../../Input';
import { Alert, Box, MenuItem, TextField, Typography } from '@mui/material';
import { Form, useForm } from '../../useForm';
import Button from '../../Button';
import { Grid, createTheme, ThemeProvider } from '@mui/material';
import MUIDataTable, { MUIDataTableOptions } from 'mui-datatables';
import { useNavigate } from 'react-router-dom';
import { GET_QUOTATION } from '../../../graphql/quotation';
import { useQuotation } from '../../../context/quotationContext';
interface Product {
  id: number;
  uom: string | null;
  title: string;
  quantity: string;
}

interface Quotation {
  purchaseRequestId: string;
}
interface ProductPrice {
  id: number;
  createdAt: string;
  price: number;
  status: string;
  product: Product;
  quotation: Quotation;
  disCountPrice: number;
}

interface QuotationByRequestIdAdSupplierIdData {
  quotationByRequestIdAdSupplierId: ProductPrice[];
}

interface QuotationByRequestIdAdSupplierIdVariables {
  id: number | null;
  supplierId: number;
}
interface QuotationInterface {
  price: string;
  shippingPrice: string;
  discountPrices:string;
  otherPayment:string;
}
const GET_QUOTATION_QUERY = gql`
  query QuotationByRequestIdAdSupplierId($id: Int!, $supplierId: Int!) {
    quotationByRequestIdAdSupplierId(id: $id, supplierId: $supplierId) {
      id
      createdAt
      price
      status
      product {
        id
        uom
        title
        quantity
      }
      quotation {
        purchaseRequestId
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
}

const SendRfqComponent: React.FC<Props> = ({ id,qId, status, customerId, supplierId }) => {
  const [prices, setPrices] = useState<{ [key: string]: string }>({});
  const [disCountPrice, setDisCountPrices] = useState<{ [key: string]: string }>({});
  const [shippingCost, setShippingCost] = useState<number>(0);
  const [estimatedDelivery, setEstimatedDelivery] = useState('');
  const [otherPayment,setOtherPayment] =useState<number>(0);
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
  const { setQuotations } = useQuotation();

  const quotationByRequestIdAdSupplierId = data?.quotationByRequestIdAdSupplierId || [];
 
  const initialFormValues: QuotationInterface = {
    price: '0',
    shippingPrice: '0',
    discountPrices:'0',
    otherPayment:'0',
  };
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
const validate = (fieldValues: QuotationInterface = values): boolean => {
    let tempErrors: Partial<QuotationInterface> = { ...errors };
    if ('price' in fieldValues) {
      tempErrors.price = fieldValues.price !== '0' ? '' : 'This field is required.';
    }
    if ('shippingPrice' in fieldValues) {
      tempErrors.shippingPrice = fieldValues.shippingPrice !== '0' ? '' : 'This field is required.';
    }
    if ('discountPrices' in fieldValues) {
      tempErrors.discountPrices = fieldValues.discountPrices !== '0' ? '' : 'This field is required.';
    }
    if ('otherPayment' in fieldValues) {
      tempErrors.otherPayment = fieldValues.otherPayment !== '0' ? '' : 'This field is required.';
    }
    setErrors({
      ...tempErrors,
    });
    return fieldValues === values ? Object.values(tempErrors).every((x) => x === '') : false;
  };

  const { values, errors, setErrors } = useForm(
    initialFormValues,
    true,
    validate
  );
  const handlePriceChange = (productId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setPrices((prevPrices) => ({
      ...prevPrices,
      [productId]: value,
    }));
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
      shippingPrice: shippingCost,
      productPrices: Object.keys(prices).map((key) => ({
        id: parseInt(key),
        price: parseFloat(prices[key]),
        disCountPrice: parseFloat(disCountPrice[key]),
      })),
      otherPayment:otherPayment,
      availabilityDate:Number(estimatedDelivery),
    };
    console.log('Quotation:', input);
    try {
      const response = await updateQuotation({ variables: { id:qId, input } });
      qRefetch();
      qPendingRefetch();
      setQuotations(quotationData?.quotationBydSupplierId);
      setQuotations(quotationQuetedData?.quotationBydSupplierId);
      const quotation = response?.data;
      console.log('Quotation:', quotation);
      setSuccessMessage('Quotation send successfully!');
      setErrorMessage('');
      await refetch();
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      navigate('/purchaseRequests')
    } catch (error) {
      console.error('Mutation error:', error);
      setErrorMessage('Failed to update the quotation.');
      setSuccessMessage('');
  
      setTimeout(() => {
        setErrorMessage('');
      }, 5000);
    }
  };
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
    subtotal += shippingCost;
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
          type="number"
          placeholder="Please Enter Price"
          //value={prices[quotation.id.toString()] || ''}
          value={prices[quotation.id.toString()] || quotation.price}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handlePriceChange(quotation.id.toString(), e)
          }
        />,
        <Input
          type="number"
          placeholder="Please Enter discount"
          value={disCountPrice[quotation.id.toString()] || quotation.discount}
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
          <MUIDataTable
            title="Quotation products"
            data={tableData}
            columns={columns}
            options={options}
          />
       <Box mt={2}>
  <Form onSubmit={handleSubmit}>
  <Grid container spacing={2} justifyContent="center">
  <Grid item xs={12} md={6}>
  <Grid container spacing={2}>
    <Grid item xs={12}>
      <TextField
        type="number"
        label="Shipping Cost"
        placeholder="Enter Shipping Cost"
        value={shippingCost.toString()}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setShippingCost(parseFloat(e.target.value))
        }
        fullWidth
        sx={{ paddingTop: '10px',paddingBottom: '10px',}}
      />
      <TextField
        type="number"
        label="Other Payment"
        placeholder="Enter Other Payment"
        value={otherPayment.toString()}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setOtherPayment(parseFloat(e.target.value))
        }
        fullWidth
        sx={{ paddingTop: '10px',paddingBottom: '10px',}}
      />
      <TextField
        select
        required
        label="Availability Date of Price"
        value={estimatedDelivery}
        onChange={handleDateChange}
        fullWidth
        sx={{ paddingTop: '20px' }}
      >
        {renderDateOptions()}
      </TextField>
    
      <Typography variant="subtitle1" align="right" fontWeight="bold">
        Subtotal: {calculateSubtotal()} Birr
      </Typography>
      <Typography variant="subtitle1" align="right" fontWeight="bold">
        Tax: {tax} Birr
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
         Payable amount  : {Number(grandTotal)  + Number(tax)  -  Number(calculateDisCountSubtotal())} Birr
      </Typography>
    </Grid>
  </Grid>
</Grid>
  <Grid item xs={12} textAlign="center">
    {!successMessage && !errorMessage && (
      <Button variant="contained" type="submit" size="large"  text= "  Send Quotation">
        Send Quotation
      </Button>
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