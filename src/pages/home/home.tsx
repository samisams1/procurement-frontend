import React, { useState } from 'react';
import { styled, Typography, Container } from '@mui/material';
import Grid from '@mui/material/Grid';
import Navbar from './Home/navBar';
//import { ShoppingCart } from '@mui/icons-material';
import '../../assets/ronald.jpeg'
import TellUsWhatYouWant from './Home/tellUsWhatYouWant';
import Testimonials from './Home/testimonials';
import Footer from '../../layoutes/footer';
import Popup from '../../components/Popup';
import Login from '../login/Login';

const ContactContainer = styled('div')({
  marginTop: 80,
  padding: '0px',
  display: 'flex',
  justifyContent: 'center',
  backgroundColor: '#f7f7f7',
});
const ProductCategoriesContainer = styled('div')({
  backgroundColor: '#fff',
});
const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  marginBottom: theme.spacing(4),
  color: '#333333',
}));

const CategoryContainer = styled(Grid)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));
const CategoryIcon = styled('div')(({ theme }) => ({
  width: '64px',
  height: '64px',
  borderRadius: '50%',
  backgroundColor: '#00b0ad',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: theme.spacing(2),
  fontSize: '32px',
  color: '#1c9fef',
}));
const CategoryTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  color: '#333333',
}));
/*const SubmitButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#00b0ad',
  color: theme.palette.primary.contrastText,
  transition: 'background-color 0.3s ease',
  '&:hover': {
    backgroundColor: '#33e7e4',
    boxShadow: `0px 0px 10px 3px #33e7e4`,
    transform: 'scale(1.1)',
  },
  height: '40px',
  borderRadius: '30px',
  padding: theme.spacing(0, 4),
  '& .MuiButton-label': {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
}));*/
const TitleContainer = styled(Container)(({ theme }) => ({
  marginTop: '1rem',
}));

const LandingPageTitle = styled(Typography)(({ theme }) => ({
  fontSize: '3rem',
  fontWeight: 'bold',
  marginBottom: '1rem',
  color: '#000000',
  [theme.breakpoints.down('sm')]: {
    fontSize: '2rem',
  },
  [theme.breakpoints.down('xs')]: {
    fontSize: '1.5rem',
  },
}));

const LandingPageDescription = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  marginBottom: '2rem',
  color: '#000000',
  textAlign: 'center',
  [theme.breakpoints.down('sm')]: {
    fontSize: '1rem',
  },
}));
//how it works 
const SectionContainer = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: "#00b0ad",
  color: theme.palette.primary.contrastText,
  
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
marginBottom: theme.spacing(2),
fontWeight: 'bold',
color:'black'
}));

const StepContainer = styled(Grid)(({ theme }) => ({
marginBottom: theme.spacing(4),
}));

const StepIcon = styled('div')(({ theme }) => ({
width: '64px',
height: '64px',
borderRadius: '50%',
color:'#00b0ad',
backgroundColor: '#000000',
display: 'flex',
justifyContent: 'center',
alignItems: 'center',
marginBottom: theme.spacing(2),
}));

const StepTitle = styled(Typography)(({ theme }) => ({
fontWeight: 'bold',
color: '#000000',

}));

const StepDescription = styled(Typography)(({ theme }) => ({
color: '#666666',
}));
//service 
const ServiceTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  marginBottom: theme.spacing(1),
  color: '##00b0ad',
}));

const ServiceList = styled("ul")(({ theme }) => ({
  listStyle: "none",
  paddingLeft: theme.spacing(2),
}));

const ServiceItem = styled("li")(({ theme }) => ({
  marginBottom: theme.spacing(1),
  position: "relative",
  paddingLeft: theme.spacing(2),
  "&::before": {
    content: '""',
    position: "absolute",
    left: 0,
    top: "50%",
    transform: "translateY(-50%)",
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: '#00b0ad',
  },
}));
//service
const StyledGrid = styled(Grid)(({ theme }) => ({
  backgroundImage: 'url(../../assets/ronald.jpeg)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundColor:'#00b0ad',
}));
///Request


