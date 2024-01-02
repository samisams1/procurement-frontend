import React, { useState } from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { Typography, Box, TextField, Grid } from '@mui/material';
import Button from '../../components/Button';
import { Form, useForm } from '../../components/useForm';

const GET_PURCHASE_REQUEST = gql`
  query GetPurchaseRequestById($id: Float!) {
    purchaseRequest(id: $id) {
      id
      products {
        id
        title
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
      shippingPrice: parseFloat(values.shippingPrice),
      productPrices: Object.keys(prices).map((key) => ({
        productId: parseInt(key),
        price: parseFloat(prices[key]),
      })),
    };
  
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
            {purchaseRequest.products.map((product: Product) => (
              <Box key={product.id} mt={2}>
                <Typography>{product.title}</Typography>
                <TextField
                  type="number"
                  label="Price"
                  value={prices[product.id] || ''}
                  onChange={(e) => handlePriceChange(product.id, e)}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                />
              </Box>
            ))}
            <Box mt={2}>
          <Form onSubmit={handleSubmit}>
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
            <Grid item xs={12}>
              <Button type="submit" text="Create Quotation" />
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