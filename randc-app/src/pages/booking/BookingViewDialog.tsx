// BookingViewDialog.tsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Chip,
  Paper,
  Divider,
  Stack,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';
import EmojiFlagsIcon from '@mui/icons-material/EmojiFlags';        // For status
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber'; // For booking code
import BuildCircleIcon from '@mui/icons-material/BuildCircle';      // For service
import PersonIcon from '@mui/icons-material/Person';               // For seeker/staff
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';// For non-user email
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';  // For time slot
import PetsIcon from '@mui/icons-material/Pets';                   // For hasPets
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';      // For number of rooms

interface BookingViewDialogProps {
  open: boolean;
  onClose: () => void;
  booking: any; // Or a typed interface for the expanded booking
}

// A simple helper to format the date if it exists
function formatDate(dateStr?: string) {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleString();
}

export const BookingViewDialog: React.FC<BookingViewDialogProps> = ({ open, onClose, booking }) => {
  // AnimatePresence + motion.div wrapper around the entire dialog
  return (
    <AnimatePresence>
      {open && (
        <Dialog
          open={open}
          onClose={onClose}
          fullWidth
          maxWidth="md"
          // Slide-and-fade animation for the paper
          PaperComponent={(props) => (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            >
              <Paper {...props} sx={{ overflow: 'hidden' }} />
            </motion.div>
          )}
        >
          <DialogTitle sx={{ fontWeight: 'bold', bgcolor: 'grey.100' }}>
            Booking Details
          </DialogTitle>

          <DialogContent dividers sx={{ bgcolor: '#f9f9f9' }}>
            {booking ? (
              <Box>
                {/* Row 1: Booking Code + Status */}
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  {/* Booking Code */}
                  <Grid item xs={12} md={6}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <ConfirmationNumberIcon color="primary" />
                      <Typography variant="subtitle2" color="text.secondary">
                        Booking Code
                      </Typography>
                    </Stack>
                    <Typography variant="body1" sx={{ ml: 4 }}>
                      {booking.shortCode || '(None)'}
                    </Typography>
                  </Grid>

                  {/* Status with a color-coded Chip */}
                  <Grid item xs={12} md={6}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <EmojiFlagsIcon color="primary" />
                      <Typography variant="subtitle2" color="text.secondary">
                        Status
                      </Typography>
                    </Stack>
                    <Box sx={{ ml: 4, mt: 1 }}>
                      <Chip
                        label={booking.status || 'N/A'}
                        color={
                          booking.status === 'PENDING'
                            ? 'warning'
                            : booking.status === 'CONFIRMED'
                            ? 'success'
                            : booking.status === 'CANCELLED'
                            ? 'error'
                            : 'default'
                        }
                        variant="outlined"
                        sx={{ fontWeight: 'bold' }}
                      />
                    </Box>
                  </Grid>
                </Grid>

                <Divider sx={{ mb: 2 }} />

                {/* Row 2: Service + Seeker */}
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  {/* Service */}
                  <Grid item xs={12} md={6}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <BuildCircleIcon color="primary" />
                      <Typography variant="subtitle2" color="text.secondary">
                        Service
                      </Typography>
                    </Stack>
                    <Typography variant="body1" sx={{ ml: 4 }}>
                      {booking.service?.name
                        ? `${booking.service.name} ($${booking.service.price})`
                        : '(No service data)'}
                    </Typography>
                  </Grid>

                  {/* Seeker */}
                  <Grid item xs={12} md={6}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <PersonIcon color="primary" />
                      <Typography variant="subtitle2" color="text.secondary">
                        Seeker
                      </Typography>
                    </Stack>
                    <Typography variant="body1" sx={{ ml: 4 }}>
                      {booking.seeker
                        ? `${booking.seeker.firstName || ''} ${booking.seeker.lastName || ''}`
                        : '(None)'}
                    </Typography>
                  </Grid>
                </Grid>

                {/* Row 3: NonUserEmail + Staff */}
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  {/* Non-user email */}
                  <Grid item xs={12} md={6}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <AlternateEmailIcon color="primary" />
                      <Typography variant="subtitle2" color="text.secondary">
                        Non-User Email
                      </Typography>
                    </Stack>
                    <Typography variant="body1" sx={{ ml: 4 }}>
                      {booking.nonUserEmail || '(None)'}
                    </Typography>
                  </Grid>

                  {/* Staff */}
                  <Grid item xs={12} md={6}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <PersonIcon color="primary" />
                      <Typography variant="subtitle2" color="text.secondary">
                        Staff
                      </Typography>
                    </Stack>
                    <Typography variant="body1" sx={{ ml: 4 }}>
                      {booking.staff
                        ? `${booking.staff.firstName || ''} ${booking.staff.lastName || ''}`
                        : '(Unassigned)'}
                    </Typography>
                  </Grid>
                </Grid>

                {/* Row 4: Time Slot */}
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={12}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <CalendarMonthIcon color="primary" />
                      <Typography variant="subtitle2" color="text.secondary">
                        Time Slot
                      </Typography>
                    </Stack>
                    <Typography variant="body1" sx={{ ml: 4 }}>
                      {booking.timeSlot
                        ? `${formatDate(booking.timeSlot.startTime)} - ${formatDate(booking.timeSlot.endTime)}`
                        : 'N/A'}
                    </Typography>
                  </Grid>
                </Grid>

                <Divider sx={{ mb: 2 }} />

                {/* Special Requests Section */}
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Special Requests
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, bgcolor: 'white' }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <PetsIcon color="action" />
                        <Typography variant="body2">
                          Has Pets: {booking.specialRequests?.hasPets ? 'Yes' : 'No'}
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={6}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <MeetingRoomIcon color="action" />
                        <Typography variant="body2">
                          Rooms: {booking.specialRequests?.numberOfRooms ?? '1'}
                        </Typography>
                      </Stack>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography variant="body2">
                        <strong>Address:</strong> {booking.specialRequests?.address || '(None)'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2">
                        <strong>Room Type:</strong> {booking.specialRequests?.roomType || '(None)'}
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="body2">
                        <strong>Note:</strong> {booking.specialRequests?.note || '(None)'}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Box>
            ) : (
              <Typography variant="body1">No booking data available.</Typography>
            )}
          </DialogContent>

          <DialogActions>
            <Button
              startIcon={<CloseIcon />}
              onClick={onClose}
              sx={{ fontWeight: 'bold' }}
            >
              CLOSE
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </AnimatePresence>
  );
};
