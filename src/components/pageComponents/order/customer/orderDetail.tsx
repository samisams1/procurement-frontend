import React, { useContext, useEffect } from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';
import { Button, Grid, Paper, Table, TableCell,TableRow, Typography,TableHead, TableBody, createTheme, ThemeProvider, TableContainer } from '@mui/material';
import MUIDataTable, { MUIDataTableOptions, MUIDataTableMeta,Responsive } from 'mui-datatables';

import PageHeader from '../../../PageHeader';
import numberToWords from 'number-to-words';
import Spinner from '../../../Spinner';
import { UserContext } from '../../../../auth/UserContext';
import { useNavigate, useParams } from 'react-router-dom';
import { Add, Cancel, ConfirmationNumberTwoTone, Print, Send, ShoppingCart } from '@mui/icons-material';
import { useReactToPrint } from 'react-to-print';
import '../../../PrintPage.css';
import TermsCondition from '../../../common/termsCondition';
interface Product {
  id: number;
  Description: string | null;
  code: string | null;
  manufacture: string | null;
  model: string | null;
  partNumber: string | null;
  quantity: number;
  title: string | null;
  uom: string | null;
}

interface OrderDetail {
  id: number;
  orderId: number;
  title: string | null;
  price?: number; // Make the price property optional
  discount?:number;
  quantity: number;
  productId: number;
  createdAt: string;
  updatedAt: string;
  product: Product;
  order: {
    id: number;
    customerId: number;
    supplierId: number;
    totalPrice: number;
    tax: number;
    shippingCost: number;
    status: string;
    createdAt: string;
    updatedAt: string;
    referenceNumber: string;
    purchaseRequestId: string;
    supplier: {
      name: string;
      address:string;
      category: {
        name: string;
      };
    };
    customer: {
      username: string | null;
      address:string;
    };
  };
}

interface GetOrderDetailByOrderIdResponse {
  getOrderDetailByOrderId: OrderDetail[];
}

interface GetOrderDetailByOrderIdVariables {
  getOrderDetailByOrderIdId: number;
}
const GET_PAYMENT_BY_ORDER_ID = gql`
  query PaymentByPrderId($orderId: Int!) {
    paymentByPrderId(orderId: $orderId) {
      id
      amount
      paidAt
      paymentMethod
      userId
      orderId
      status
      referenceNumber
      fullName
    }
  }
`;
const GET_ORDER_DETAIL_BY_ORDER_ID = gql`
  query GetOrderDetailByOrderId($getOrderDetailByOrderIdId: Int!) {
    getOrderDetailByOrderId(id: $getOrderDetailByOrderIdId) {
      id
      orderId
      title
      price
      discount
      quantity
      productId
      createdAt
      updatedAt
      product {
        id
        Description
        code
        manufacturer
        model
        partNumber
        quantity
        title
        uom
      }
      order {
        id
        customerId
        supplierId
        totalPrice
        tax
        shippingCost
        status
        createdAt
        updatedAt
        referenceNumber
        purchaseRequestId
        
        supplier {
          name
          address
          category {
            name
          }
        }
        customer {
          address
          username
        }
      }
    }
  }
`;
const UPDATE_ORDER = gql`
mutation UpdateOrder($id: Int!, $input: String!) {
  updateOrder(id: $id, input: $input) {
    id
    status
  }
}
`;

const Detail = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const printRef = React.useRef(null);
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const [updateOrder] = useMutation(UPDATE_ORDER);
  const { loading, error, data,refetch } = useQuery<GetOrderDetailByOrderIdResponse, GetOrderDetailByOrderIdVariables>(
    GET_ORDER_DETAIL_BY_ORDER_ID,
    {
      variables: { getOrderDetailByOrderIdId: Number(id)},
    }
  );
  const { currentUser } = useContext(UserContext);

 const { loading:paymentLoding, error:paymentError, data:paymentData } = useQuery(GET_PAYMENT_BY_ORDER_ID, {
    variables: {orderId:Number(id)},
  })
  useEffect(() => {
    refetch(); // Trigger the query after component mounts
  }, [refetch]);
  const payments = paymentData?.paymentByPrderId;
