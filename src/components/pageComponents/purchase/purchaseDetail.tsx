import React, { useState } from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';
import { Typography, Box, TextField, Grid, Input } from '@mui/material';
import Button from '../../Button';
import { Form, useForm } from '../../useForm';
interface Product {
  title: string;
  quantity: number;
  partNumber: string;
  code: string;
  Description: string;
  status: string;
}

interface ProductPrice {
  id: number;
  product: Product;
  price: string;
}

interface Quotation {
  purchaseRequestId: number;
  id: string;
  customerId: number;
  supplierId: number;
  status: string;
  createdAt: string;
  productPrices: ProductPrice[];
}

interface QuotationResponse {
  quotationByRequestIdAdSupplierId: Quotation[];
}
interface QuotationInterface {
  price: string;
  shippingPrice: string;
}
/*const GET_QUOTATION = gql`
  query QuotationByRequestIdAdSupplierId($id: Float!, $supplierId: Float!) {
    quotationByRequestIdAdSupplierId(id: $id, supplierId: $supplierId) {
      purchaseRequestId
      id
      customerId
      supplierId
      status
      createdAt
      productPrices {
        id
        product {
          title
          quantity
          partNumber
          code
          Description
          status
        }
        price
      }
    }
  }
`;*/
const GET_QUOTATION = gql`
  query QuotationByRequestIdAdSupplierId($id: Float!, $supplierId: Float!) {
    quotationByRequestIdAdSupplierId(id: $id, supplierId: $supplierId) {
      purchaseRequestId
      id
      customerId
      supplierId
      status
      createdAt
      productPrices {
        id
        product {
          title
          quantity
          partNumber
          code
          Description
          status
        }
        price
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
const PurchaseDetail: React.FC<{
  id: number | null;
  status: string;
  customerId: string;
  supplierId: number;
}> = ({ id, status, customerId, supplierId }) => {

  const [prices, setPrices] = useState<{ [key: string]: string }>({});
  //const [priceError, setPriceError] = useState('');

  const [updateQuotation] = useMutation(UPDATE_QUOTATION_MUTATION);

  const { loading, error, data } = useQuery<QuotationResponse>(GET_QUOTATION, {
    variables: { id: id, supplierId: supplierId },
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

  const { values, errors, setErrors, handleInputChange } = useForm(
    initialFormValues,
    true,
    validate
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const quotations = data?.quotationByRequestIdAdSupplierId || [];
  const qId = quotations.map((p)=>p.id);
  const theStatus= quotations?.map((p)=>p.status);
  console.log(qId);

  const shippingPrice = parseFloat(values.shippingPrice);
  
  const handlePriceChange = (productId: string, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPrices((prevPrices) => ({
      ...prevPrices,
      [productId]: (event.target as HTMLInputElement).value,
    }));
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const  id = Number(qId);
    const input = {
      status:"comformed", 
     shippingPrice: parseFloat(values.shippingPrice),
     productPrices: Object.keys(prices).map((key) => ({
        id: parseInt(key),
        price: parseFloat(prices[key]),
      })),
    };
    try {
      const response = await updateQuotation({ variables: {id, input } });
      const quotation = response.data.createQuotation;
      console.log('Quotation:', quotation);
    } catch (error) {
      console.error('Mutation error:', error);
    }
  } 
  const calculateSubtotal = (): number => {
    let subtotal = 0;
    quotations.forEach((quotation: Quotation) => {
      quotation.productPrices?.forEach((productPrice: ProductPrice) => {
        const price = parseFloat(prices[String(productPrice.id)]);
        if (!isNaN(price)) {
          subtotal += price * productPrice.product.quantity;
        }
      });
    });
    return subtotal + shippingPrice;
  };
  const subtotal = calculateSubtotal();
  const tax = 0.15 * subtotal;
  const total = tax +subtotal;

  return (
<div>
{theStatus?.toString() === "comformed" ? <div>All Request are comformed! </div>:
    <div>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Part Number</th>
            <th>Code</th>
            <th>Description</th>
            <th>Status</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Subtottal</th>
          </tr>
        </thead>
        <tbody>
        {quotations?.map((quotation) =>
  quotation?.productPrices?.map((productPrice) => {
    const price = parseFloat(prices[String(productPrice.id)]);
    const subtotal = isNaN(price) ? 0 : price * productPrice.product.quantity;

    return (
      <tr key={productPrice.id}>
        <td>{productPrice.product.title}</td>
        <td>{productPrice.product.partNumber}</td>
        <td>{productPrice.product.code}</td>
        <td>{productPrice.product.Description}</td>
        <td>{productPrice.product.status}</td>
        <td>{productPrice.product.quantity}</td>
        <td>
          <Input
            type="number"
            placeholder="Please Enter Price"
            value={prices[String(productPrice.id)] || ''}
            onChange={(e) => handlePriceChange(String(productPrice.id), e)}
            
          />
        </td>
        <td>{subtotal.toFixed(2)}</td>
      </tr>
    );
  })
)}
        </tbody>
      </table>
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
              <Grid>
              <Typography>Subtotal: ${subtotal.toFixed(2)}</Typography>
            <Typography>Tax: ${tax.toFixed(2)}</Typography>
            <Typography>Total: ${total.toFixed(2)}</Typography>
              </Grid>
              <Grid item xs={12}>
              <Button type="submit" text="Send Quotation" />
            </Grid>
          </Form>    
        </Box>
         
    </div>
}
</div>
  );
};

export default PurchaseDetail;