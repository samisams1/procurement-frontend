import React from 'react';
import { useQuery, gql } from '@apollo/client';
import {Grid,Paper,Typography} from '@mui/material';
import { useNavigate } from 'react-router-dom';
const GET_QUOTATIONS = gql`
  query {
    quotations {
      id
      supplierId
      customerId
      shippingPrice
      productPrices {
        price
        product {
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
  shippingPrice: number;
  productPrices: {
    price: number;
    product: {
      title: string;
    };
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

  const calculateSubtotal = (quotation: Quotation) => {
    let subtotal = 0;
    quotation.productPrices.forEach((product) => {
      subtotal += product.price;
    });
    return subtotal;
  };
  const calculateTotal = (quotation: Quotation) => {
    const subtotal = calculateSubtotal(quotation);
    const vat = subtotal * 0.2; // Assuming 20% VAT
    const total = subtotal + vat + quotation.shippingPrice;
    return total;
  };
  /*const formatCreatedAt = (createdAt: string): string => {
    const date = new Date(createdAt);
    const year = date.getFullYear().toString().padStart(4, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const milliseconds = date.getMilliseconds().toString().padStart(3, '0');
    return `${year}-${month}-${day} time ${hours}:${minutes}:${seconds}.${milliseconds}`;
  }; */
  return (
    <div>
      <Typography
        variant="h3"
        component="div"
        style={{
          color: '#3c44b1',
          textAlign: 'center',
          margin: 'auto',
        }}
      >
        Quotation List
      </Typography>
      <Grid container spacing={2}>
        {quotations.map((quotation) => (
          <Grid item xs={12} sm={6} md={4} key={quotation.id} onClick={() => handleClick(quotation.id)}>
            <Paper
              elevation={3}
              style={{
                padding: '16px',
                cursor: 'pointer',
                backgroundColor: '#e0e0e0',
                position: 'relative',
              }}
            >
              <Typography> id: {quotation.id}  customerId: {quotation.customerId}  supplierId: {quotation.supplierId}</Typography>
              <Typography variant="body1" component="div">
                Shipping Price: {quotation.shippingPrice}
              </Typography>
              <Typography variant="body1" component="div">
                Subtotal: {calculateSubtotal(quotation)}
              </Typography>
              <Typography variant="body1" component="div">
                VAT: {calculateSubtotal(quotation) * 0.2} {/* Assuming 20% VAT */}
              </Typography>
              <Typography variant="body1" component="div">
                Total: {calculateTotal(quotation)}
              </Typography>
              <Typography variant="body1" component="div" style={{ color: '#555' }}>
                Created At: {quotation.shippingPrice}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};
export default QuotationList;