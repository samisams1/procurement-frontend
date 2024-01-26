import React, { useState, FormEvent } from 'react';
import { Typography, Grid, Card, CardContent, Paper } from '@mui/material';
import PageHeader from '../../PageHeader';
import { Payment } from '@mui/icons-material';
import Popup from '../../Popup';
import Button from '../../Button';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  image:string;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'tele birr',
    name: 'Tele Birr',
    description: 'Pay securely with Tel Birr.',
    image:'telebirr.png'
  },
  {
    id: 'cbe birr',
    name: 'Cbe Birr',
    description: '',
    image:'cbe.jpeg'

  },
  // Add more payment methods as needed
];

interface CreatePaymentData {
  createPayment: {
    id: string;
  };
}

/*interface PaymentCreateInput {
  invoiceId: number;
  amount: number;
  userId: number;
}
*/
const GET_ORDER_QUERY = gql`
query GetOrderById($id: Int!) {
    getOrderById(id: $id) {
      id
      customerId
      totalPrice
      tax
      referenceNumber
      customer{
        user{
          username
        }
      }
    }
  }
`;

const CREATE_PAYMENT_MUTATION = gql`
  mutation CreatePayment($input: PaymentCreateInput!) {
    createPayment(input: $input) {
      id
    }
  }
`;
const PaymentComponent: React.FC = () => {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [openPopup, setOpenPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [title,setTitle] = useState('');
  const [image,setImage] = useState('');
  const [paymentMethod,setPaymentMethod] = useState('');

  const { id } = useParams<{ id?: string }>();
  const [createPaymentMutation] = useMutation<CreatePaymentData>(CREATE_PAYMENT_MUTATION);
  const navigate = useNavigate();

  const { loading, error, data } = useQuery(GET_ORDER_QUERY, {
    variables: { id: Number(id) },
  });

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const order = data?.getOrderById;
  const customerId = order.customerId;
  const customer = order.customer?.user?.username;
  const totalPrice = order.totalPrice;
  const tax = order.tax;
  const referenceNumber = order.referenceNumber;
console.log(data)
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const paymentData:any = {
        amount: totalPrice + tax,
        userId: Number(customerId),
        paymentMethod:paymentMethod,
        status:'paid',
        referenceNumber:'Iv3',
        orderId:Number(id)
      };

      // Call the createPayment mutation
      const { data } = await createPaymentMutation({ variables: { input: paymentData } });

      // Payment successful, perform any necessary actions
      console.log('Payment successfully created!', data?.createPayment.id);
      setSuccessMessage('Payment successfully created!');
      setOpenSnackbar(true); // Open the snackbar to show the success message
      setOpenPopup(false); // Close the popup
      // Delay navigation to the invoice page after 2 seconds
       setTimeout(() => {
        navigate('/paymentConfirmation');
        // Replace '/invoice' with the actual path of your invoice page
      }, 3000);
    } catch (error) {
      console.error('Error creating payment:', error);
      setSuccessMessage('Error creating payment. Please try again.');
      setOpenSnackbar(true); // Open the snackbar to show the success message
      setOpenPopup(false); // Close the popup

    }
  };

  const handlePayment = (methodId: string,name:string,image:string) => {
    // Handle payment logic here
    setTitle(name);
    setImage(image);
    setPaymentMethod(name)
    console.log(`Payment completed with method: ${methodId}`);
    setSelectedMethod(methodId);
    setOpenPopup(true);
  };
  const currentDate = new Date();
  const formattedCurrentDate = `${currentDate.getFullYear()}/${currentDate.getMonth() + 1}/${currentDate.getDate()}`;

  return (
    <Grid container spacing={2}>
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>

      <Grid item xs={12}>
        <Paper elevation={3} sx={{ padding: '20px' }}>
          <PageHeader
            title="SELECT PAYMENT METHOD"
            subTitle="Select your preferred payment method:"
            icon={<Payment fontSize="large" />}
          />
          <Grid container spacing={2}>
            {paymentMethods.map((method) => (
              <Grid item xs={12} sm={6} md={4} key={method.id}>
                <Card
                  elevation={selectedMethod === method.id ? 5 : 3}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      borderColor: '#1c9fef',
                      boxShadow: '0px 0px 5px 2px #1c9fef',
                    },
                  }}
                  onClick={() => handlePayment(method.id,method.name,method.image)}
                >
                  <CardContent
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                      textAlign: 'center',
                    }}
                  >

                    
                    <img
                      src={require(`../../../assets/${method.image}`)}
                      alt={method.name}
                      style={{ width: '80px', marginBottom: '16px' }}
                    />
                    <Typography variant="h6" gutterBottom>
{method.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {method.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Grid>
      <Popup image={image} title={title} openPopup={openPopup} setOpenPopup={setOpenPopup}>
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ marginBottom: '20px' }}>
          <Typography variant="h6">Payment Details</Typography>
        </div>
        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ marginBottom: '10px' }}>
            <Typography variant="body1">Transferred By Name:{customer}</Typography>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <Typography variant="body1">Requested RFNO: 58547855</Typography>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <Typography variant="body1">Ordered RFNO: {referenceNumber}</Typography>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <Typography variant="body1">Payment Date: {formattedCurrentDate}</Typography>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <Typography variant="body1">Grand Total:  {(totalPrice + tax).toLocaleString() + " "} Birr</Typography>
          </div>

          <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
            

            <Button type="submit" text="Pay" style={{ marginTop: '20px' }} />
          </form>
        </div>
      </div>
    </Popup>

    </Grid>
  );
};

export default PaymentComponent;