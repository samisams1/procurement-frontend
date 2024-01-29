import React from 'react';
import { Typography, Container } from '@mui/material';
import { styled, createTheme, ThemeProvider } from '@mui/system';

const theme = createTheme();

const LandingPageContainer = styled(Container)(({ theme }) => ({
  // styles...
}));

const LandingPageTitle = styled(Typography)(({ theme }) => ({
  // styles...
}));

const LandingPageDescription = styled(Typography)(({ theme }) => ({
  // styles...
}));

const LandingPage: React.FC = () => {

  return (
    <ThemeProvider theme={theme}>
      <LandingPageContainer>
        <LandingPageTitle as="h1" variant="h2">
          Welcome to Our Procurement System
        </LandingPageTitle>
        <LandingPageDescription as="p" variant="h5">
          Simplify and streamline your procurement process with our powerful system.
        </LandingPageDescription>
      </LandingPageContainer>
    </ThemeProvider>
  );
};

export default LandingPage;