import React from 'react';
import { Typography, Container, ThemeProvider, createTheme } from '@mui/material';
import { styled } from '@mui/system';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3', // Blue color
    },
  },
});

const RootContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(8),
  textAlign: 'center',
}));

const NotFoundPage: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <RootContainer>
        <Typography variant="h1" component="h1" gutterBottom>
          404 - Not Found
        </Typography>
      </RootContainer>
    </ThemeProvider>
  );
};

export default NotFoundPage;