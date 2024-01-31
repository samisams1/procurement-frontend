import React from 'react';
import { styled } from '@mui/material';
import Navbar from '../Home/navBar';

const ContactContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: 40,
});

const PageHeader = styled('h1')({
  fontSize: 32,
  marginBottom: 20,
  textAlign: 'center',
});

const ContactContent = styled('div')({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 20,
  maxWidth: 800,
  padding: 20,
  textAlign: 'center',
  margin: '0 auto',
});

const SendMessageContainer = styled('div')({
  gridColumn: '1 / 2',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: '#f5f5f5',
  padding: 20,
  borderRadius: 4,
});

const ContactDetailsContainer = styled('div')({
  gridColumn: '2 / 3',
  display: 'grid',
  gap: 10,
});

const ContactDetailsHeading = styled('h3')({
  fontSize: 20,
  marginBottom: 10,
});

const ContactDetailsText = styled('p')({
  fontSize: 16,
  lineHeight: 1.5,
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

const ContactUs: React.FC = () => {
  return (
    <div>
      <Navbar />
      <ContactContainer>
        <PageHeader>Contact Us</PageHeader>
        <ContactContent>
          <SendMessageContainer>
            <h2>Send Message</h2>
            <form>
              <input type="email" placeholder="Email" />
              <input type="text" placeholder="Subject" />
              <textarea placeholder="Message"></textarea>
              <button>Submit</button>
            </form>
          </SendMessageContainer>
          <ContactDetailsContainer>
            <div>
              <ContactDetailsHeading>Contact Details</ContactDetailsHeading>
              <div className="sm:grid sm:grid-cols-12">
                <div className="sm:col-span-12 md:col-span-6">
                  <ContactDetailsText>
                    Address: 123 Main Street, City, Country
                  </ContactDetailsText>
                </div>
                <div className="sm:col-span-12 md:col-span-6">
                  <ContactDetailsText>
                    Phone: +1 234 567 890
                  </ContactDetailsText>
                </div>
                <div className="sm:col-span-12 md:col-span-6">
                  <ContactDetailsText>
                    Email: info@example.com
                  </ContactDetailsText>
                </div>
              </div>
            </div>
            <div>
              <ContactDetailsHeading>Social Media</ContactDetailsHeading>
              <SocialMediaLinksContainer>
                <SocialMediaLink href="#">Facebook</SocialMediaLink>
                <SocialMediaLink href="#">Twitter</SocialMediaLink>
                <SocialMediaLink href="#">Instagram</SocialMediaLink>
              </SocialMediaLinksContainer>
            </div>
          </ContactDetailsContainer>
        </ContactContent>
      </ContactContainer>
    </div>
  );
};

export default ContactUs;