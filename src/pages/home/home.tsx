import React, { useState } from 'react';
import { Typography, Container, Grid } from '@mui/material';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import Layout from './Home';
import Popup from '../../components/Popup';
import Login from '../login/Login';
import Testimonials from './Home/testimonials';
import Services from './Home/services';
import NewPurchaseRequest from './Home/NewPurchaseRequest';
import HowItWorksSection from './Home/HowItWorksSection';
import TellUsWhatYouWant from './Home/tellUsWhatYouWant';
import ProductCategories from './Home/ProductCategories';
import NewOrderRequest from './Home/NewOrderRequest';

const theme = createTheme();

const LandingPageContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1rem',
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    padding: '2rem',
  },
  [theme.breakpoints.up('md')]: {
    padding: '4rem',
  },
}));

const TitleContainer = styled(Container)(({ theme }) => ({
  marginTop: '1rem',
}));

const LandingPageTitle = styled(Typography)(({ theme }) => ({
  fontSize: '3rem',
  fontWeight: 'bold',
  marginBottom: '1rem',
  color: '#333',
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
  color: '#666',
  textAlign: 'center',
  [theme.breakpoints.down('sm')]: {
    fontSize: '1rem',
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '2rem',
  fontWeight: 'bold',
  marginBottom: '1rem',
  color: '#333',
}));

const LandingPage: React.FC = () => {
  const [openPopup, setOpenPopup] = useState(false);
  /*const handleClick = () => {
    setOpenPopup(true);
  };*/

  return (
    <ThemeProvider theme={theme}>
      <Layout />
      <LandingPageContainer>
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
        
        <Grid item xs={12} md={6}>
            <SectionTitle>Product Categories</SectionTitle>
            <ProductCategories/>
          </Grid>
        <Grid item xs={12} md={6}>
            <SectionTitle>How It Works</SectionTitle>
            <HowItWorksSection/>
          </Grid>
        <Grid item xs={12} md={6}>
            <SectionTitle>New Purchase Request</SectionTitle>
            {/* Add your content for new purchase request */}
            <NewPurchaseRequest/>
          </Grid>
        <Grid item xs={12} md={6}>
            <SectionTitle>Our Services</SectionTitle>
           <Services/>
           <Grid item xs={12} md={6}>
            <SectionTitle>Your Orders</SectionTitle>
            <NewOrderRequest/>
          </Grid>
           <Grid item xs={12} md={6}>
            <SectionTitle>Tell Us What You Want?</SectionTitle>
            <TellUsWhatYouWant/>
          </Grid>
          </Grid>
        <Testimonials/>
        <Popup openPopup={openPopup} onClose={() => setOpenPopup(false)}>
          <Login />
        </Popup>
      </LandingPageContainer>
    </ThemeProvider>
  );
};

export default LandingPage;