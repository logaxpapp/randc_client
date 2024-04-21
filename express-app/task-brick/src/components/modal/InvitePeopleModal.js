import React, { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';


import { toast, ToastContainer  } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const InvitePeopleModal = ({ open, onClose }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');

  const handleSend = async () => {
    console.log('Invitation send initiated');

    // Retrieve the access token from localStorage
    const accessToken = localStorage.getItem('accessToken');
    console.log('accessToken from localStorage:', accessToken);

    if (!accessToken) {
      console.error('Access token not found');
      toast.error('Access token not found');
      return;
    }

    // Decode the JWT to extract the payload
    let decoded;
    try {
      decoded = jwtDecode(accessToken);
      console.log('decoded token:', decoded);
    } catch (error) {
      console.error('Error decoding token:', error);
      toast.error('Error with authentication token. Please log in again.');
      return;
    }

    const tenantId = decoded.tenantId; // Extract the tenantId from the decoded token
    console.log('tenantId extracted from token:', tenantId);

    // Ensure tenantId is not undefined or null
    if (!tenantId) {
      console.error('Tenant ID not found in token');
      toast.error('Tenant ID not found. Please log in again.');
      return;
    }

    const apiEndpoint = `/api/tenants/${tenantId}/invite`;
    const data = { email, role };
    console.log('Sending invitation to API:', apiEndpoint, data);

    try {
      const response = await axios.post(apiEndpoint, data);
      console.log('API response:', response.data);
      toast.success('Invitation sent successfully');
      onClose(); // Close modal after successful API call
    } catch (error) {
      console.error('API error response:', error.response);
      toast.error('Error sending invitation: ' + (error.response?.data?.error || 'Please try again.'));
    }
  };
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth sx={{ padding: '24px' }}>
      <ToastContainer />
      <DialogTitle sx={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Invite People to TaskBrick</DialogTitle>
      <DialogContent sx={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2}}>
          <TextField
            autoFocus
            margin="dense"
            id="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              id="role"
              value={role}
              label="Role"
              onChange={(e) => setRole(e.target.value)}
            >
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Developer">Developer</MenuItem>
              <MenuItem value="User">User</MenuItem>
              {/* Add other roles as needed */}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSend} endIcon={<SendIcon />} variant="contained" color="primary">
          Send Invite
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InvitePeopleModal;
