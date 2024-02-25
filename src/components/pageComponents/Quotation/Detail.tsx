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
  customer:{
    firstName:string;
  }
  supplier:{
    name:string;
  }
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
  customerId:number;
  supplierId:number;
};
const QuotationDetail: React.FC<QuotationDetailProps> = ({ qId,customerId,supplierId }) => {
  const [createOrder] = useMutation(CREATE_ORDER_MUTATION);
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
      (productPrice) => selectedItems[productPrice.productId]
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
      customerId: Number(customerId),
      supplierId: Number(supplierId),
      orderDetails,
      productPriceIds: productPriceIds, // Include productPriceIds in the input object
      totalPrice: totalPrice || 0,
      tax:11,
      status: 'pending',
      shippingCost: shippingCost,
    };
console.log(productPriceIds)
  try {
       await createOrder({ variables: { input } });
      refetch(); 
      setSuccessMessage('Order created successfully!');
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000); 
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
        {
    
     
        Object.entries(quotationGroups).map(([quotationId, productPrices]) => (
          
          <Grid item xs={12} key={quotationId}>
     <Paper>
              <h1>Quotation - {quotationId}</h1>

              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Select</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Quantity</TableCell>
                    {/* Add the remaining table headers */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productPrices.map((productPrice: ProductPrice, index: number) => {
                    const { product, id, status } = productPrice;
                    const isOrdered = status === 'ordered';

                    return (
                      <TableRow key={id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <Checkbox
                            checked={selectedItems[id] || false}
                            onChange={(event) => handleCheckboxChange(id, event.target.checked)}
                            disabled={isOrdered}
                          />
                        </TableCell>
                        <TableCell>{product.title}</TableCell>
                        <TableCell>{product.quantity}</TableCell>
                        {/* Add the remaining table cells */}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Paper>
          </Grid>
        ))}
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