import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { ThemeProvider, useTheme } from '@mui/material/styles';
//import useMediaQuery from '@mui/material/useMediaQuery';
import { Table, TableBody, TableCell, TableHead, TableRow, Checkbox, Grid, Paper } from '@mui/material';
//import { useNavigate } from 'react-router-dom';
import Button from '../../Button';

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
  id:number;
  supplierId: number; // Add supplierId property to Quotation interface
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

interface GetAllProductPricesResponse {
  getAllProductPrices: ProductPrice[];
}

const GET_ALL_PRODUCT_PRICES = gql`
  query GetAllProductPrices {
    getAllProductPrices {
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

const QuotationDetail: React.FC = () => {
  const { loading, error, data } = useQuery<GetAllProductPricesResponse>(GET_ALL_PRODUCT_PRICES);
  const theme = useTheme();
 // const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState<{ [productId: string]: boolean }>({});
 // const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }
  
const handleCheckboxChange = (key: string, checked: boolean) => {
  setSelectedItems((prevSelectedItems) => {
    const updatedSelectedItems = { ...prevSelectedItems };
    updatedSelectedItems[key] = checked;
    return updatedSelectedItems;
  });
};
  // Group product prices by quotationId
  const quotationGroups: { [key: string]: ProductPrice[] } = {};
  data?.getAllProductPrices.forEach((productPrice) => {
    const quotationId = productPrice.quotationId;
    if (quotationGroups[quotationId]) {
      quotationGroups[quotationId].push(productPrice);
    } else {
      quotationGroups[quotationId] = [productPrice];
    }
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Get the selected products
    const selectedProducts = data?.getAllProductPrices.filter(
      (productPrice) => selectedItems[productPrice.productId]
    );
console.log(selectedProducts)
    // Calculate total price
    const totalPrice = selectedProducts?.reduce(
      (total, productPrice) => total + productPrice.price * productPrice.product.quantity,
      0
    );

    // Calculate VAT
    const calculateVAT = () => {
      // Implement the logic to calculate VAT
    };

    // Calculate shipping cost
    const shippingCost = 0; // Provide the appropriate value for shipping cost

    // Create the input object for the mutation
    const input = {
      customerId: 1,
      supplierId: 1,
      orderDetails: selectedProducts?.map(({ product, price }) => ({
        title: product.title,
        productId: product.id,
        price,
        quantity: product.quantity,
      })),
      totalPrice: totalPrice || 0,
      tax: calculateVAT(),
      status: 'pending',
      shippingCost: shippingCost,
    };
    console.log("botu")

console.log(input)
    // Perform the mutation using the input object
    // Use the appropriate Apollo Client function to perform the mutation
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container spacing={2}>
        {Object.entries(quotationGroups).map(([quotationId, productPrices]) => (
          <Grid item xs={12} key={quotationId}>
            <Paper>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#00b0ad' }}>
                    <TableCell sx={{ padding: '4px', height: '32px' }}>#</TableCell>
                    <TableCell sx={{ padding: '4px', height: '32px' }}>Select</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell sx={{ padding: '4px', height: '32px' }}>Item Code</TableCell>
                    <TableCell sx={{ padding: '4px', height: '32px' }}>Part Number</TableCell>
                    <TableCell sx={{ padding: '4px', height: '32px' }}>UOM</TableCell>
                    <TableCell sx={{ padding: '4px', height: '32px' }}>Qty</TableCell>
                    <TableCell sx={{ padding: '4px', height: '32px' }}>Price</TableCell>
                    <TableCell sx={{ padding: '4px', height: '32px' }}>Sub total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productPrices.map((productPrice, index) => (
                    <TableRow key={productPrice.id}>
                      <TableCell sx={{ padding: '0px', height: '24px' }}>{index + 1}</TableCell>
                      <TableCell>
                      <Checkbox
  checked={!!selectedItems[`${productPrice.quotationId}-${productPrice.product.title}`]}
  onChange={(e) => {
    if (productPrice.status === 'pending') {
      handleCheckboxChange(
        `${productPrice.quotationId}-${productPrice.product.title}`,
        e.target.checked
      );
    }
  }}
  disabled={productPrice.status !== 'pending'}
/>
                      </TableCell>
                      <TableCell>{productPrice.product.title}</TableCell>
                      <TableCell>{productPrice.product.code}</TableCell>
                      <TableCell>{productPrice.product.partNumber}</TableCell>
                      <TableCell>{productPrice.product.uom}</TableCell>
                      <TableCell>{productPrice.product.quantity}</TableCell>
                      <TableCell>{productPrice.price}</TableCell>
                      <TableCell>{productPrice.price * productPrice.product.quantity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
             <Button
             onClick={handleSubmit}
             text="send Order"
             />
            </Paper>
          </Grid>
        ))}
      </Grid>
    </ThemeProvider>
  );
};

export default QuotationDetail;