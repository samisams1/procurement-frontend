import React from 'react';
import { styled } from '@mui/material';
import image from '../../../assets/telebirr.png';
import Navbar from '../Home/navBar';

const AboutContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: 80,
});

const PageHeader = styled('h1')({
  fontSize: 32,
  marginBottom: 20,
});

const AboutContent = styled('div')({
  maxWidth: 800,
  padding: 10,
  textAlign: 'center',
  margin: '0 auto',
});

const AboutDescription = styled('div')({
  marginBottom: 40,

  '& h2': {
    fontSize: 24,
    marginBottom: 10,
  },

  '& p': {
    fontSize: 16,
    lineHeight: 1.5,
  },
});

const InstructionsContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  marginBottom: 40,
});

const Column = styled('div')({
  maxWidth: 300,
  padding: 30,
  textAlign: 'center',
  margin: '0 20px',

  '& h3': {
    fontSize: 20,
    marginBottom: 10,
  },

  '& p': {
    fontSize: 16,
    lineHeight: 1.5,
  },

  '& button': {
    padding: '10px 20px',
    fontSize: 16,
    backgroundColor: '#54a0ff',
    color: '#fff',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',

    '&:hover': {
      backgroundColor: '#3384d6',
    },
  },
});

const AboutImage = styled('div')({
  '& img': {
    width: '100%',
    maxWidth: 600,
    height: 'auto',
  },
});

const About: React.FC = () => {
  return (
    <div>
      <Navbar />
      <AboutContainer>
        <PageHeader>About Us</PageHeader>
        <AboutContent>
          <AboutDescription>
            <h2>Our Mission</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
              vitae lectus quis metus lobortis vulputate. Nulla laoreet libero
              a arcu scelerisque, nec mollis mauris dignissim.
            </p>
            <h2>Our Vision</h2>
            <p>
              Aenean leo justo, fermentum sed luctus id, tristique tincidunt
              arcu. Sed pharetra felis sed justo pellentesque gravida. Donec
              auctor neque a pretium luctus.
            </p>
          </AboutDescription>
          <InstructionsContainer>
            <Column>
              <h3>1. Purchasing Request</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Vivamus ac fringilla sem, ut consequat turpis. Integer
                aliquet, orci non efficitur consectetur, lectus risus
                facilisis felis, nec tincidunt urna nunc sit amet sem.
              </p>
              <button>Learn More</button>
            </Column>
            <Column>
              <h3>2. How to Use</h3>
              <p>
                Aenean leo justo, fermentum sed luctus id, tristique
                tincidunt arcu. Sed pharetra felis sed justo pellentesque
                gravida. Donec auctor neque a pretium luctus.
              </p>
              <button>Learn More</button>
            </Column>
          </InstructionsContainer>
        </AboutContent>
        <AboutImage>
          <img src={image} alt="About" />
        </AboutImage>
      </AboutContainer>
    </div>
  );
};

export default About;