import React, {useState } from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';
import MUIDataTable from 'mui-datatables';
import { Table, TableBody, TableContainer, Typography } from '@mui/material';
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
import PageHeader from '../../PageHeader';
import { QuizTwoTone, Send } from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import TermsCondition from '../../common/termsCondition';
import numberToWords from 'number-to-words';
import { Product } from '../../../interface/products';
import { tableOptions } from '../Table/table';


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
        mark
        model
        Description
        manufacturer
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
  //  const shippingPrice = location.state?.shippingPrice;
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
  const convertToWords = (num: number): string => {
    return numberToWords.toWords(num);
  };
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
  
          const orderDetails = productsForSupplier.map((product) => ({
            title: product.product.title,
            productId: parseInt(product.product.id),
            price: product.price,
            discount:product.disCountPrice,
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
            shippingCost: shipping,
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
  const shipping = Number(productPrices[0].quotation?.shippingPrice)
  const subTotal =
  shipping + 
  Number(
    productPrices.reduce(
      (sum, productPrice) => sum + productPrice.price * productPrice.product.quantity,
      0
    ).toFixed(2)
  );
const vat = subTotal * 0.15;
const tax = subTotal * 0.35;
const serviceCharge = subTotal * 0.01;
const total = subTotal + vat + tax + serviceCharge;
const discount = Number(
  productPrices.reduce(
    (sum, productPrice) => sum + productPrice.disCountPrice * productPrice.product.quantity,
    0
  ).toFixed(2)
);
const payable = total - discount;
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
          <PageHeader
            title="Send Order"
            icon={<QuizTwoTone fontSize="large" />}
            imageSrc="tra.jpg"
          />
         </Grid>
        {Object.entries(quotationGroups).map(([quotationId, productPrices]) => (
          
          <Grid item xs={12} key={quotationId}>
            <Paper>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <p>Requested By   - {productPrices[0].quotation?.customer.firstName + " " + productPrices[0].quotation?.customer.lastName }</p>
                  <p>Quotation Created Date - {data?.quotationByRequestId[0]?.createdAt ? new Date(data?.quotationByRequestId[0]?.createdAt).toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          }) : ''}</p>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <p >Quotation By Supplier - <span style={{color:'#00b0ad'}}>{productPrices[0].quotation?.supplier.name}</span></p>
                  <p>Quotation Created Date - {data?.quotationByRequestId[0]?.createdAt ? new Date(data?.quotationByRequestId[0]?.createdAt).toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',      
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          }) : ''}</p>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <p>Status - {productPrices[0].quotation?.status}</p>
                  <p >This Price is Avalabile for  - <span style={{color:'red'}}>{productPrices[0].quotation?.availabilityDate}</span> - Days</p>
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
                options={tableOptions}
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
                    product.mark,
                    product.model,
                    product.code,
                    product.Description,
                    product.uom,
                    product.quantity,
                    Number(productPrice.price).toFixed(2).toLocaleString(),
                    Number(productPrice.disCountPrice).toFixed(2).toLocaleString(),
                    (productPrice.price * product.quantity).toLocaleString(),
                  ];
                })}
                columns={[
                  '#',
                  'Select',
                  'Product/Service Description',
                  'Item Number',
                  {
                    name: 'mark',
                    options: {
                      display: false,
                    },
                  },
                  {
                    name: 'model',
                    options: {
                      display: false,
                    },
                  },
                  {
                    name: 'code',
                    options: {
                      display: false,
                    },
                  },
                  {
                    name: 'Description',
                    options: {
                      display: false,
                    },
                  },
                  'Unit',
                  'Qty',
                  'Price',
                  'Discount',
                  'Total Price',
                  {
                    name: 'more',
                    label: 'More',
                    options: {
                      display: true,
                      customBodyRender: (value, tableMeta) => {
                        const rowIndex = tableMeta.rowIndex;
                        const product = productPrices[rowIndex];
                        // Render the dropdown list with more details
                        return (
                          <select>
                            <option value="details1">Manufacturer: {product?.product?.manufacture}</option>
                            <option value="details2">Mark: {product?.product?.mark}</option>
                            <option value="details3">Description: {product?.product?.Description}</option>
                            <option value="details4">Model: {product?.product?.model}</option>
                            {/* Add more options as needed */}
                          </select>
                        );
                      },
                    },
                  },
                ]}
                components={{
                  TableFooter: () => (
                    <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={6}>
                     <TermsCondition/>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                    <div style={{ border: '1px solid black', padding: '10px', margin: '10px', textAlign: 'center' }}>
    <TableContainer component={Paper} style={{ margin: '10px' }}>
      <Table>
        <TableBody>
        <TableRow>
            <TableCell align="center">
              <Typography>Shipping Cost</Typography>
            </TableCell>
            <TableCell align="center">
              <Typography>
              {shipping.toLocaleString()}
              </Typography></TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="center">
              <Typography>Sub Total</Typography>
            </TableCell>
            <TableCell align="center">
              <Typography>
              {subTotal.toLocaleString()}
              </Typography></TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="center">
              <Typography>Tax (35%)</Typography>
            </TableCell>
            <TableCell align="center">
              <Typography>{tax.toLocaleString()}</Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="center">
              <Typography>VAT (15%)</Typography>
            </TableCell>
            <TableCell align="center">
              <Typography>{vat.toLocaleString()}</Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="center">
              <Typography>Service charge (1%)</Typography>
            </TableCell>
            <TableCell align="center">
              <Typography>{serviceCharge.toLocaleString()}</Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="center">
              <Typography>Total</Typography>
            </TableCell>
            <TableCell align="center">
              <Typography>{total.toLocaleString()}</Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="center">
              <Typography>Total discount</Typography>
            </TableCell>
            <TableCell align="center">{discount.toLocaleString()}</TableCell>
          </TableRow>
         
          <TableRow>
            <TableCell align="center">
              <Typography>payable</Typography>
            </TableCell>
            <TableCell align="center">
              <Typography> {payable.toLocaleString()}</Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="center">
              <Typography>Currency</Typography>
            </TableCell>
            <TableCell align="center">
              <Typography>ETB</Typography>
            </TableCell>
          </TableRow>
          Amounts in word: <span style={{ color: 'red' }}>{convertToWords(payable)}</span>
        </TableBody>
      </Table>
    </TableContainer>
  </div>
                    </Grid>
                    </Grid>
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
    <Send /> Send to Purchase order
  </Button>
</Paper>
       
      </form>
    </div>
  );
};

export default BestQuotation;