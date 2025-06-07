import React from 'react';
import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/link-context';
import RoutePage from './RoutePage';
import UserProvider from './auth/UserContext';
import { BrowserRouter as Router } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { PurchaseRequestProvider } from './context/purchaseRequestContext';
import { QuotationProvider } from './context/quotationContext';
const App: React.FC = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then((registration: ServiceWorkerRegistration) => {
          console.log('Service worker registered:', registration);
        })
        .catch(error => {
          console.error('Service worker registration failed:', error);
        });
    });
  }
  const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('token');

    return {
      headers: {
        ...headers,
        Authorization: token ? `Bearer ${token}` : null,
      },
    };
  });
const httpLink = new HttpLink({ uri: 'http://localhost:4000/graphql' });
//const httpLink = new HttpLink({ uri: 'https://test.nilesoftdemo.com/graphql' });
  const link = authLink.concat(httpLink);

  const client = new ApolloClient({
    link: link,
    cache: new InMemoryCache(),
  });

  const theme = createTheme({
    palette: {
      primary: {
        main: '#00b0ad',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <UserProvider>
        <ApolloProvider client={client}>
          <Router>
            <PurchaseRequestProvider>
              <QuotationProvider>
              <RoutePage />
              </QuotationProvider>
            </PurchaseRequestProvider>
          </Router>
        </ApolloProvider>
      </UserProvider>
    </ThemeProvider>
  );
};

export default App;
  
    
