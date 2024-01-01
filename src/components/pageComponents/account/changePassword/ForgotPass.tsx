import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Box, Container, CircularProgress, Typography } from '@mui/material';

/*interface LoginInput {
  username: string;
  password: string;
}*/

const ForgotPass: React.FC = () => {
  const [username, setUsername] = useState('');
  //const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    //const input: LoginInput = { username, password };
    try {
      
      setLoading(false);
      navigate('/');
   //   console.log('Logged in successfully:', { firstName, lastName, email, role });
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box p={4} boxShadow={3} bgcolor="white" borderRadius={10}>
        <Typography variant="h6" style={{ color: '#4F46E5' }}>Forgot Password</Typography>   
      
        <TextField
          variant="outlined"
          label="Email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
          {loading ? <CircularProgress size={20} color="primary" /> : 'Reset Password'}
        </Button>
        <Typography variant="body2" style={{ marginTop: '1rem', textAlign: 'center' }}>
          <Link to="/login" style={{ color: '#4F46E5' }}>I have account?</Link>
        </Typography>
        <Typography variant="body2" style={{ marginTop: '1rem', textAlign: 'center' }}>
          Don't have an account? <Link to="/register" style={{ color: '#4F46E5' }}>Please Register now</Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default ForgotPass;