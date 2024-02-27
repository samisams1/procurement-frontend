import React, { useState } from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';
import MUIDataTable, { MUIDataTableOptions } from 'mui-datatables';
import {
  ThemeProvider,
  TableCell,
  TableRow,
  Checkbox,
  Grid,
  createTheme,
  Paper,
  Button,
  Alert,
} from '@mui/material';
import { SectionTitle } from '../../Section';
import PageHeader from '../../PageHeader';
import { QuizTwoTone } from '@mui/icons-material';
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
  //const theme = useTheme();
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
  const productPrices = data?.quotationByRequestId || [];

   // Calculate total price for selected products
   const selectedProducts = productPrices.filter(productPrice => selectedItems[productPrice.productId]);
   const totalPrice = selectedProducts.reduce((total, productPrice) => total + productPrice.price * productPrice.product.quantity, 0);
 
   // Calculate total with tax and shipping price
   const totalTax = totalPrice * 0.11;
   const shippingPrice = data?.quotationByRequestId[0].quotation?.shippingPrice || 0; // Assuming shipping price is the same for all products

 /* const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const selectedProducts = data?.quotationByRequestId.filter(
      (productPrice) => selectedItems[productPrice.productId]
    );

    const totalPrice = selectedProducts?.reduce(
      (total, productPrice) => total + productPrice.price * productPrice.product.quantity,
      0
    );
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
console.log(input)
};*/
 /* try {
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
    } */
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
    
      const selectedProductsBySupplier: { [supplierId: string]: ProductPrice[] } = {};
    
      for (const productPrice of selectedProducts) {
        const supplierId = productPrice.quotation?.supplierId.toString();
    
        if (!selectedProductsBySupplier[supplierId]) {
          selectedProductsBySupplier[supplierId] = [];
        }
    
        selectedProductsBySupplier[supplierId].push(productPrice);
      }
    
      const orders = Object.entries(selectedProductsBySupplier).map(([supplierId, productsForSupplier]) => {
        const totalPrice = 333;
        const totalTax = 233;
        const shippingCost = 222;
    
        return {
          customerId: "3",
          supplierId,
          orderDetails: productsForSupplier.map((product) => ({
            title: product.product.title,
            productId: parseInt(product.product.id),
            price: product.price,
            quantity: product.product.quantity,
          })),
          productPriceIds: productsForSupplier.map((product) => Number(product.id)),
          totalPrice,
          tax: totalTax,
          status: "pending",
          shippingCost,
        };
      });
    
      console.log(orders); // Display the input data for all suppliers
    
      try {
       // await createOrder({ variables: { input: { orders } });
        refetch();
        setSuccessMessage(`Orders created successfully for all suppliers!`);
        setTimeout(() => {
          setSuccessMessage('');
        }, 5000);
      } catch (error: any) {
        setErrorMessage(error.message);
        setTimeout(() => {
          setErrorMessage('');
        }, 5000);
      }
    };
    
    
   /* const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
    
      const selectedProducts = data?.quotationByRequestId.filter((productPrice) => selectedItems[productPrice.id]) || [];
    
      for (const productPrice of selectedProducts) {
        const totalPrice = productPrice.price * productPrice.product.quantity;
        const totalTax = totalPrice * 0.11;
        const shippingPrice = productPrice.quotation?.shippingPrice || 0;
        const grandTotal = totalPrice + totalTax + shippingPrice;
    
        const productPriceIds: number[] = [Number(productPrice.id)];
    
        const orderDetail: OrderDetail = {
          title: productPrice.product.title,
          productId: parseInt(productPrice.product.id),
          price: productPrice.price,
          quantity: productPrice.product.quantity,
        };
    
        const input: CreateOrderInput = {
          customerId,
          supplierId: productPrice.quotation?.supplierId || 0, // Use supplierId from the quotation
          orderDetails: [orderDetail],
          productPriceIds,
          totalPrice,
          tax: totalTax,
          status: 'pending',
          shippingCost: shippingPrice,
        };
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
        console.log(input); // Log the input data for each selected product
      }
    };*/
  const options: MUIDataTableOptions = {
    filter: true,
    download: true,
    print: true,
    search: true,
    selectableRows: 'none', // or 'single' for single row selection
    responsive: 'standard',
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
          <Grid item xs={12} sm={12}>
          <SectionTitle>
          <PageHeader
            title="Best Two Price From Quotation From Differnt Suppliers"
            subTitle="select your price from given bellow of different price"
            icon={<QuizTwoTone fontSize="large" />}
          />
          </SectionTitle>
         </Grid>
        {Object.entries(quotationGroups).map(([quotationId, productPrices]) => (
          <Grid item xs={12} key={quotationId}>
            <Paper>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <p>Requested By: samisams</p>
                  <p>Requested Date: 2024/25</p>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <p>Quotation - {quotationId}</p>
                  <p>Quotation By Supplier - {productPrices[0].quotation?.supplierId}</p>
                  <p>Created Date - {data?.quotationByRequestId[0]?.createdAt}</p>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <p>Status - {productPrices[0].quotation?.status}</p>
                </Grid>
              </Grid>
              <MUIDataTable
                title={
                   <TableRow>
                    <TableCell>Total Price:</TableCell>
                    <TableCell colSpan={4} style={{ fontSize: 'larger', fontWeight: 'bold' }}>
                   <span style={{color:"red"}}>{productPrices.reduce((sum, productPrice) => sum + productPrice.price * productPrice.product.quantity, 0).toFixed(2)}</span> Birr
                    </TableCell>
                  </TableRow>
                }
                options={options}
                data={productPrices.map((productPrice: ProductPrice, index: number) => {
                  const { product, id, status } = productPrice;
                  const isOrdered = status === 'ordered';
                  return [
                    index + 1,
                    <Checkbox
                      checked={selectedItems[id] || false}
                      onChange={(event) => handleCheckboxChange(id, event.target.checked)}
                      disabled={isOrdered}
                    />,
                    product.title ,
                    product.quantity + " " + "Birr",
                    productPrice.price + " " + "Birr",
                  ];
                })}
                columns={[
                  '#',
                  'Select',
                  'Title',
                  'Quantity',
                  'Price',
                  // Add the remaining columns
                ]}
                

                
              />
            </Paper>
          </Grid>
        ))}
      </Grid>
      <form onSubmit={handleSubmit}>
        <Button type="submit" variant="contained" color="primary">
          Send Order
        </Button>
      </form>
    </ThemeProvider>
  );
};

export default QuotationDetail;