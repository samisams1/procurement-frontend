import React from 'react';
import { TextField, styled, Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import Navbar from '../Home/navBar';

const ContactContainer = styled('div')({
  marginTop: 80,
  padding: '40px',
  display: 'flex',
  justifyContent: 'center',
  backgroundColor: '#f7f7f7',
});

const SendMessageContainer = styled('div')({
  backgroundColor: '#ffffff',
  padding: '30px',
  borderRadius: '4px',
  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const ContactDetailsContainer = styled('div')({
  display: 'grid',
  gap: '20px',
});

const ContactDetailsHeading = styled('h3')({
  fontSize: 20,
  marginBottom: 10,
  textAlign: 'center',
});

const ContactDetailsText = styled('p')({
  backgroundColor: '#ffffff',
  padding: '30px',
  borderRadius: '4px',
  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const ContactDetailsIcon = styled('span')({
  fontSize: 20,
  marginRight: 5,
});

const SocialMediaLinksContainer = styled('div')({
  marginTop: 20,
});

const SocialMediaLink = styled('a')({
  display: 'inline-block',
  margin: '0 10px',
  color: '#54a0ff',
  fontSize: 24,
  transition: 'color 0.3s ease',

  '&:hover': {
    color: '#3384d6',
  },
});
const SubmitButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  transition: 'background-color 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.secondary.main,
    boxShadow: `0px 0px 10px 3px ${theme.palette.secondary.main}`,
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
}));
const ContactUs: React.FC = () => {
  return (
    <div>
      <Navbar />
      <ContactContainer>
        <Grid container spacing={2} justifyContent="center">
          
          <Grid item xs={12} md={6}>
            <SendMessageContainer>
              <h2 style={{ fontSize: 24, marginBottom: 20 }}>Send Message</h2>
              <form>
                <TextField
                 variant="outlined"
                  label="Name"
                  fullWidth
                  margin="normal"
                />
                <TextField
                  variant="outlined"
                  label="Email"
                  fullWidth
                  margin="normal"
                />
                <TextField
                  variant="outlined"
                  label="Subject"
                  fullWidth
                  margin="normal"
                />
                <TextField
                  variant="outlined"
                  label="Message"
                  multiline
                  rows={4}
                  fullWidth
                  margin="normal"
                />
                <SubmitButton variant="contained" type="submit" color="primary">Submit</SubmitButton>
              </form>
            </SendMessageContainer>
          </Grid>
          <Grid item xs={12} md={6}>
            <ContactDetailsContainer>
                <ContactDetailsHeading>Contact Details</ContactDetailsHeading>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <ContactDetailsText>
                      <ContactDetailsIcon>&#x1F4CD;</ContactDetailsIcon>
                      Haile gebresilase street, City, Ethiopia
                    </ContactDetailsText>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <ContactDetailsText>
                      <ContactDetailsIcon>&#x260E;</ContactDetailsIcon>
                      +251973316377
                    </ContactDetailsText>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <ContactDetailsText>
                      <ContactDetailsIcon>&#x2709;</ContactDetailsIcon>
                      etproforma@gmail.com
                    </ContactDetailsText>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <ContactDetailsText>
                      <ContactDetailsIcon>&#x1F4F1;</ContactDetailsIcon>
                      Website: www.etproforma.com
                    </ContactDetailsText>
                  </Grid>
                </Grid>
              <div>
                <ContactDetailsHeading>Social Media</ContactDetailsHeading>
                <SocialMediaLinksContainer>
                  <SocialMediaLink href="#">Facebook</SocialMediaLink>
                  <SocialMediaLink href="#">Twitter</SocialMediaLink>
                  <SocialMediaLink href="#">Instagram</SocialMediaLink>
                </SocialMediaLinksContainer>
              </div>
            </ContactDetailsContainer>
          </Grid>
        </Grid>
      </ContactContainer>
    </div>
  );
};

export default ContactUs;