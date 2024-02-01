import React, { useState, useContext, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_MUTATION } from '../../../graphql/Login';
import { UserContext } from '../../../auth/UserContext';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, CircularProgress, Typography, Grid } from '@mui/material';
import Popup from '../../Popup';
import Register from '../../../pages/account/Register';
import PasswordResetForm from '../../../pages/account/ForgotPassword';

interface LoginInput {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginMutation, { error }] = useMutation(LOGIN_MUTATION);
  const [openRegisterPopup, setOpenRegisterPopup] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const { setCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); // Check initial window width
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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

  const handleClick = () => {
    setOpenRegisterPopup(true); // Open the register popup
  };
  const handleClickForgotPassword = () => {
    setOpenRegisterPopup(false); // Open the register popup
    setForgotPassword(true);
  };

  return (
    <div className={isMobile ? 'full-screen' : ''}>
   <Grid container spacing={3}>
      <Grid item xs={12}>
        {error && <p>Error: {error.message}</p>}
        <TextField
          variant="outlined"
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ width: '100%' }} // Set width to 100% to fill the screen
          margin="normal"
        />
        <TextField
          variant="outlined"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%' }} // Set width to 100% to fill the screen
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleLogin}
          disabled={loading}
          style={{ marginTop: '1rem', borderRadius: '20px', backgroundColor: '#00b0ad', color: '#fff' }}
        >
          {loading ? <CircularProgress size={20} color="primary" /> : 'Login'}
        </Button>
        <Typography variant="body2" style={{ marginTop: '1rem', textAlign: 'center' }}>
          <span onClick={handleClickForgotPassword} style={{ color: '#00b0ad', cursor: 'pointer' }}>Forgot your password?</span>
        </Typography>

        <Typography variant="body2" style={{ marginTop: '1rem', textAlign: 'center' }}>
          Don't have an account? <span onClick={handleClick} style={{ color: '#00b0ad', cursor: 'pointer' }}>Please Register now</span>
        </Typography>
   
      <Popup title="Choose your Account" openPopup={openRegisterPopup} setOpenPopup={setOpenRegisterPopup}>
        <Register />
      </Popup>
      <Popup title="Forgot Password" openPopup={forgotPassword} setOpenPopup={setForgotPassword}>
        <PasswordResetForm />
      </Popup>
      </Grid>
      </Grid>
    </div>
  );
};

export default Login;