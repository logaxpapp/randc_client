import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Paper,
  CircularProgress,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { motion, AnimatePresence } from 'framer-motion';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

// -----------------------------------------
// Types
// -----------------------------------------
export interface GenerateTimeSlotsFormValues {
  slotDuration: number;
  startDate: string; // e.g. "2025-01-01"
  endDate: string;   // e.g. "2025-12-31"
}

interface GenerateTimeSlotsProps {
  open: boolean;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (values: GenerateTimeSlotsFormValues) => Promise<void>;
  /**
   * Optionally, a vital message to display at all times (top banner).
   */
  vitalMessage?: string;
}

// -----------------------------------------
// Yup Validation Schema
// -----------------------------------------
const GenerateTimeSlotsSchema = Yup.object().shape({
  slotDuration: Yup.number()
    .min(15, 'Minimum slot duration is 15 minutes')
    .required('Slot duration is required'),
  startDate: Yup.string().required('Start date is required'),
  endDate: Yup.string().required('End date is required'),
});

// -----------------------------------------
// Component
// -----------------------------------------
export const GenerateTimeSlotsDialog: React.FC<GenerateTimeSlotsProps> = ({
  open,
  isSubmitting = false,
  onClose,
  onSubmit,
  vitalMessage = 'Vital: Make sure the date range is correct!',
}) => {
  const initialValues: GenerateTimeSlotsFormValues = {
    slotDuration: 60,
    startDate: '',
    endDate: '',
  };

  return (
    <AnimatePresence>
      {open && (
        <Dialog
          open={open}
          onClose={onClose}
          fullWidth
          maxWidth="sm"
          PaperComponent={(props) => (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
            >
              <Paper {...props} />
            </motion.div>
          )}
        >
          <DialogTitle>Generate Time Slots</DialogTitle>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* Vital message at all times */}
          <div style={{ backgroundColor: '#FFF3E0', padding: '0.5rem 1rem' }}>
            <Typography variant="body2" color="secondary">
              {vitalMessage}
            </Typography>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={GenerateTimeSlotsSchema}
            onSubmit={async (values) => {
              await onSubmit(values);
            }}
          >
            {({ values, errors, touched, handleChange }) => (
              <Form>
                <DialogContent dividers>
                  <TextField
                    label="Slot Duration (minutes)"
                    name="slotDuration"
                    type="number"
                    value={values.slotDuration}
                    onChange={handleChange}
                    error={
                      touched.slotDuration && Boolean(errors.slotDuration)
                    }
                    helperText={
                      touched.slotDuration && errors.slotDuration
                    }
                    margin="normal"
                    fullWidth
                  />

                  <TextField
                    label="Start Date"
                    name="startDate"
                    type="date"
                    value={values.startDate}
                    onChange={handleChange}
                    error={touched.startDate && Boolean(errors.startDate)}
                    helperText={touched.startDate && errors.startDate}
                    margin="normal"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />

                  <TextField
                    label="End Date"
                    name="endDate"
                    type="date"
                    value={values.endDate}
                    onChange={handleChange}
                    error={touched.endDate && Boolean(errors.endDate)}
                    helperText={touched.endDate && errors.endDate}
                    margin="normal"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={onClose}>Cancel</Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                    startIcon={
                      isSubmitting ? <CircularProgress size={20} /> : null
                    }
                  >
                    Generate
                  </Button>
                </DialogActions>
              </Form>
            )}
          </Formik>
        </Dialog>
      )}
    </AnimatePresence>
  );
};
