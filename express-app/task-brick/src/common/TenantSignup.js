import React, { useState } from 'react';
import axios from 'axios';
import { Button, Card, CardContent, TextField, Typography, CircularProgress, Box } from '@mui/material';

const TenantSignup = ({ onTenantCreated }) => {
  const [tenant, setTenant] = useState({ name: '', domain: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleTenantSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.post('/api/tenants', tenant);
      onTenantCreated(response.data._id);
      setError(''); // Clear any previous errors
    } catch (error) {
      let backendError = 'There was an error creating the tenant.';
  
      // Check if the error response exists and has the expected structure
      if (error.response && error.response.data) {
        // If the error is a validation error from Mongoose
        if (error.response.data.error) {
          // Directly use the error message from validation
          backendError = error.response.data.error;
        } else if (error.response.data.message) {
          // Use a general message error if specific validation message isn't available
          backendError = error.response.data.message;
        }
      }
  
      setError(backendError); // Set the refined error message
      console.error('There was an error creating the tenant:', backendError);
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" className="">
      <Card sx={{ minWidth: 600, maxWidth: 800, m: 5, p: 5, boxShadow: 5, borderRadius: '12px' }}>
        <CardContent>
          <Typography variant="h4" component="div" gutterBottom className="text-center font-bold mb-6">
            Create Your Tenant
          </Typography>
          {error && (
            <Typography color="error" gutterBottom>
              {error}
            </Typography>
          )}
          <form onSubmit={handleTenantSubmit} className="flex flex-col gap-6">
            <TextField
              fullWidth
              label="Name or Company Name"
              variant="outlined"
              value={tenant.name}
              onChange={(e) => setTenant({ ...tenant, name: e.target.value })}
              required
              InputProps={{
                sx: { fontSize: '1.25rem' } // Larger text size
              }}
              sx={{ input: { color: 'primary.main' } }} // Adjust input text color if needed
            />
            <TextField
              fullWidth
              label="Domain"
              variant="outlined"
              placeholder="example.com"
              value={tenant.domain}
              onChange={(e) => setTenant({ ...tenant, domain: e.target.value })}
              required
              InputProps={{
                sx: { fontSize: '1.25rem' } // Larger text size
              }}
              helperText="Enter your preferred domain without 'http://' or 'https://'"
              sx={{ input: { color: 'primary.main' } }} // Adjust input text color if needed
            />
            <Box display="flex" justifyContent="center" mt={3}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                sx={{ px: 5, py: 1.5, fontSize: '1.1rem' }} // Larger button with more padding and larger font
              >
                {isSubmitting ? <CircularProgress size={24} /> : 'Create Tenant'}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TenantSignup;
