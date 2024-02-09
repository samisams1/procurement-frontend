import React, { useContext, useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { Grid, TextField, Typography } from '@mui/material';
import Spinner from '../../../Spinner';
import { Form } from '../../../useForm';
import Button from '../../../Button';
import { ORDER_QUERY } from '../../../../graphql/Order';
import { UserContext } from '../../../../auth/UserContext';

const UPDATE_ORDER_MUTATION = gql`
  mutation UpdateOrder($id: Float!, $status: String!) {
    updateOrder(id: $id, status: $status) {
      id
      status
    }
  }
`;

const GET_ORDER_QUERY = gql`
  query GetOrderDetailByOrderId($id: Int!) {
    getOrderDetailByOrderId(id: $id) {
      id
      title
      price
      quantity
    }
  }
`;

const OrderDetail = ({ id, status, newstatus }: { id: number; status: string; newstatus: string }) => {
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { currentUser } = useContext(UserContext);
  const [updateOrder] = useMutation(UPDATE_ORDER_MUTATION, {
    refetchQueries: [{ query: ORDER_QUERY }],
  });

  const { loading, error, data } = useQuery(GET_ORDER_QUERY, {
    variables: { id:id },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateOrder({
        variables: { id, status: newstatus },
      });
      setSuccessMessage('Success message');
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  if (!currentUser || loading) {
    return <Spinner />;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const order = data.getOrderDetailByOrderId;

  // Calculate total amount
  let totalAmount = 0;
  order.forEach((orderDetail: any) => {
    totalAmount += orderDetail.quantity * orderDetail.price;
  });

  let buttonArea = null;
  let message = '';

  if (status === 'pending') {
    message = 'Please  the supplier  review the order and comform!';
  } else if (status === 'comformed') {
    buttonArea = (
      <Grid container justifyContent="center">
        <Grid item>
          <Button
            type="submit"
            text="Approve"
            style={{ backgroundColor: '#9ac96f', color: 'white' }}
          />
        </Grid>
      </Grid>
    );
    message = 'Supplier comformed the order Waiting for admin approval!';
  } else if (status === 'approved') {
    message = 'The admin aproved waiting for customer make payments!';
  }

  return (
    <Grid container spacing={2}>
      <Form onSubmit={handleSubmit}>
        {order.map((orderDetail: any, index: number) => (
          <Grid
            container
            key={index}
            spacing={2}
            style={{ marginTop: '10px' }}
          >
            <Grid item xs={4}>
              <TextField
                label={`Product Name ${index + 1}`}
                value={orderDetail.title}
                InputProps={{
                  readOnly: true,
                }}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label={`Price ${index + 1}`}
                value={orderDetail.price}
                InputProps={{
                  readOnly: true,
                }}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label={`Quantity ${index + 1}`}
                value={orderDetail.quantity}
                InputProps={{
                  readOnly: true,
                }}
                variant="outlined"
                fullWidth
              />
            </Grid>
          </Grid>
        ))}

        <Grid container justifyContent="center">
          <Grid item>
            <h3>Total Amount = {totalAmount}</h3>
          </Grid>
        </Grid>

        <Typography>{successMessage}</Typography>
        <Typography>{errorMessage}</Typography>
        <Typography style={{ color: 'green', textAlign: 'center' }}>{message}</Typography>
        {buttonArea}
      </Form>
    </Grid>
  );
};

export default OrderDetail;