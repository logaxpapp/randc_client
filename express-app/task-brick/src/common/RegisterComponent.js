import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { TextField, Button, Card, CardContent, CircularProgress } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import CustomCircularProgress from '../components/global/CustomCircularProgress';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
}

const RegisterComponent = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const token = query.get('token');
  const [userDetails, setUserDetails] = useState({
    email: '',
    tenantId: '',
    role: '',
    tenantName: '', // Added tenantName field
    isExistingUser: false,
  });
  console.log('token:', token);
  console.log('userDetails:', userDetails);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      axios.post('/api/validate-invitation', { token })
        .then((response) => {
          setUserDetails({
            ...response.data,
            isExistingUser: response.data.isExistingUser,
          });
        })
        .catch((error) => {
          toast.error(error.response?.data?.message || 'Invalid or expired token.');
          navigate('/login'); // Redirect to login if the token is invalid or expired
        });
    }
  }, [token, navigate]);

  const handleRegistration = async () => {
    setLoading(true);
    const url = userDetails.isExistingUser ? `/api/tenants/${userDetails.tenantId}/add-user` : '/api/register';
    const data = userDetails.isExistingUser ? { email: userDetails.email } : { token, password };

    try {
      const response = await axios.post(url, data);
      toast.success(response.data.message);
      navigate('/login'); // Redirect to login after successful registration or addition to tenant
    } catch (error) {
      toast.error(error.response?.data?.error || toast.error(error.response?.data?.message || 'Registration failed.'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 px-6">
        <ToastContainer />
        <CustomCircularProgress />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 px-6">
      <ToastContainer />
      <Card className="max-w-md w-full bg-white rounded-md shadow-md p-6">
        <CardContent>
          <h1 className="text-2xl font-bold mb-8 text-center">{userDetails.isExistingUser ? 'Accept Invitation' : 'Complete Registration'}</h1>
          <TextField
            label="Email"
            type="email"
            value={userDetails.email}
            disabled
            fullWidth
            variant="outlined"
            margin="normal"
          />
          <TextField
            label="Company Name" // Changed label to Company Name
            value={userDetails.tenantName} // Added tenantName value
            disabled // Disabled the field
            fullWidth
            variant="outlined"
            margin="normal"
          />
          {!userDetails.isExistingUser && (
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              variant="outlined"
              margin="normal"
            />
          )}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleRegistration}
            disabled={loading}
            sx={{ mt: 3 }}
          >
            {loading ? 'Processing...' : (userDetails.isExistingUser ? 'Accept Invitation' : 'Register')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterComponent;
