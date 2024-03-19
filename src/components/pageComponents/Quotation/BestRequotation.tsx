import React, { useState } from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';
import MUIDataTable, { MUIDataTableOptions } from 'mui-datatables';
import { TableFooter as MuiTableFooter } from '@mui/material';
import { useReactToPrint } from 'react-to-print';

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
import { QuizTwoTone, Send } from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
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
  otherPayment :number;
  availabilityDate :number;
  customer:{
    firstName:string;
    lastName:string;
  }
  supplier:{
    name:string;
  }
  createdAt:string;
}


interface ProductPrice {
  id: string;
  productId: string;
  price: number;
  disCountPrice:number;
  quotationId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  product: Product;
  quotation: Quotation;
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
      disCountPrice
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
        createdAt
        availabilityDate
        supplier {
          name
        }
        customer {
          firstName
          lastName
        }
      }
    }
  }
`;
// Define the mutation
const CREATE_ORDER_MUTATION = gql`
mutation CreateOrder($input: [CreateOrderInput]!) {
  createOrder(input: $input) {
    id
   
  }
}
`;
const BestQuotation: React.FC = () => {
    const location = useLocation();
    const qId = location.state?.qId;
    const customerId = location.state?.customerId;
  const [createOrder] = useMutation(CREATE_ORDER_MUTATION);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { loading, error, data,refetch } = useQuery<GetAllProductPricesResponse>(GET_ALL_PRODUCT_PRICES, {
    variables: { id: qId },
  });
  //const theme = useTheme();
  const printRef = React.useRef(null);
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });
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
   const selectedProducts = productPrices.filter(productPrice => selectedItems[productPrice.id]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
     // const confirmed = window.confirm('Are you sure you want to send the order?');
     // if (confirmed) {
        const selectedProductsBySupplier: { [supplierId: string]: ProductPrice[] } = {};
    
        for (const productPrice of selectedProducts) {
          const supplierId = productPrice.quotation?.supplierId.toString();
      
          if (!selectedProductsBySupplier[supplierId]) {
            selectedProductsBySupplier[supplierId] = [];
          }
      
          selectedProductsBySupplier[supplierId].push(productPrice);
        }
     
        const orders = Object.entries(selectedProductsBySupplier).map(([supplierId, productsForSupplier]) => {
          let totalPrice = 0;
          let shippingCost = 500;
  
          const orderDetails = productsForSupplier.map((product) => ({
            title: product.product.title,
            productId: parseInt(product.product.id),
            price: product.price,
            quantity: Number(product.product.quantity),
          }));
              // Calculate totalPrice and totalTax based on orderDetails
     orderDetails.forEach((product:any) => {
        totalPrice += product.price * product.quantity; // Calculate total price
      });
  
      // Calculate shipping cost based on the number of products
          return   {
            customerId: Number(customerId),
            supplierId: Number(supplierId),
            totalPrice: totalPrice,
            tax: totalPrice  * 0.15,
             orderDetails:orderDetails,
            shippingCost: shippingCost,
            status: 'pending',
            productPriceIds: productsForSupplier.map((product) => Number(product.id)),
          };
        });
      console.log(orders)
        try {
          const { data } = await createOrder({ variables: { input: orders } });
          console.log('Created orders:', data.createOrder);
          refetch();
          setSuccessMessage(`Orders created successfully for all suppliers!`);
          // Handle successful creation
        } catch (error: any) {
          setErrorMessage(error.message);
          console.error('Failed to create orders:', error);
          // Handle error
        }
      /*} else {
        event.preventDefault();
      }*/
     
    };
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
    <div ref={printRef} className="print-content">
          

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
            title="Send Order"
            subTitle="select your price from given bellow of different price sams"
            icon={<QuizTwoTone fontSize="large" />}
            imageSrc="tra.jpg"
          />
          </SectionTitle>
         </Grid>
        {Object.entries(quotationGroups).map(([quotationId, productPrices]) => (
          <Grid item xs={12} key={quotationId}>
            <Paper>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <p>Requested By   - {productPrices[0].quotation?.customer.firstName + " " + productPrices[0].quotation?.customer.lastName }</p>
                  <p>Requested Date - {data?.quotationByRequestId[0]?.quotation.createdAt}</p>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <p >Quotation By Supplier - <span style={{color:'#00b0ad'}}>{productPrices[0].quotation?.supplier.name}</span></p>
                  <p>Quotation Created Date - {data?.quotationByRequestId[0]?.createdAt}</p>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <p>Status - {productPrices[0].quotation?.status}</p>
                  <p >This Price is Avalabile for  - <span style={{color:'red'}}></span> {productPrices[0].quotation?.availabilityDate}days</p>
                </Grid>
              </Grid>
              <ThemeProvider theme={theme}>
              <MUIDataTable
                title={
                   <TableRow>
                    <TableCell>Please Select the Item and Send us order:</TableCell>
                   <Button className="no-print" onClick={handlePrint}>  Print  </Button>
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
                    product.partNumber,
                    product.uom,
                    product.quantity,
                    productPrice.price ,
                    productPrice.disCountPrice,
                    productPrice.price * product.quantity,
                  ];
                })}
                columns={[
                  '#',
                  'Select',
                  'Product/Service Description',
                  'Item Number',
                  'Unit',
                  'Qty',
                  'Price',
                  'Discount',
                  'Total Price'
                ]}
                components={{
                  TableFooter: () => (
                    <MuiTableFooter >
                        <TableRow>
                      <TableCell >Shipping Price:</TableCell> 
                    <TableCell colSpan={4} style={{ fontSize: 'larger', fontWeight: 'bold' }}>
                    <span style={{color:'black'}}>{Number(productPrices[0].quotation?.shippingPrice).toLocaleString()}</span> Birr
                    </TableCell>
                      </TableRow>
                      <TableRow>
                      <TableCell> Before Discount Price:</TableCell>
                    <TableCell colSpan={4} style={{ fontSize: 'larger', fontWeight: 'bold' }}>
                    <span style={{color:"black"}}>{Number((productPrices[0].quotation?.shippingPrice) +  Number(productPrices.reduce((sum, productPrice) => sum + productPrice.price * productPrice.product.quantity, 0).toFixed(2))).toLocaleString()}  </span> Birr
                     </TableCell>
                      </TableRow>
                      <TableRow>
                      <TableCell>Discount:</TableCell>
                    <TableCell colSpan={4} style={{ fontSize: 'larger', fontWeight: 'bold' }}>
                   <span style={{color:"black"}}>{Number(productPrices.reduce((sum, productPrice) => sum + productPrice.disCountPrice * 
                   productPrice.product.quantity, 0).toFixed(2)).toLocaleString()}</span> Birr
                    </TableCell>
                      </TableRow><TableRow>
                      <TableCell>Net to Pay after discount  Price:</TableCell>
                    <TableCell colSpan={4} style={{ fontSize: 'larger', fontWeight: 'bold' }}>
                    <span style={{color:"black"}}>{(Number(productPrices[0].quotation?.shippingPrice) +  Number(productPrices.reduce((sum, productPrice) => sum + productPrice.price * productPrice.product.quantity, 0).toFixed(2))- Number(productPrices.reduce((sum, productPrice) => sum + productPrice.disCountPrice * productPrice.product.quantity, 0).toFixed(2))).toLocaleString()}</span> Birr
                    </TableCell>
                      </TableRow>
                      
                    </MuiTableFooter>
                  ),
                }}     
                  />
             </ThemeProvider>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <form onSubmit={handleSubmit}>
      <Paper elevation={3} style={{ padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
  <Button
    type="submit"
    variant="outlined"
    color="primary"
    style={{ whiteSpace: 'nowrap' }}
    className="no-print"
  >
    <Send /> Send Order
  </Button>
</Paper>
       
      </form>
    </div>
  );
};

export default BestQuotation;