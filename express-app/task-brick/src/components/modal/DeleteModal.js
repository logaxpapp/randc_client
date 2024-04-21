import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, IconButton } from '@mui/material';
import { DeleteOutline } from '@mui/icons-material';

const DeleteModal = ({ open, onClose, onDelete, title, message }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ backgroundColor: 'error.main', color: 'error.contrastText' }}>
        <IconButton onClick={onClose} color="inherit">
          <DeleteOutline />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography variant="h6">{title}</Typography>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onDelete} color="secondary" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteModal;
