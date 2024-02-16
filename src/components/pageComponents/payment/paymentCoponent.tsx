import React, { useState, FormEvent } from 'react';
import { Typography, Grid, Card, CardContent, Paper, InputBase } from '@mui/material';
import PageHeader from '../../PageHeader';
import { NumbersTwoTone, Payment, People } from '@mui/icons-material';
import Popup from '../../Popup';
import Button from '../../Button';
import { gql, useMutation, } from '@apollo/client';
import { useLocation, useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { styled } from '@mui/material/styles';

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
];
interface CreatePaymentData {
  createPayment: {
    id: string;
  };
}
const FullNameInput = styled(InputBase)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(0.5, 1),
  color: theme.palette.text.primary,
  border: `1px solid ${theme.palette.primary.main}`,
  borderRadius: theme.shape.borderRadius,
  '& .MuiInputBase-input': {
    transition: theme.transitions.create('width'),
    width: '100%',
    '&:focus': {
      width: '100%',
    },
  },
}));
const CREATE_PAYMENT_MUTATION = gql`
mutation CreatePayment($input: CreatePaymentInput!) {
  createPayment(input: $input) {
    id
  }
}
`;
const PaymentComponent: React.FC = () => {

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const paymentId = queryParams.get('id');
  const grandTotal = queryParams.get('total');
  const userId = queryParams.get('userId');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [openPopup, setOpenPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [title,setTitle] = useState('');
  const [image,setImage] = useState('');
  const [paymentMethod,setPaymentMethod] = useState('');
  const [fullName,setFullName] = useState('');
  const [referenceNumber,setReferenceNumber] =useState('');

  const [createPaymentMutation] = useMutation<CreatePaymentData>(CREATE_PAYMENT_MUTATION);
  const navigate = useNavigate();
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const { data } = await createPaymentMutation({
        variables: {
          input: {
            amount: Number(grandTotal),
            paidAt: "2024",
            paymentMethod: paymentMethod,
            userId: Number(userId),
            orderId:Number(paymentId),
            status: 'paid',
            referenceNumber: referenceNumber,
            fullName: fullName,
          },
        },
      });

      console.log('Created payment:', data?.createPayment);
      // Payment successful, perform any necessary actions
      console.log('Payment successfully created!', data?.createPayment.id);
      setSuccessMessage('Payment successfully created!');
      setOpenSnackbar(true); // Open the snackbar to show the success message
      setOpenPopup(false); // Close the popup
setTimeout(() => {
  navigate(`/paymentConfirmation/${data?.createPayment.id}`);
  // Replace '/paymentConfirmation' with the actual path of your payment confirmation page
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
                      borderColor: '#00b0ad',
                      boxShadow: '0px 0px 5px 2px #00b0ad',
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
  <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
  <Typography variant="body1" style={{ marginRight: '10px' }}>Transferred By:</Typography>
  <div style={{ marginLeft: 'auto' }}>
    <FullNameInput
      value={fullName}
      onChange={(event) => setFullName(event.target.value)}
      placeholder="Full Name"
      startAdornment={<People />}
      style={{ textAlign: 'right' }}
    />
  </div>
</div>
    <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
      <Typography variant="body1" style={{ marginRight: '10px' }}>Reference Number:</Typography>
        <div style={{ marginLeft: 'auto' }}>
      <FullNameInput
        value={referenceNumber}
        onChange={(event) => setReferenceNumber(event.target.value)}
        placeholder="Please Enter Reference Number"
        startAdornment={<NumbersTwoTone />}
        style={{ textAlign: 'right' }}
      />
    </div>
    </div>
    <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
      <Typography variant="body1" style={{ marginRight: '10px' }}>Payment Date:</Typography>
      {formattedCurrentDate}
    </div>

    <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
      <Typography variant="body1" style={{ marginRight: '10px' }}>Grand Total:{grandTotal}</Typography>
   
    </div>

    <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
      <Button type="submit" text="Pay" style={{ marginTop: '20px' }} disabled={!fullName || !referenceNumber} />
    </form>
  </div>
</div>
   </Popup>

    </Grid>
  );
};

export default PaymentComponent;