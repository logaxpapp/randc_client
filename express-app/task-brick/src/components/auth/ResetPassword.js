import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { TextField, Button, Typography } from '@mui/material';
import axios from 'axios';

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/reset-password/${token}`, { password });
      setMessage('Your password has been successfully reset.');
    } catch (error) {
      setMessage('Failed to reset password.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Typography variant="h5">Reset Password</Typography>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4 mt-4">
        <TextField
          label="New Password"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
        />
        <Button type="submit" variant="contained" color="primary">
          Reset Password
        </Button>
        {message && <Typography>{message}</Typography>}
      </form>
    </div>
  );
};


export default ResetPassword;