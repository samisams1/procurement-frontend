import React, { useState, useContext, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_MUTATION } from '../../../graphql/Login';
import { UserContext } from '../../../auth/UserContext';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, CircularProgress, Typography, Grid } from '@mui/material';
import Popup from '../../Popup';
import Register from '../../../pages/account/Register';
import PasswordResetForm from '../../../pages/account/ForgotPassword';
import Alert from '@mui/material/Alert';
const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginMutation] = useMutation(LOGIN_MUTATION);
  const [openRegisterPopup, setOpenRegisterPopup] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const { setCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [backendError, setBackendError] = useState('');

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
    if (!username || !password) {
      const errors: string[] = [];

      if (!username) {
        errors.push('Username is required');
      }

      if (!password) {
        errors.push('Password is required');
      }

      setValidationErrors(errors);
      return;
    }

    setLoading(true);
    try {
      const { data } = await loginMutation({ variables: { username,password } });
      const token = data.login.token;
      const user = data.login.user;
      localStorage.setItem('token', token);
      setCurrentUser(user);
      const { firstName, lastName, email, role } = user;
      setLoading(false);
      setShowSuccessAlert(true);
      navigate('/');
      console.log('Logged in successfully:', { firstName, lastName, email, role });
    } catch (error:any) {
      setBackendError(error.message);
      setLoading(false);
      setShowErrorAlert(true);
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
          {showErrorAlert && (
            <Alert variant="filled" severity="error">
             {backendError}
            </Alert>
          )}
          {showSuccessAlert && (
            <Alert variant="filled" severity="success">
              Logged in successfully.
            </Alert>
          )}

          <TextField
            variant="outlined"
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: '100%' }}
            margin="normal"
            InputProps={{
              classes: {
                root: 'input-field',
                focused: 'input-field-focused', // Add a custom class for focused state
              },
            }}
            error={validationErrors.includes('Username is required')}
            helperText={validationErrors.includes('Username is required') ? 'This field is required' : ''}
            required // Added required attribute
          />
          <TextField
            variant="outlined"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%' }}
            margin="normal"
            InputProps={{
              classes: {
                root: 'input-field',
                focused: 'input-field-focused', // Add a custom class for focused state
              },
            }}
            error={validationErrors.includes('Password is required')}
            helperText={validationErrors.includes('Password is required') ? 'This field is required' : ''}
            required // Added required attribute
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
            <span onClick={handleClickForgotPassword} style={{ color: '#00b0ad', cursor: 'pointer' }}>
              Forgot your password?
            </span>
          </Typography>

          <Typography variant="body2" style={{ marginTop: '1rem', textAlign: 'center' }}>
            Don't have an account?{' '}
            <span onClick={handleClick} style={{ color: '#00b0ad', cursor: 'pointer' }}>
              Please Register now
            </span>
          </Typography>
        </Grid>
      </Grid>

      <Popup title="Choose your Account" openPopup={openRegisterPopup} setOpenPopup={setOpenRegisterPopup}>
        <Register />
      </Popup>
      <Popup title="Forgot Password" openPopup={forgotPassword} setOpenPopup={setForgotPassword}>
        <PasswordResetForm />
      </Popup>
    </div>
  );
}

export default Login;