import React, { useState, useContext } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_MUTATION } from '../../../graphql/Login';
import { UserContext } from '../../../auth/UserContext';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Box, Container, CircularProgress, Typography } from '@mui/material';

interface LoginInput {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [loginMutation, { error }] = useMutation(LOGIN_MUTATION);
  const { setCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    const input: LoginInput = { username, password };
    try {
      const { data } = await loginMutation({ variables: { input } });
      const token = data.login.token;
      const user = data.login.user;
      localStorage.setItem('token', token);
      setCurrentUser(user);
      const { firstName, lastName, email, role } = user;
      setLoading(false);
      navigate('/');
      console.log('Logged in successfully:', { firstName, lastName, email, role });
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box p={4} boxShadow={3} bgcolor="white" borderRadius={10}>
        <Typography variant="h6" style={{ color: '#4F46E5' }}>Login</Typography>   
        {error && <p>Error: {error.message}</p>}
        <TextField
          variant="outlined"
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          variant="outlined"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleLogin}
          disabled={loading}
          style={{ marginTop: '1rem', borderRadius: '20px', backgroundColor: '#4F46E5', color: '#fff' }}
        >
          {loading ? <CircularProgress size={20} color="primary" /> : 'Login'}
        </Button>
        <Typography variant="body2" style={{ marginTop: '1rem', textAlign: 'center' }}>
          <Link to="/forgot-password" style={{ color: '#4F46E5' }}>Forgot your password?</Link>
        </Typography>
        <Typography variant="body2" style={{ marginTop: '1rem', textAlign: 'center' }}>
          Don't have an account? <Link to="/register" style={{ color: '#4F46E5' }}>Please Register now</Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;