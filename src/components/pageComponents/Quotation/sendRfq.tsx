import React, { useState } from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';
import Input from '../../Input';
import { Box, Grid, Typography } from '@mui/material';
import { Form, useForm } from '../../useForm';
import Button from '../../Button';

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

  const { loading, error, data } = useQuery<
    QuotationByRequestIdAdSupplierIdData,
    QuotationByRequestIdAdSupplierIdVariables
  >(GET_QUOTATION_QUERY, {
    variables: { id, supplierId },
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
    const  id = Number(18);
    const input = {
      status:"comformed", 
     shippingPrice: shippingCost,
     productPrices: Object.keys(prices).map((key) => ({
        id: parseInt(key),
        price: parseFloat(prices[key]),
      })),
    };
    console.log('Quotation:', input);
    try {
      const response = await updateQuotation({ variables: {id, input } });
      const quotation = response.data.createQuotation;
      console.log('Quotation:', quotation);
    } catch (error) {
      console.error('Mutation error:', error);
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

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Created At</th>
            <th>Price</th>
            <th>Status</th>
            <th>Product ID</th>
            <th>UOM</th>110
            <th>Quantity</th>
            <th>Purchase Request ID</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {quotationByRequestIdAdSupplierId.map((quotation) => (
            <tr key={quotation.id}>
              <td>{quotation.id}</td>
              <td>{quotation.createdAt}</td>
              <td>
                <Input
                  type="number"
                  placeholder="Please Enter Price"
                  value={prices[quotation.id.toString()] || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handlePriceChange(quotation.id.toString(), e)
                  }
                />
              </td>
              <td>{quotation.status}</td>
              <td>{quotation.product.id}</td>
              <td>{quotation.product.uom}</td>
              <td>{quotation.product.title}</td>
              <td>{quotation.product.quantity}</td>
              <td>{quotation.quotation.purchaseRequestId}</td>
              <td>{calculateSubtotalRow(parseFloat(prices[quotation.id.toString()] || ''), quotation.product.quantity)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Box mt={2}>
          <Form onSubmit={handleSubmit}>
           <Input
          type="number"
          placeholder="Enter Shipping Cost"
          value={shippingCost.toString()}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setShippingCost(parseFloat(e.target.value))
          }
        />
              <Grid>
            <Typography> tax {tax} </Typography>
            <Typography> calculateSubtotal {calculateSubtotal()} </Typography>
            <Typography> grandTotal {grandTotal} </Typography>
                 </Grid>
              <Grid item xs={12}>
              <Button type="submit" text="Send Quotation" />
            </Grid>
          </Form>    
        </Box>
    </div> 
  );
};

export default SendRfqComponent;