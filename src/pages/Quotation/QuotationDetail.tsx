import React, { useState } from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { Typography, Box, TextField, Grid, Paper } from '@mui/material';
import Button from '../../components/Button';

const GET_QUOTATION = gql`
  query GetQuotationById($id: Float!) {
    quotation(id: $id) {
      id
      customerId
      supplierId
      shippingPrice
      productPrices {
        price
        product {
          title
        }
      }
    }
  }
`;
const CREATE_ORDER = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      id
      customerId
      supplierId
      orderDetails {
        id
        title
        price
        quantity
      }
      totalPrice
      tax
    }
  }
`;

interface QuotationData {
  quotation: {
    id: string;
    shippingPrice: number;
    productPrices: {
      price: number;
      product: {
        title: string;
      };
    }[];
  };
}

const QuotationDetail: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [shipping, setShipping] = useState<number>(0);

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [createOrder] = useMutation(CREATE_ORDER);

  const { loading, error, data } = useQuery<QuotationData>(GET_QUOTATION, {
    variables: { id: parseFloat(id || '0') },
  });
  React.useEffect(() => {
    if (data?.quotation.shippingPrice !== undefined) {
      setShipping(data.quotation.shippingPrice);
    }
  }, [data]);
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!data?.quotation) {
      setErrorMessage('Quotation data not found!');
      return;
    }
    const input = {
      customerId: 1,
      supplierId: 1,
      orderDetails: data.quotation.productPrices.map(({ product, price }) => ({
        title: product.title,
        price,
        quantity: quantities[product.title] || 0,
      })),
      totalPrice: calculateTotal(),
      tax: calculateVAT(),
      status: 'pending',
      shippingCost: shipping,
    };

    try {
      console.log(input);
      await createOrder({ variables: { input } });
      setSuccessMessage('Order created successfully!');
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  const { quotation } = data!;

  const handleQuantityChange = (index: number, value: string, field: string) => {
    const parsedValue = parseFloat(value);
    if (!isNaN(parsedValue)) {
      if (field === 'quantity') {
        setQuantities((prevQuantities) => ({
          ...prevQuantities,
          [quotation.productPrices[index].product.title]: parsedValue,
        }));
      }
    } else {
      if (field === 'quantity') {
        setQuantities((prevQuantities) => ({
          ...prevQuantities,
          [quotation.productPrices[index].product.title]: 0,
        }));
      }
    }
  };

  const calculateVAT = () => {
    const total = calculateTotal();
    return total * 0.15; // Assuming 15% VAT
  };

  const calculateTotal = () => {
    let total = 0;
    quotation.productPrices.forEach(({ product, price }) => {
      const quantity = quantities[product.title] || 0;
      total += quantity * price;
    });
    total += shipping;
    return total;
  };

  const calculateSubTotal = () => {
    let subTotal = 0;
    quotation.productPrices.forEach(({ product, price }) => {
      const quantity = quantities[product.title] || 0;
      subTotal += quantity * price;
    });
    return subTotal;
  };

  return (
    <Box display="flex" justifyContent="center">
      <Paper elevation={3} style={{ padding: '20px' }}>
        <Typography component="p" align="left" gutterBottom>
          This is a quotation result from the supplier, which means the supplier has added their price.
        </Typography>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Purchase by Filling the Amount
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {quotation.productPrices.map(({ product, price }, index) => (
              <Grid item xs={12} key={index}>
                <Box display="flex" alignItems="center">
                  <TextField
                    type="text"
                    value={product.title.toString()}
                    placeholder="Product Title"
                    variant="filled"
                    disabled
                  />
                  <Box mx={2} />
                  <TextField
                    type="text"
                    value={price.toString()}
                    placeholder="Price"
                    variant="filled"
                    disabled
                  />
                  <Box mx={2} />
                  <TextField
                    type="number"
                    value={quantities[product.title] || ''}
                    placeholder="Quantity"
                    variant="outlined"
                    onChange={(e) =>
                      handleQuantityChange(index, e.target.value, 'quantity')
                    }
                  />
                </Box>
              </Grid>
            ))}

            <Grid item xs={12}>
              <Box display="flex" alignItems="center">
                <TextField
                  type="text"
                  value={shipping.toString()}
                  placeholder="Shipping Cost"
                  variant="filled"
                  disabled
                />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" component="h2">
                Subtotal: {calculateSubTotal()}
              </Typography>
              <Typography variant="h6" component="h2">
                Total Price: {calculateTotal()}
              </Typography>
              <Typography variant="h6" component="h2">
                VAT (15%): {calculateVAT()}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" text="Submit" />
            </Grid>
          </Grid>
        </form>
        <Typography>{successMessage}</Typography>
      <Typography>{errorMessage}</Typography>
      </Paper>
    </Box>
  );
};

export default QuotationDetail;