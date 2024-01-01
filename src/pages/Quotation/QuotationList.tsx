import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { Grid, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const GET_QUOTATIONS = gql`
query{
  quotations{
    id
    supplierId
    customerId
    shippingPrice
    productPrices{
      price
      product{
        title
      }
    } 
  }
}
`;

interface Quotation {
  id: string;
  supplierId: string;
  customerId: string;
  productPrices: {
    price: number;
    product:{
      title: string;
    }
  }[];
}

const QuotationList: React.FC = () => {
  const navigate = useNavigate();

  const { loading, error, data } = useQuery<{ quotations: Quotation[] }>(GET_QUOTATIONS);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const { quotations } = data!;

  const handleClick = (id: string) => {
    navigate(`/quotationDetail/${id}`);
  };

  return (
    <div>
      <h1>Quotation List</h1>
      <Grid container spacing={2}>
        {quotations.map((quotation) => (
          <Grid item xs={12} sm={6} md={4} key={quotation.id} onClick={() => handleClick(quotation.id)}>
            <Paper elevation={3} style={{ padding: '16px', cursor: 'pointer' }}>
              <Typography variant="h6" component="div">
                Products:
              </Typography>
              <ul>
                {quotation.productPrices.map((product) => (
                  <li key={product.price}>
                    <Typography variant="body1" component="div">
                      Title: {product.product.title}
                    </Typography>
                    <Typography variant="body1" component="div">
                      Price: {product.price}
                    </Typography>
                  </li>
                ))}
              </ul>
              <Typography variant="body1" component="div">
                Quotation ID: {quotation.id}
              </Typography>
              <Typography variant="body1" component="div">
                Supplier ID: {quotation.supplierId}
              </Typography>
              <Typography variant="body1" component="div">
                Customer ID: {quotation.customerId}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default QuotationList;