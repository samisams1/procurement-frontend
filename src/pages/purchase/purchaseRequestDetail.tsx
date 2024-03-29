import React, { useState } from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { Typography, Box, TextField, Grid, Table, TableHead, TableRow, TableCell, TableBody, Input } from '@mui/material';
import Button from '../../components/Button';
import { Form, useForm } from '../../components/useForm';

const GET_PURCHASE_REQUEST = gql`
  query GetPurchaseRequestById($id: Float!) {
    purchaseRequest(id: $id) {
      id
      products {
        id
        title
        code
        partNumber
        uom
        quantity
        mark
        Description
        manufacturer
        model
      }
      suppliers {
        id
        user {
          id
          username
        }
      }
    }
  }
`;

const CREATE_QUOTATION = gql`
mutation CreateQuotation($input: CreateQuotationInput!) {
  createQuotation(input: $input) {
    id
    supplierId
    customerId
  }
}
`;


interface PurchaseRequestData {
  purchaseRequest: {
    id: string;
    products: {
      id: string;
      title: string;
      code:string;
      partNumber  :string;
      uom :string;
      quantity :number;
      mark  :string;
      description :string;
      manufacturer  :string;
      model  :string;
    }[];
    suppliers: {
      id: string;
      user: {
        id: string;
        username: string;
      };
    }[];
  };
}

interface QuotationInterface {
  price: string;
  shippingPrice: string;
}

interface Product {
  id: string;
  title: string;
  code:string;
      partNumber  :string;
      uom :string;
      quantity :number;
      mark  :string;
      description :string;
      manufacturer  :string;
      model  :string;
}

const PurchaseRequestDetail: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const [prices, setPrices] = useState<{ [key: string]: string }>({});

  const [createQuotation] = useMutation(CREATE_QUOTATION);
  
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { loading, error, data } = useQuery<PurchaseRequestData>(GET_PURCHASE_REQUEST, {
    variables: { id: parseFloat(id || '0') },
  });

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

  const { values, errors, setErrors, handleInputChange, resetForm } = useForm(
    initialFormValues,
    true,
    validate
  );

 const handlePriceChange = (productId: string, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  setPrices((prevPrices) => ({
    ...prevPrices,
    [productId]: (event.target as HTMLInputElement).value,
  }));
};
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
 
  const { purchaseRequest } = data!;
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const input = {
      supplierId: 1, // Replace with the actual supplier ID
      customerId: 1, // Replace with the actual customer ID
      status:"replaed",
      shippingPrice: parseFloat(values.shippingPrice),
      productPrices: Object.keys(prices).map((key) => ({
        productId: parseInt(key),
        price: parseFloat(prices[key]),
      })),
    };
  console.log(input)
    try {
      const response = await createQuotation({ variables: { input } });
      const quotation = response.data.createQuotation;
  
      setSuccessMessage('Quotation created successfully!');
      resetForm();
      setPrices({});
      console.log('Quotation:', quotation);
    } catch (error) {
      setErrorMessage('Failed to create quotation');
      console.error('Mutation error:', error);
    }
  };
  return (
    <div>
      <Typography variant="h3" component="h1" align="center">
        Purchase Request Detail
      </Typography>
      <Box mt={2}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
          <Table>
  <TableHead>
    <TableRow sx={{ backgroundColor: 'primary.main' }}>
      <TableCell sx={{ padding: '4px', height: '32px' }}>Image</TableCell>
      <TableCell sx={{ padding: '4px', height: '32px' }}>Item Name</TableCell>
      <TableCell sx={{ padding: '4px', height: '32px' }}>Item Code</TableCell>
      <TableCell sx={{ padding: '4px', height: '32px' }}>Part Number</TableCell>
      <TableCell sx={{ padding: '4px', height: '32px' }}>UOM</TableCell>
      <TableCell sx={{ padding: '4px', height: '32px' }}>More</TableCell>
      <TableCell sx={{ padding: '4px', height: '32px' }}>Qty</TableCell>
      <TableCell sx={{ padding: '4px', height: '32px' }}>Price</TableCell>
      <TableCell sx={{ padding: '4px', height: '32px' }}>Sub total</TableCell>
    </TableRow>
  </TableHead>
  <TableBody>
            {purchaseRequest.products.map((product: Product) => (
             <TableRow  sx={{ height: '1px' }}>
             <TableCell sx={{  padding: '1px', height: '2px' }}>
              {product.title}
              </TableCell>
              <TableCell sx={{  padding: '1px', height: '2px' }}>
              {product.title}
              </TableCell>
              <TableCell sx={{  padding: '1px', height: '2px' }}>
              {product.code}
              </TableCell>
              <TableCell sx={{  padding: '1px', height: '2px' }}>
              {product.partNumber}
              </TableCell>
              <TableCell sx={{  padding: '1px', height: '2px' }}>
              {product.uom}
              </TableCell>
              <TableCell sx={{  padding: '1px', height: '2px' }}>
              {product.quantity}
              </TableCell>
              <TableCell sx={{  padding: '1px', height: '2px' }}>
              {product.quantity}
              </TableCell>
              <TableCell sx={{  padding: '1px', height: '2px' }}>
              <Input
   type="number"
   placeholder="Please Enter Price"
   value={prices[product.id] || ''}
   onChange={(e) => handlePriceChange(product.id, e)}
/>Birr
              </TableCell>
              <TableCell sx={{  padding: '1px', height: '2px' }}>
              {Number(product.quantity) * Number(prices) }
              </TableCell>
              </TableRow>   
            
            ))}
</TableBody>
</Table>
            <Box mt={2}>
          <Form onSubmit={handleSubmit}>
            <Typography>Total 200000 Birr</Typography>
            <Typography>Vat  3000 Birr</Typography>
            <TextField
              type="number"
              label="Shipping Price"
              name="shippingPrice"
              value={values.shippingPrice}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="outlined"
            />
          
            <Typography>Total (inc,Shipping 23000 Birr)</Typography>
              <Grid item xs={12}>
              <Button type="submit" text="Send Quotation" />
            </Grid>
          </Form>    
        </Box>
        {successMessage && <div>{successMessage}</div>}
          {errorMessage && <div>{errorMessage}</div>}
          </Grid>
          
        </Grid>
        
      </Box>
    </div>
  );
};

export default PurchaseRequestDetail;