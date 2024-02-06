import React, { useEffect } from 'react';
import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache, split } from '@apollo/client';
import { setContext } from '@apollo/link-context';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import RoutePage from './RoutePage';
//import UserProvider from './components/auth/UserContext';
import { initWebSocket } from './websocket';
import UserProvider from './auth/UserContext';
import { BrowserRouter as Router } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';


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
 // https://test.nilesoftdemo.com/graphql
//const httpLink = new HttpLink({ uri: 'https://54.172.139.217/graphql' });
//const httpLink = new HttpLink({ uri: 'http://localhost:4000/graphql' });
const httpLink = new HttpLink({ uri: 'https://test.nilesoftdemo.com/graphql' });
  const wsLink = new WebSocketLink({
   // uri: 'ws://54.172.139.217:5000/graphql',
  // uri: 'wss://http://localhost:4000/graphql',
   uri: 'wss://https://test.nilesoftdemo.com/graphql',
    options: {
      reconnect: true,
    },
  });
  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    httpLink
  );
  const link = authLink.concat(splitLink);

  const client = new ApolloClient({
    link: link,
    cache: new InMemoryCache(),
  });
  useEffect(() => {
    initWebSocket('wss://localhost:4000/graphql');
  }, []);
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
        <RoutePage /> 
        </Router>
        </ApolloProvider>
     </UserProvider>
     </ThemeProvider>
  );
};

export default App;