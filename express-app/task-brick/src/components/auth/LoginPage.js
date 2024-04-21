import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../features/auth/authSlice';
import axios from 'axios';
import { Card, Button, Typography, Divider, TextField, MenuItem, Grid  } from '@mui/material';
import { Link } from 'react-router-dom';
import { FaGoogle, FaDiscord, FaFacebook, FaInstagram } from 'react-icons/fa';
import Logo from '../../assets/images/logo.png';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '', tenantId: '' });
    const [loginError, setLoginError] = useState('');
    const [tenants, setTenants] = useState([]);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setCredentials(prevState => ({ ...prevState, [name]: value }));
    };

    const handleInitialSubmit = async (event) => {
        event.preventDefault();
        setLoginError('');
    
        try {
            const verificationResponse = await axios.post('http://localhost:5000/api/verifyEmail', {
                email: credentials.email,
                password: credentials.password,
            });
        
            if (verificationResponse.data.tenants && verificationResponse.data.tenants.length > 1) {
                setTenants(verificationResponse.data.tenants);
            } else {
                completeLogin(credentials.email, credentials.password, verificationResponse.data.tenantId);
            }
        } catch (error) {
            setLoginError(error.response?.data.message || 'Verification failed');
        }
    };

    const completeLogin = (email, password, tenantId) => {
        dispatch(loginUser({ email, password, tenantId }))
        .unwrap()
        .then(() => navigate('/dashboard'))
        .catch(error => setLoginError(error.message || 'Login failed'));
    };

     // Correctly using handleInitialSubmit for the initial form submission
  const handleSubmit = tenants.length > 0 ? (event) => {
    event.preventDefault();
    completeLogin(credentials.email, credentials.password, credentials.tenantId);
  } : handleInitialSubmit; // This line was missing/incorrect in the previous versions


  const handleGoogleLogin = () => {
    // Redirect the browser to the backend endpoint
    window.location.href = 'http://localhost:5000/api/google/login'; // Use your backend server's URL
  };

  const handleForgotPassword = () => {
    // Redirect the browser to the forgot password page
    navigate('/forgot-password');
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-lg space-y-8 p-12">
          <Grid container alignItems="center" justifyContent="center" spacing={2}>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <img src={Logo} alt="logo" style={{ width: 64, height: 64 }} />
          </Grid>
          <Grid item xs={12} sm={6} md={8} lg={9} xl={10}>
            <Typography variant="h4" className="font-bold text-center">
              Sign In
            </Typography>
          </Grid>
        </Grid>
        <form onSubmit={ handleSubmit} className="mt-8 space-y-6">
          <TextField label="Email" variant="outlined" fullWidth name="email" value={credentials.email} onChange={handleChange} />
          <TextField label="Password" type="password" variant="outlined" fullWidth name="password" value={credentials.password} onChange={handleChange} />
          {tenants.length > 0 && (
            <TextField select label="Select Tenant" name="tenantId" value={credentials.tenantId} onChange={handleChange} fullWidth>
              {tenants.map((tenant) => (
                <MenuItem key={tenant.id} value={tenant.id}>
                  {tenant.name}
                </MenuItem>
              ))}
            </TextField>
          )}
          {loginError && <Typography color="error">{loginError}</Typography>}
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Sign In
          </Button>
          <Divider variant="middle" > OR </Divider>
          <Grid container spacing={2} justifyContent="center" className="mt-4">
            <Grid item>
              <Button variant="outlined" startIcon={<FaGoogle />} onClick={handleGoogleLogin}>
                Google
              </Button>
            </Grid>
            <Grid item>
              <Button variant="outlined" startIcon={<FaFacebook />}>
                Facebook
              </Button>
            </Grid>
          </Grid>
          <Grid container justifyContent="center" >
            <Grid item>
              <Link to="/forgot-password" variant="body2" className='text-blue-500'>
                Forgot password?
              </Link>
            </Grid>
          </Grid>
        </form>
        <Typography variant="body2" className="text-center mt-4">
          Don't have an account? <Link to="/signup" className='text-blue-500'>Sign up</Link>
        </Typography>
      </Card>
    </div>
  );
};

export default Login;