console.log("fasile")
console.log(payments)
  if (!currentUser) {
    return <Spinner />;
  }
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  if (paymentLoding) return <p>Loading...</p>;
  if (paymentError) return <p>Error: {paymentError.message}</p>;

  const orderDetail = data?.getOrderDetailByOrderId[0];
  const products = orderDetail?.product;
 
  const sf =orderDetail?.order.shippingCost;
  //console.log(sf)
  console.log("sf")
  const columns = [
    // Define your product table columns here
    {
      name: 'title',
      label: 'Product/Service Description',
    },
    {
      name: 'partNumber',
      options: {
        display: true,
      },
    },
    {
      name: 'uom',
      lable:'Unit',
      options: {
        display: true,
      },
    },
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
    // ... add other columns as needed
    {
      name: 'quantity',
      field: 'quantity',
    },
    {
      name: 'Price',
      label: 'price (ETB)',
      options: {
        customBodyRender: (value: number | undefined, tableMeta: MUIDataTableMeta) => {
          return orderDetail?.price;
        },
      },
    },
    {
      name: 'discount',
      label: 'discount (ETB)',
      options: {
        customBodyRender: (value: number | undefined, tableMeta: MUIDataTableMeta) => {
          return orderDetail?.discount;
        },
      },
    },
    {
      name: 'subTotal',
      label: 'Subtotal (ETB)',
      options: {
        customBodyRender: (value: number | undefined, tableMeta: MUIDataTableMeta) => {
          const quantity = tableMeta.rowData[2]; // Assuming quantity is at index 2 in the row data
          const price = orderDetail?.price; // Assuming price is at index 3 in the row data
          const subtotal = price !== undefined ? quantity * price : 0;
          return subtotal;
        },
      },
    },
  ];
  const productsArray: Product[] = products ? [products] : [];

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
  const options: MUIDataTableOptions = {
    filter: true,
    download: true,
    print: true,
    search: true,
    selectableRows: 'none', // or 'single' for single row selection
    responsive: 'standard' as Responsive,
    viewColumns: true,
    rowsPerPage: 10,
    rowsPerPageOptions: [10, 25, 50],
    customFooter: () => {
      return (
        <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={6}>
        <Typography variant="h6" align="center">Payments</Typography>
        <TableContainer style={{ border: "3px solid green" }}>
  <Table>
    <TableHead>
      <TableRow>
        <TableCell style={{ backgroundColor: "#00b0ad", color: "#ffffff", borderBottom: "1px solid #ffffff" }}>Date</TableCell>
        <TableCell style={{ backgroundColor: "#00b0ad", color: "#ffffff", borderBottom: "1px solid #ffffff" }}>Amount (ETB)</TableCell>
        <TableCell style={{ backgroundColor: "#00b0ad", color: "#ffffff", borderBottom: "1px solid #ffffff" }}>Status</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow>
        <TableCell>2024/4/1</TableCell>
        <TableCell>{payable}</TableCell>
        <TableCell style={{ color: "#00b0ad" }}>{orderDetail?.order?.status === "approved"?"Wait for Payment":"paid"} </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</TableContainer>
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
              {sf}
              </Typography></TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="center">
              <Typography>Sub Total</Typography>
            </TableCell>
            <TableCell align="center">
              <Typography>
              {subTotalIncShipping.toLocaleString()}
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
            <TableCell align="center">{totalDiscount.toLocaleString()}</TableCell>
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
          Amounts in word: <span style={{ color: 'red' }}>{amountInWords}</span>
        </TableBody>
      </Table>
    </TableContainer>
  </div>
                    </Grid>
     
      </Grid>
      );
    },
  };

  const subtotal = productsArray.reduce((acc, product) => {
    return acc + (product?.quantity ?? 0) * (orderDetail?.price ?? 0);
  }, 0);
  const totalDiscount = productsArray.reduce((acc, product) => {
    return acc + (product?.quantity ?? 0) * (orderDetail?.discount ?? 0);
  }, 0);
  
  //const shipping = order?.shippingCost;
  const subTotalIncShipping =  Number(subtotal + Number(sf));
  const tax = subTotalIncShipping * 0.35;
  const vat = subTotalIncShipping * 0.15;
  const serviceCharge =subTotalIncShipping *  0.01;
  const total = subTotalIncShipping + tax + vat + serviceCharge;
  const payable = total - totalDiscount;

  const amountInWords = numberToWords.toWords(payable);


 /* const handlePayment = () => {
    navigate(`/payment/${1}`);
  };*/

  const handlePayment = () => {
    const paymentId = id;
    const userId = currentUser.id;
    navigate(`/payment?id=${paymentId}&total=${payable}&userId=${userId}`);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data } = await updateOrder({ variables: { id:Number(id), input:"approved" } });
      console.log('Order updated:', data.updateOrder);
    } catch (updateError) {
      console.error('Failed to update order:', updateError);
    }
  };
  const handleUpdateReject = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data } = await updateOrder({ variables: { id:Number(id), input:"reject" } });
      console.log('Order updated:', data.updateOrder);
    } catch (updateError) {
      console.error('Failed to update order:', updateError);
    }
  };
  const handleUpdateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data } = await updateOrder({ variables: { id:Number(id), input:"approved" } });
      console.log('Order updated:', data.updateOrder);
    } catch (updateError) {
      console.error('Failed to update order:', updateError);
    }
  };
 
  const createdDate = orderDetail?.order.createdAt ? new Date(orderDetail.createdAt) : null;
  const formattedDate = createdDate?.toLocaleString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

  
  
  return (
    <div ref={printRef} className="print-content">

    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Grid>
      <PageHeader
      title="Purchas Order"
      icon={<ShoppingCart/>}
          imageSrc = "salesForce.png"
          />
        <Button
        variant="outlined"
        color="primary"
        startIcon={<Print />}
        onClick={handlePrint}
        style={{ whiteSpace: 'nowrap' }}
      >
        Print Page
      </Button>
    <Grid container spacing={2}>
      {/* Order By */}
      <Grid item xs={4}>
        <Paper>
          <Typography variant="h6">Order By</Typography>
          <Typography variant="body1">
          Customer Name: {orderDetail?.order?.customer?.username}
          </Typography>
          <Typography variant="body1">
            Reference Number: {orderDetail?.order?.referenceNumber}
          </Typography>
          <Typography variant="body1">
            Requested Date: {formattedDate?.toString()}
         
          </Typography>
          <Typography variant="body1">
            Address: {orderDetail?.order?.customer?.address}
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={4}>
        <Paper>
          <Typography variant="h6">Order To</Typography>
          <Typography variant="body1">
            Supplier Name: {orderDetail?.order?.supplier.name}
          </Typography>
          <Typography variant="body1">
            Category: {orderDetail?.order?.supplier?.category?.name}
          </Typography>
          <Typography variant="body1">
            Address: {orderDetail?.order?.supplier.address}
          </Typography>
        </Paper>
      </Grid>

      {/* More */}
      <Grid item xs={4}>
        <Paper>
          <Typography variant="h6">More</Typography>
          <Typography variant="body1">
            Status <span style={{color:"red"}}>: {orderDetail?.order?.status}</span>
          </Typography>
        </Paper>
      </Grid>
      </Grid>
        </Grid>
        <ThemeProvider theme={theme}>
        <MUIDataTable
          title="Product Details"
          data={productsArray}
          columns={columns}
          options={options}
        />
       </ThemeProvider>
        <Grid>
        {orderDetail?.order?.status === "comformed" && (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {currentUser.role !== "ADMIN" && (
        <h1 style={{ color: 'green', marginRight: '10px' }}>
          Waiting for Admin approval for the order.
        </h1>
      )}
      {currentUser.role === "ADMIN" && (
         <Grid item xs={12} textAlign="center">
         <Paper elevation={3} sx={{ padding: '20px', paddingTop: '10px', paddingBottom: '10px',marginTop:'10px',mariginBottom:'10px', border: '1px dashed #00b0ad' }}>
         <Typography variant="h6" component="h2" sx={{ marginBottom: '10px' }}>
         Order Actions
           </Typography>
                      <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '10px',
          }}>
        <Button
        variant="outlined"
        color="primary"
        startIcon={<Add />}
        onClick={handleUpdateAdmin}
        style={{ whiteSpace: 'nowrap' }}
      >
        Approve Order
      </Button>
      </div>
      </Paper>
      </Grid>
      )}
    </div>
  )}
  {orderDetail?.order?.status === "pending" && (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {currentUser.role !== "SUPPLIER" && (
        <h1 style={{ color: 'green', marginRight: '10px' }}>
          Waiting for Supplier confirmation for the order.
        </h1>
      )}
      {currentUser.role === "SUPPLIER" && (
         <Grid item xs={12} textAlign="center">
<Paper elevation={3} sx={{ padding: '20px', paddingTop: '10px', paddingBottom: '10px',marginTop:'10px',mariginBottom:'10px', border: '1px dashed #00b0ad' }}>
<Typography variant="h6" component="h2" sx={{ marginBottom: '10px' }}>
Order Actions
  </Typography>
             <div style={{
   display: 'flex',
   alignItems: 'center',
   justifyContent: 'space-between',
   marginBottom: '10px',
 }}>
              <Button
                startIcon={<ConfirmationNumberTwoTone />}
                variant="outlined"
                color="primary"
                onClick={handleUpdate}
              >
               Approve Order
              </Button>
              <Button
        variant="outlined"
        startIcon={<Cancel />}
        onClick={handleUpdateReject}
        style={{ whiteSpace: 'nowrap',color:"red" }}
      >
        Reject Order 
      </Button>
   </div>
         </Paper>
   </Grid>
      
      )}
      
    </div>
  )}
   {orderDetail?.order?.status === "approved" && (
    <div style={{ display: 'flex', alignItems: 'center' }}>
       {currentUser.role !== "CUSTOMER" && (
        <h4 style={{ color: 'green', marginRight: '10px' }}>
          Waiting for Customer payment for the order.
        </h4>
      )}
        {currentUser.role === "CUSTOMER" && (
    
    <Grid item xs={12} textAlign="center">
    <Paper elevation={3} sx={{ padding: '20px', paddingTop: '10px', paddingBottom: '10px',marginTop:'10px',mariginBottom:'10px', border: '1px dashed #00b0ad' }}>
    <Typography variant="h6" component="h2" sx={{ marginBottom: '10px' }}>
    Order Actions
      </Typography>
                 <div style={{
       display: 'flex',
       alignItems: 'center',
       justifyContent: 'space-between',
       marginBottom: '10px',
     }}>
                     <Typography> Please make the payment for the order.</Typography>
  <Button
    type="submit"
    variant="outlined"
    color="primary"
    style={{ whiteSpace: 'nowrap' }}
    onClick={handlePayment}
  >
    <Send /> Make Payment
  </Button>
       </div>
             </Paper>
       </Grid>
      )}
      
    </div>
  )}
        </Grid>
      </Grid>
    </Grid>
  </div>
  );
};

export default Detail;