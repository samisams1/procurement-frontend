import React, { useState } from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';
import {
  ThemeProvider,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Checkbox,
  Grid,
  Paper,
  Button,
  Alert,
} from '@mui/material';

interface Product {
  id: string;
  Description: string;
  code: string;
  manufacture: string;
  model: string;
  partNumber: string;
  quantity: number;
  title: string;
  uom: string;
}

interface Quotation {
  id: number;
  supplierId: number;
  shippingPrice: number;
  status: string;
}


interface ProductPrice {
  id: string;
  productId: string;
  price: number;
  quotationId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  product: Product;
  quotation: Quotation;
}
interface OrderDetail {
  title: string;
  productId: number;
  price: number;
  quantity: number;
}

interface CreateOrderInput {
  customerId: number;
  supplierId: number;
  orderDetails?: OrderDetail[];
  productPriceIds: number[];
  totalPrice: number;
  tax: number;
  status: string;
  shippingCost: number;
}
interface GetAllProductPricesResponse {
  quotationByRequestId: ProductPrice[];
}
const GET_ALL_PRODUCT_PRICES = gql`
  query QuotationByRequestId($id: Int!) {
    quotationByRequestId(id: $id) {
      id
      productId
      price
      quotationId
      status
      createdAt
      updatedAt
      product {
        id
        Description
        code
        manufacture
        model
        partNumber
        quantity
        title
        uom
      }
      quotation {
        id
        supplierId
        shippingPrice
        status
      }
    }
  }
`;
// Define the mutation
const CREATE_ORDER_MUTATION = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      id
    }
  }
`;
type QuotationDetailProps = {
  qId: number;
};

const QuotationDetail: React.FC<QuotationDetailProps> = ({ qId }) => {
  const [createOrder] = useMutation(CREATE_ORDER_MUTATION);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { loading, error, data,refetch } = useQuery<GetAllProductPricesResponse>(GET_ALL_PRODUCT_PRICES, {
    variables: { id: qId },
  });
  const theme = useTheme();
  const [selectedItems, setSelectedItems] = useState<{ [productId: string]: boolean }>({});

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const handleCheckboxChange = (productId: string, checked: boolean) => {
    setSelectedItems((prevSelectedItems) => {
      const updatedSelectedItems = { ...prevSelectedItems };
      updatedSelectedItems[productId] = checked;
      return updatedSelectedItems;
    });
  };

  const quotationGroups: { [key: string]: ProductPrice[] } = {};
  data?.quotationByRequestId.forEach((productPrice) => {
    const quotationId = productPrice.quotationId;
    
    if (quotationGroups[quotationId]) {
      quotationGroups[quotationId].push(productPrice);
    } else {
      quotationGroups[quotationId] = [productPrice];
    }
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const selectedProducts = data?.quotationByRequestId.filter(
      (productPrice) => selectedItems[productPrice.id]
    );

    const totalPrice = selectedProducts?.reduce(
      (total, productPrice) => total + productPrice.price * productPrice.product.quantity,
      0
    );

   /* const calculateVAT = () => {
      // Implement the logic to calculate VAT
    };*/

    const shippingCost = 0; // Provide the appropriate value for shipping cost

    const productPriceIds: number[] = selectedProducts
  ? selectedProducts.map(({ id }) => Number(id))
  : [];
    const orderDetails: OrderDetail[] = selectedProducts
    ? selectedProducts.map(({ product, price,id }) => ({
        title: product.title,
        productId: parseInt(product.id),
        price,
        quantity: Number(product.quantity),
      }))
    : [];
    const input: CreateOrderInput = {
      customerId: 1,
      supplierId: 1,
      orderDetails,
      productPriceIds: productPriceIds, // Include productPriceIds in the input object
      totalPrice: totalPrice || 0,
      tax:11,
      status: 'pending',
      shippingCost: shippingCost,
    };
console.log(input)
  try {
      /* await createOrder({ variables: { input } });
      refetch(); 
      setSuccessMessage('Order created successfully!');
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);  */
    } catch (error:any) {
      setErrorMessage(error.message);
        setTimeout(() => {
          setErrorMessage('');
        }, 5000); 
    }
  };
  return (
    <ThemeProvider theme={theme}>
      <Grid container spacing={2}>
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
         <Grid  item xs={12}>
      
        {Object.entries(quotationGroups).map(([quotationId, productPrices]) => (
          <Grid item xs={12} key={quotationId}>
            <Paper>
            samisas
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#00b0ad' }}>
                    <TableCell sx={{ padding: '4px', height: '32px' }}>#</TableCell>
                    <TableCell sx={{ padding: '4px', height: '32px' }}>Select</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell sx={{ padding: '4px', height: '32px' }}>Item Code</TableCell>
                    <TableCell sx={{ padding: '4px', height: '32px' }}>Manufacturer</TableCell>
                    <TableCell sx={{ padding: '4px', height: '32px' }}>Model</TableCell>
                    <TableCell sx={{ padding: '4px', height: '32px' }}>Part Number</TableCell>
                    <TableCell sx={{ padding: '4px', height: '32px' }}>Quantity</TableCell>
                    <TableCell sx={{ padding: '4px', height: '32px' }}>UOM</TableCell>
                    <TableCell sx={{ padding: '4px', height: '32px' }}>Price</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productPrices.map((productPrice, index) => {
                    const { product, price,id,status } = productPrice;
                    const isChecked = selectedItems[id] || false;
                    const isOrdered = status === "ordered";
                    const isDisabled = selectedItemId !== null && product.id !== selectedItemId && isChecked;
                    return (
                      <TableRow key={product.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <Checkbox
                            checked={selectedItems[id] || false}
                            onChange={(event) => handleCheckboxChange(id, event.target.checked)}
                            disabled={isOrdered}
                          />
                        </TableCell>
                        <TableCell>{product.title }<span>{status} {id}</span> <span style={{color:'red'}}>{quotationId}</span>{product.id}</TableCell>
                        <TableCell>{product.code}</TableCell>
                        <TableCell>{product.manufacture}</TableCell>
                        <TableCell>{product.model}</TableCell>
                        <TableCell>{product.partNumber}</TableCell>
                        <TableCell>{product.quantity}</TableCell>
                        <TableCell>{product.uom}</TableCell>
                        <TableCell>{price}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Paper>
          </Grid>
        ))}
        </Grid>
      </Grid>
      <form onSubmit={handleSubmit}>
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </form>
    </ThemeProvider>
  );
};

export default QuotationDetail;