const Home: React.FC = () => {
  const [openPopup,setOpenPopup] = useState(false);
 /* const handleRequestClick = () => {
    setOpenPopup(true);
  };*/
  const categories = [
    { title: 'Electronics', icon: '💻' },
    { title: 'Fashion', icon: '👗' },
    { title: 'Home & Kitchen', icon: '🏠' },
    { title: 'Beauty & Personal Care', icon: '💄' },
    { title: 'Sports & Outdoors', icon: '⚽' },
  ];
  return (
    <div>
      <Navbar />
      <ContactContainer >
        <Grid container spacing={2} justifyContent="center">
          <TitleContainer>
          <LandingPageTitle>
            Welcome to Our Procurement System
          </LandingPageTitle>
          <LandingPageDescription>
            Simplify and streamline your procurement process with our powerful system.
            We provide a comprehensive solution that helps you manage your procurement
            activities efficiently and effectively.
          </LandingPageDescription>
        </TitleContainer> 
         <StyledGrid item xs={12} md={12} >
  <SectionTitle variant="h5">Our Services</SectionTitle>
  <ServiceTitle variant="h6">E-Procurement System</ServiceTitle>
  <ServiceList>
    <ServiceItem>Streamlined procurement processes</ServiceItem>
    <ServiceItem>Automated purchase requisitions and approvals</ServiceItem>
    <ServiceItem>Electronic supplier management</ServiceItem>
    <ServiceItem>Real-time inventory tracking</ServiceItem>
    <ServiceItem>Integrated vendor catalog management</ServiceItem>
    <ServiceItem>Automated invoice processing and payments</ServiceItem>
    <ServiceItem>Analytics and reporting for better decision-making</ServiceItem>
    <ServiceItem>Secure and compliant data management</ServiceItem>
  </ServiceList>
         </StyledGrid>
          <Grid item xs={12} md={12} sm={12}>
        
          <ProductCategoriesContainer>
      <Title variant="h5">Product Categories</Title>
      {categories.map((category, index) => (
        <CategoryContainer key={index} item xs={12} sm={6} md={4}>
          <CategoryIcon>{category.icon}</CategoryIcon>
          <CategoryTitle variant="h6">{category.title}</CategoryTitle>
        </CategoryContainer>
      ))}
      </ProductCategoriesContainer>
        
        <SectionContainer container alignItems="center" justifyContent="center">
        <Grid item xs={12} md={12} lg={12}>
        <SectionTitle variant="h4">How It Works</SectionTitle>
        <StepContainer container spacing={4}>
          <Grid item xs={12} md={4}>
            <StepIcon>
              <Typography variant="h5">1</Typography>
            </StepIcon>
            <StepTitle variant="h6">Create a Purchase Request</StepTitle>
            <StepDescription>
              Submit a detailed purchase request specifying the items or services needed.
            </StepDescription>
          </Grid>
          <Grid item xs={12} md={4}>
            <StepIcon>
              <Typography variant="h5">2</Typography>
            </StepIcon>
            <StepTitle variant="h6">Approval Process</StepTitle>
            <StepDescription>
              The request goes through an approval process by the designated authorities.
            </StepDescription>
          </Grid>
          <Grid item xs={12} md={4}>
            <StepIcon>
              <Typography variant="h5">3</Typography>
            </StepIcon>
            <StepTitle variant="h6">Create RFQ</StepTitle>
            <StepDescription>
              Create a Request for Quotation (RFQ) to obtain quotes from suppliers.
            </StepDescription>
          </Grid>
          <Grid item xs={12} md={4}>
            <StepIcon>
              <Typography variant="h5">4</Typography>
            </StepIcon>
            <StepTitle variant="h6">Send Order</StepTitle>
            <StepDescription>
              Send the order to the selected supplier after RFQ approval.
            </StepDescription>
          </Grid>
          <Grid item xs={12} md={4}>
            <StepIcon>
              <Typography variant="h5">5</Typography>
            </StepIcon>
            <StepTitle variant="h6">Order Confirmation</StepTitle>
            <StepDescription>
              The supplier confirms the order and provides an order confirmation.
            </StepDescription>
          </Grid>
          <Grid item xs={12} md={4}>
            <StepIcon>
              <Typography variant="h5">6</Typography>
            </StepIcon>
            <StepTitle variant="h6">Admin Approval</StepTitle>
            <StepDescription>
              The order is approved by the admin for further processing.
            </StepDescription>
          </Grid>
          <Grid item xs={12} md={4}>
            <StepIcon>
              <Typography variant="h5">7</Typography>
            </StepIcon>
            <StepTitle variant="h6">Send Order for Payment</StepTitle>
            <StepDescription>
              The approved order is sent for payment processing.
            </StepDescription>
          </Grid>
          <Grid item xs={12} md={4}>
            <StepIcon>
              <Typography variant="h5">8</Typography>
            </StepIcon>
            <StepTitle variant="h6">Payment Confirmation</StepTitle>
            <StepDescription>
              Confirmation of payment received from the payment processor.
            </StepDescription>
          </Grid>
          <Grid item xs={12} md={4}>
            <StepIcon>
              <Typography variant="h5">9</Typography>
            </StepIcon>
            <StepTitle variant="h6">Create Invoices</StepTitle>
            <StepDescription>
              Generate and send invoices for the completed order.
            </StepDescription>
          </Grid>
          <Grid item xs={12} md={4}>
            <StepIcon>
              <Typography variant="h5">10</Typography>
            </StepIcon>
            <StepTitle variant="h6">Shipping and Delivery</StepTitle>
            <StepDescription>
              Arrange for the shipping and delivery of the ordered items.
            </StepDescription>
          </Grid>
        </StepContainer>
      </Grid>
      </SectionContainer>
      <TellUsWhatYouWant/>
      <Testimonials/>
      <Footer/>
          </Grid>
        </Grid>
      </ContactContainer>
      <Popup title="Login" openPopup={openPopup} setOpenPopup={setOpenPopup}>
          <Login />
        </Popup>
    </div>
  );
};

export default Home;