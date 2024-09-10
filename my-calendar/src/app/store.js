// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import tenantsReducer from '../features/tenants/tenantSlice';
import appointmentsReducer from '../features/appointments/appointmentSlice';
import eventsReducer from '../features/events/eventSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tenants: tenantsReducer,
    appointments: appointmentsReducer,
    events: eventsReducer,
  },
});
