import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Slide } from '@mui/material';
import CustomCircularProgress from '../global/CustomCircularProgress';

// Transition animation for the dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const LogoutModal = ({ open, handleClose }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Set a timeout to automatically stop loading after 7 seconds
    const timer = loading ? setTimeout(() => setLoading(false), 7000) : null;

    // Cleanup the timer on component unmount or when loading stops
    return () => clearTimeout(timer);
  }, [loading]);

  const logout = async () => {
    setLoading(true);
    const refreshToken = localStorage.getItem('refreshToken');

    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}` // Assuming you're sending the access token for logout
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        // Successfully logged out
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/login');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={!loading ? handleClose : null}
      TransitionComponent={Transition}
      keepMounted
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      {loading ? (
        <CustomCircularProgress />
      ) : (
        <>
          <DialogTitle id="alert-dialog-slide-title">{"Confirm Logout"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Are you sure you want to log out? You will need to log in again to access your account.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Cancel
            </Button>
            <Button onClick={logout} color="primary" variant="contained" autoFocus>
              Confirm Logout
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default LogoutModal;
