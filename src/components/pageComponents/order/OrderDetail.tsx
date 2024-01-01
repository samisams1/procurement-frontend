import React, { useContext, useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import {  Grid, TextField, Typography } from '@mui/material';
import Spinner from '../../Spinner';
import { Form } from '../../useForm';
import Button from '../../Button';
import { ORDER_QUERY } from '../../../graphql/Order';
import { UserContext } from '../../../auth/UserContext';

const UPDATE_STORE_MUTATION = gql`
mutation UpdateOrder($id: Float!, $status: String!) {
  updateOrder(id: $id, status: $status) {
    id
    status
  }
}
`;

const GET_ORDER_QUERY = gql`
query GetOrderDetailByOrderId($id: Float!) {
  getOrderDetailByOrderId(id: $id) {
    id
    title
    price
    quantity
  }
}
`;
const OrderDetail = ({ id }: { id: number }) => {
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const {currentUser} = useContext(UserContext);
  const [updateStore] = useMutation(UPDATE_STORE_MUTATION, {
    refetchQueries: [{ query: ORDER_QUERY }],
  });

  const { loading, error, data } = useQuery(GET_ORDER_QUERY, {
    variables: { id },
    
  });

  const [formValues, setFormValues] = useState({}); // Initialize formValues as an empty object
if(!currentUser){
  return <Spinner/>
}
  if (loading) return <Spinner />;
  if (error) return <p>Error: {error.message}</p>;
  const order = data.getOrderDetailByOrderId;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = 1; // Replace with the desired order ID
  const status = "completed"; 
    try {
      await updateStore({
        variables: { id, status },
      });
      setSuccessMessage("Success message");
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  return (
    <Grid container spacing={2}>
 <Form onSubmit={handleSubmit}>
        {order.map((orderDetail: any, index: number) => (
          <Grid container key={index} spacing={2} style={{ marginTop: '10px' }}>
            <Grid item xs={4} spacing={2}>
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
                label={`price ${index + 1}`}
                value={orderDetail.price}
                InputProps={{
                  readOnly: true,
                }}
                variant="outlined"
                fullWidth
                name={`quantity_${index + 1}`}
                onChange={handleChange}
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
                name={`quantity_${index + 1}`}
                onChange={handleChange}
              />
            </Grid>
            
            </Grid>
       ))}
       
       <Grid container >
 <Grid item>
    <h3>Total Quantity = {order.totalQuantity}</h3>
    <Button
            type="submit"
            text="Accept"
            style={{ backgroundColor: '#9ac96f', color: 'white' }}
          />
          </Grid>
          </Grid>
  </Form>
  <Typography>{successMessage}</Typography>
  <Typography>{errorMessage}</Typography>
    </Grid>
  );
};

export default OrderDetail;