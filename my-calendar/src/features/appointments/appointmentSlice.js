import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const getAppointments = createAsyncThunk(
  'appointments/getAppointments',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/appointments`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message || 'Unable to get appointments');
    }
  }
);

export const createAppointment = createAsyncThunk(
  'appointments/createAppointment',
               
     async (appointmentData,  tenantId, userId, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/appointments`, appointmentData, {
        tenantId,
        userId,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message || 'Unable to create appointment');
    }
  }
);

export const updateAppointment = createAsyncThunk(
    'appointments/updateAppointment',
    async ({ _id, appointmentData }, thunkAPI) => {
      try {
        const response = await axios.put(`${API_URL}/appointments/${_id}`, appointmentData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
          },
        });
        return response.data;
      } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message || 'Unable to update appointment');
      }
    }
  );
  

export const deleteAppointment = createAsyncThunk(
  'appointments/deleteAppointment',
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${API_URL}/appointments/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
        },
      });
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message || 'Unable to delete appointment');
    }
  }
);

const initialState = {
  appointments: [],
  appointment: {},
  status: 'idle',
  error: null
};

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    // Add any synchronous reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAppointments.fulfilled, (state, action) => {
        state.appointments = action.payload;
        state.status = 'succeeded';
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.appointments.push(action.payload);
        state.status = 'succeeded';
      })
      .addCase(getAppointments.rejected, (state, action) => {
        state.error = action.payload;
        state.status = 'failed';
      })
      .addCase(updateAppointment.fulfilled, (state, action) => {
        const index = state.appointments.findIndex(appointment => appointment._id === action.payload._id);
        if (index !== -1) {
          state.appointments[index] = action.payload;
        }
        state.status = 'succeeded';
      })
      .addCase(deleteAppointment.fulfilled, (state, action) => {
        state.appointments = state.appointments.filter(appointment => appointment._id !== action.payload);
        state.status = 'succeeded';
      })
      .addMatcher(
        (action) => action.type.startsWith('appointments/') && action.type.endsWith('/rejected'),
        (state, action) => {
          state.error = action.payload;
          state.status = 'failed';
        }
      );
  },
});

export default appointmentSlice.reducer;
