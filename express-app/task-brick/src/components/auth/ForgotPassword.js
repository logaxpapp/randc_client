import React, { useState } from 'react';
import { TextField, Button, Typography, Paper, Container } from '@mui/material';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/forgot-password', { email });
      setMessage('Check your email for the reset link.');
    } catch (error) {
      setMessage('Error sending reset email. Please try again.');
    }
    setLoading(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={6} sx={{ marginTop: 20, marginBottom: 50, padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Forgot Password
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: 1 }}>
          <TextField
            label="Email Address"
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ margin: '24px 0px 16px' }}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Email'}
          </Button>
        </form>
        {message && (
          <Typography color="textSecondary" align="center">
            {message}
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default ForgotPassword;
