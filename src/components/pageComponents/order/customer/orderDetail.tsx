import React, { useContext } from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';
import { Grid, Paper, Typography } from '@mui/material';
import MUIDataTable, { MUIDataTableOptions, MUIDataTableMeta } from 'mui-datatables';
import PageHeader from '../../../PageHeader';
import numberToWords from 'number-to-words';
import Button from '../../../Button';
import Spinner from '../../../Spinner';
import { UserContext } from '../../../../auth/UserContext';
import { useNavigate, useParams } from 'react-router-dom';

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
      name: string | null;
    };
    customer: {
      username: string | null;
    };
  };
}

interface GetOrderDetailByOrderIdResponse {
  getOrderDetailByOrderId: OrderDetail[];
}

interface GetOrderDetailByOrderIdVariables {
  getOrderDetailByOrderIdId: number;
}

const GET_ORDER_DETAIL_BY_ORDER_ID = gql`
  query GetOrderDetailByOrderId($getOrderDetailByOrderIdId: Int!) {
    getOrderDetailByOrderId(id: $getOrderDetailByOrderIdId) {
      id
      orderId
      title
      price
      quantity
      productId
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
        }
        customer {
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
  const [updateOrder] = useMutation(UPDATE_ORDER);
  const { loading, error, data } = useQuery<GetOrderDetailByOrderIdResponse, GetOrderDetailByOrderIdVariables>(
    GET_ORDER_DETAIL_BY_ORDER_ID,
    {
      variables: { getOrderDetailByOrderIdId: Number(id)},
    }
  );
  const { currentUser } = useContext(UserContext);
  if (!currentUser) {
    return <Spinner />;
  }
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const orderDetail = data?.getOrderDetailByOrderId[0];
  const order = orderDetail?.order;
  const products = orderDetail?.product;
 
  const columns = [
    // Define your product table columns here
    {
      name: 'title',
      field: 'title',
    },
    
    {
      name: 'Description',
      field: 'Description',
    },
    // ... add other columns as needed
    {
      name: 'quantity',
      field: 'quantity',
    },
    {
      name: 'Price',
      field: 'price',
      options: {
        customBodyRender: (value: number | undefined, tableMeta: MUIDataTableMeta) => {
          return   orderDetail?.price
           
        },
      },
    },
  ];

  const productsArray: Product[] = products ? [products] : [];

  const options: MUIDataTableOptions = {
    responsive: 'vertical',
    selectableRows: 'none',
    customFooter: () => {
      return (
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '16px' }}>
          <div style={{ marginRight: 'auto' }}>
             <Typography variant="h6" align="right">Subtotal:&nbsp;</Typography>
            <Typography variant="h6" align="right">Shipping Cost:</Typography>
            <Typography variant="h6" align="right">Tax:</Typography>
            <Typography variant="h6" align="right">Grand Total:</Typography>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <Typography variant="h6" align="left">{subtotal} Birr</Typography>
            <Typography variant="h6" align="left">{order?.shippingCost} Birr</Typography>
            <Typography variant="h6" align="left">{tax} Birr</Typography>
            <Typography variant="h6" align="left">{grandTotal} Birr</Typography>
          </div>
        </div>
      );
    },
  };

  const subtotal = productsArray.reduce((acc, product) => {
    return acc + (product?.quantity ?? 0) * (orderDetail?.price ?? 0);
  }, 0);

  const tax = subtotal * 0.15;
  const grandTotal = subtotal + tax + (order?.shippingCost ?? 0);
  const amountInWords = numberToWords.toWords(grandTotal);
 /* const handlePayment = () => {
    navigate(`/payment/${1}`);
  };*/

  const handlePayment = () => {
    const paymentId = id;
    const userId = currentUser.id;
    navigate(`/payment?id=${paymentId}&total=${grandTotal}&userId=${userId}`);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data } = await updateOrder({ variables: { id:Number(id), input:"comformed" } });
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
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Grid>
        <PageHeader
      title="Purchas Order"
      subTitle ="pircase Order"
      />
    <Grid container spacing={2}>
      {/* Order By */}
      <Grid item xs={4}>
        <Paper>
          <Typography variant="h6">Order By</Typography>
          <Typography variant="body1">
          <p>Customer Name: {orderDetail?.order?.customer?.username}</p>
          </Typography>
          <Typography variant="body1">
            Reference Number: {orderDetail?.order?.referenceNumber}
          </Typography>
          <Typography variant="body1">
            Created At: {orderDetail?.order?.createdAt}
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
            Shipping Cost: {orderDetail?.order?.shippingCost}
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
        <MUIDataTable
          title="Product Details"
          data={productsArray}
          columns={columns}
          options={options}
        />
        <Grid><h3>In words<span style={{color:"red"}}>{amountInWords}</span> Birr</h3></Grid>
        <Grid>
        {orderDetail?.order?.status === "comformed" && (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {currentUser.role !== "ADMIN" && (
        <h1 style={{ color: 'green', marginRight: '10px' }}>
          Waiting for Admin approval for the order.
        </h1>
      )}
      {currentUser.role === "ADMIN" && (
        <Button
          variant="contained"
          color="secondary"
          onClick={handleUpdateAdmin}
          text="Approve Order"
        />
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
        <div>
          <h4 style={{ color: 'green', marginRight: '10px' }}>
            Please confirm the order.
          </h4>
          <Button
            variant="contained"
            color="secondary"
           onClick={handleUpdate}
            text="Confirm Order"
          />
        </div>
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
        <div>
          <h4>
            Please make the payment for the order.
          </h4>
          <Button
            variant="contained"
           onClick={handlePayment}
            text="Make Payment"
          />
        </div>
      )}
      
    </div>
  )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Detail;