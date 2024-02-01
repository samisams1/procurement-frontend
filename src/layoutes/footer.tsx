import React from 'react';
import { Typography, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';

const FooterContainer = styled(Grid)({
  fontSize: '0.8rem',
  color: '#fff',
  backgroundColor: '#00b0ad',
  textAlign: 'center',
  bottom: 0,
  left: 0,
  right: 0,
  justifyContent: 'center',
  alignItems: 'center',
});

const FooterLink = styled(Typography)({
  cursor: 'pointer',
  '&:hover': {
    textDecoration: 'underline',
  },
});



const Powdered = styled(Typography)({
  backgroundColor: '#000',
  color: '#fff',
  fontSize: '0.8rem',
});

const Footer = () => {
  return (
    <FooterContainer container spacing={2} justifyContent="center">
      <Grid item xs={12} sm={4}>
        <Typography variant="h6">Who we are/About us</Typography>
        <FooterLink>Terms of use</FooterLink>
        <FooterLink>Register as a membership</FooterLink>
        <FooterLink>How to register</FooterLink>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Typography variant="h6">Customer support</Typography>
        <FooterLink>Privacy policy</FooterLink>
        <FooterLink>How to be a partner/Agent</FooterLink>
        <FooterLink>Advertise with us</FooterLink>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Typography variant="h6">Contact us</Typography>
        <FooterLink>Send your feedback</FooterLink>
        <FooterLink>Connect with us (FB, TG, IG, Wapp...)</FooterLink>
      </Grid>
      <Grid item xs={12}>
        <Powdered>
          <Typography variant="body2">
            © 2024 samisams. All rights reserved.
          </Typography>
        </Powdered>
      </Grid>
    </FooterContainer>
  );
};

export default Footer;