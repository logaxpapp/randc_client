import React, { useEffect } from 'react';
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
  FormControlLabel,
  Checkbox,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { motion, AnimatePresence } from 'framer-motion';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { CustomerFormValues } from '../../types/customer';

/**
 * The form needs guaranteed strings for firstName/lastName/email/phone,
 * matching your Yup schema.
 */


// Validation schema for the form
const CustomerValidationSchema = Yup.object().shape({
  firstName: Yup.string().required('First name required'),
  lastName: Yup.string().required('Last name required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  phone: Yup.string().required('Phone is required'),
  isBlacklisted: Yup.boolean(),
});

// Props for this dialog component
export interface CreateCustomerMUIProps {
  open: boolean;
  initialData?: CustomerFormValues;
  isSubmitting?: boolean;
  onClose: () => void;
  // The form -> parent callback must accept a *fully-defined* CustomerFormValues
  onSubmit: (values: CustomerFormValues) => Promise<void>;
  vitalMessage?: string; // optional message banner
}

export const CreateCustomerMUI: React.FC<CreateCustomerMUIProps> = ({
  open,
  initialData,
  isSubmitting = false,
  onClose,
  onSubmit,
  vitalMessage = 'Important: Please fill all required fields!',
}) => {
  // Convert optional fields to guaranteed strings
  const initialValues: CustomerFormValues = {
    _id: initialData?._id,
    firstName: initialData?.firstName ?? '',
    lastName: initialData?.lastName ?? '',
    email: initialData?.email ?? '',
    phone: initialData?.phone ?? '',
    isBlacklisted: initialData?.isBlacklisted ?? false,
  };

  useEffect(() => {
    // If you need logic upon open or data load, place it here
  }, [initialData]);

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
          <DialogTitle>
            {initialData?._id ? 'Edit Customer' : 'Create Customer'}
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>

          {/* Vital message banner */}
          <div style={{ backgroundColor: '#E3F2FD', padding: '0.5rem 1rem' }}>
            <Typography variant="body2" color="primary">
              {vitalMessage}
            </Typography>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={CustomerValidationSchema}
            onSubmit={async (values) => {
              await onSubmit(values);
            }}
          >
            {({ values, errors, touched, handleChange, setFieldValue }) => (
              <Form>
                <DialogContent dividers>
                  <TextField
                    label="First Name"
                    name="firstName"
                    value={values.firstName}
                    onChange={handleChange}
                    error={touched.firstName && Boolean(errors.firstName)}
                    helperText={touched.firstName && errors.firstName}
                    margin="normal"
                    fullWidth
                  />
                  <TextField
                    label="Last Name"
                    name="lastName"
                    value={values.lastName}
                    onChange={handleChange}
                    error={touched.lastName && Boolean(errors.lastName)}
                    helperText={touched.lastName && errors.lastName}
                    margin="normal"
                    fullWidth
                  />
                  <TextField
                    label="Email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                    margin="normal"
                    fullWidth
                  />
                  <TextField
                    label="Phone"
                    name="phone"
                    value={values.phone}
                    onChange={handleChange}
                    error={touched.phone && Boolean(errors.phone)}
                    helperText={touched.phone && errors.phone}
                    margin="normal"
                    fullWidth
                  />

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={values.isBlacklisted || false}
                        onChange={(e) =>
                          setFieldValue('isBlacklisted', e.target.checked)
                        }
                      />
                    }
                    label="Blacklist this customer?"
                  />
                </DialogContent>

                <DialogActions>
                  <Button onClick={onClose}>Cancel</Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                    startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                  >
                    {initialData?._id ? 'Update' : 'Create'}
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
