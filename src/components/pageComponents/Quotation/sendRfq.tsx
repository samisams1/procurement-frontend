import React, { useState } from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';
import Input from '../../Input';
import { Alert, Box, TextField, Typography } from '@mui/material';
import { Form, useForm } from '../../useForm';
import Button from '../../Button';
import { Grid, createTheme, ThemeProvider } from '@mui/material';
import MUIDataTable, { MUIDataTableOptions } from 'mui-datatables';
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
  supplierId: number;
  status: string;
  customerId: string;
}

const SendRfqComponent: React.FC<Props> = ({ id, status, customerId, supplierId }) => {
  const [prices, setPrices] = useState<{ [key: string]: string }>({});
  const [shippingCost, setShippingCost] = useState<number>(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');  
  const { loading, error, data,refetch } = useQuery<
    QuotationByRequestIdAdSupplierIdData,
    QuotationByRequestIdAdSupplierIdVariables
  >(GET_QUOTATION_QUERY, {
    variables: { id,  supplierId },
  });
  const [updateQuotation] = useMutation(UPDATE_QUOTATION_MUTATION);
 
  const quotationByRequestIdAdSupplierId = data?.quotationByRequestIdAdSupplierId || [];
 
  const initialFormValues: QuotationInterface = {
    price: '0',
    shippingPrice: '0',
  };

const validate = (fieldValues: QuotationInterface = values): boolean => {
    let tempErrors: Partial<QuotationInterface> = { ...errors };
    if ('price' in fieldValues) {
      tempErrors.price = fieldValues.price !== '0' ? '' : 'This field is required.';
    }
    if ('shippingPrice' in fieldValues) {
      tempErrors.shippingPrice = fieldValues.shippingPrice !== '0' ? '' : 'This field is required.';
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
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const input = {
      status: "quoted",
      shippingPrice: shippingCost,
      productPrices: Object.keys(prices).map((key) => ({
        id: parseInt(key),
        price: parseFloat(prices[key]),
      })),
    };
    console.log('Quotation:', input);
    try {
      const response = await updateQuotation({ variables: { id, input } });
      const quotation = response.data;
      console.log('Quotation:', quotation);
      setSuccessMessage('Quotation updated successfully!');
      setErrorMessage('');
      await refetch();
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
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
  const calculateTax = (grandTotal: number, taxRate: number): string => {
    const taxAmount = grandTotal * taxRate;
    return taxAmount.toFixed(2);
  };
  
  const taxRate: number = 0.08; // Assuming the tax rate is 8%
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
    {
      name: 'Status',
      options: {
        display: true,
      },
    },
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
          value={prices[quotation.id.toString()] || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handlePriceChange(quotation.id.toString(), e)
          }
        />,
        quotation.product.quantity,
        calculateSubtotalRow(
          parseFloat(prices[quotation.id.toString()] || ''),
          quotation.product.quantity
        ),
        quotation.status === 'pending' ? (
          <span style={{ color: 'red' }}>{quotation.status}</span>
        ) : (
          <span style={{ color: 'green' }}>{quotation.status}</span>
        ),
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
        <Typography variant="subtitle1" align="right" fontWeight="bold">Shipping Cost:</Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          type="number"
          label="Shipping Cost"
          placeholder="Enter Shipping Cost"
          value={shippingCost.toString()}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setShippingCost(parseFloat(e.target.value))
          }
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Typography variant="subtitle1" align="right" fontWeight="bold">Tax:</Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <Typography fontWeight="bold">{tax} Birr</Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <Typography variant="subtitle1" align="right" fontWeight="bold"> Subtotal:</Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <Typography fontWeight="bold">{calculateSubtotal()} Birr</Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <Typography variant="subtitle1" align="right" fontWeight="bold">Grand Total:</Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <Typography fontWeight="bold">{grandTotal} Birr</Typography>
      </Grid>
      <Grid item xs={12} textAlign="center">
      {!successMessage && !errorMessage &&   <Button variant="contained" type="submit" size="large"  Send text=  "Quotation"/>}
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