import React, { useState, useContext, useEffect } from 'react';
import {  useMutation } from '@apollo/client';
import { LOGIN_MUTATION } from '../../../graphql/Login';
import { UserContext } from '../../../auth/UserContext';
import { useNavigate } from 'react-router-dom';
import {  InputAdornment } from '@mui/material';
import { AccountCircle, Lock } from '@mui/icons-material';
import GoogleButton from 'react-google-button';

import { TextField, Button, CircularProgress, Typography, Grid } from '@mui/material';
import Popup from '../../Popup';
import Register from '../../../pages/account/Register';
import PasswordResetForm from '../../../pages/account/ForgotPassword';
import Alert from '@mui/material/Alert';
/*const LOGIN_WITH_GOOGLE = gql`
  mutation LoginWithGoogle($input: String!) {
    loginWithGoogle(input: $input) {
      token
    }
  }
`;

interface GoogleResponse {
  tokenId: string;
  // Add other properties from the Google Sign-In response if necessary
}*/
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
 // const [loginWithGoogle] = useMutation(LOGIN_WITH_GOOGLE);

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
      const { firstName, lastName, email, role,address } = user;
      setLoading(false);
      setShowSuccessAlert(true);
      navigate('/');
      console.log('Logged in successfully:', { firstName, lastName, email, role,address });
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
  /*const handleGoogleLogin = async (googleResponse:GoogleResponse) => {
    try {
      const { tokenId } = googleResponse;
      
      // Send the token ID to the loginWithGoogle mutation
      const { data } = await loginWithGoogle({ variables: { input: tokenId } });

      // Assuming the loginWithGoogle mutation returns a token upon successful login
      const token = data.loginWithGoogle.token;

      // Store the token securely (e.g., in local storage or a secure HTTP-only cookie)

      // Redirect the user to the authenticated page or perform any other actions
      // For example, you can use React Router to navigate to a different page
     // nnavigate('/dashboard');
    } catch (error) {
      console.error('Google login failed', error);
      // Handle error scenarios (e.g., display an error message to the user)
    }
  };*/
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
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle style={{ color: '#00b0ad' }} />
                </InputAdornment>
              ),
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
               startAdornment: (
          <InputAdornment position="start">
            <Lock   style={{ color: '#00b0ad' }}/>
          </InputAdornment>
        ),
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
        
          <GoogleButton  />
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