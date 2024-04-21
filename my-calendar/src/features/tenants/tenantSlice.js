// src/features/tenants/tenantSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// Async thunk for getting all tenants
export const getTenants = createAsyncThunk(
  'tenants/getTenants',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/tenants`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
        }
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message || 'Unable to get tenants');
    }
  }
);
export const getTenant = createAsyncThunk(
    'tenants/getTenant',
    async (id, thunkAPI) => {
      try {
        const response = await axios.get(`${API_URL}/tenants/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
          }
        });
        return response.data;
      } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message || 'Unable to get tenant');
      }
    }
);
export const createTenant = createAsyncThunk(
    'tenants/createTenant',
    async (tenant, thunkAPI) => {
        try {
          const response = await axios.post(`${API_URL}/tenants`, tenant, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
            }
          });
          return response.data;
        } catch (error) {
          return thunkAPI.rejectWithValue(error.response.data.message || 'Unable to create tenant');
        }
      }

);

export const updateTenant = createAsyncThunk(
    'tenants/updateTenant',
    async (tenant, thunkAPI) => {
        try {
          const response = await axios.put(`${API_URL}/tenants/${tenant._id}`, tenant, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
            }
          });
          return response.data;
        } catch (error) {
          return thunkAPI.rejectWithValue(error.response.data.message || 'Unable to update tenant');
        }
      }

);

export const deleteTenant = createAsyncThunk(
    'tenants/deleteTenant',
    async (id, thunkAPI) => {
        try {
          const response = await axios.delete(`${API_URL}/tenants/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
            }
          });
          return response.data;
        } catch (error) {
          return thunkAPI.rejectWithValue(error.response.data.message || 'Unable to delete tenant');
        }
      }
);

// Initial state for the tenant slice
const initialState = {
  tenants: [],
  tenant: {},
  status: 'idle',
  error: null
};

// Tenant slice
const tenantSlice = createSlice({
  name: 'tenants',
  initialState,
  reducers: {
    // Add reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTenants.fulfilled, (state, action) => {
        state.tenants = action.payload;
        state.status = 'succeeded';
      })
      .addCase(getTenants.rejected, (state, action) => {
        state.error = action.payload;
        state.status = 'failed';
      })
      .addCase(getTenant.fulfilled, (state, action) => {
        state.tenant = action.payload;
        state.status = 'succeeded';
      })
      .addCase(getTenant.rejected, (state, action) => {
        state.error = action.payload;
        state.status = 'failed';
      })
      .addCase(createTenant.fulfilled, (state, action) => {
        state.tenant = action.payload;
        state.status = 'succeeded';
      })
      .addCase(createTenant.rejected, (state, action) => {
        state.error = action.payload;
        state.status = 'failed';
      })
      .addCase(updateTenant.fulfilled, (state, action) => {
        state.tenant = action.payload;
        state.status = 'succeeded';
      })
      .addCase(updateTenant.rejected, (state, action) => {
        state.error = action.payload;
        state.status = 'failed';
      })
      .addCase(deleteTenant.fulfilled, (state, action) => {
        state.tenant = action.payload;
        state.status = 'succeeded';
      })
      .addCase(deleteTenant.rejected, (state, action) => {
        state.error = action.payload;
        state.status = 'failed';
      })
      .addDefaultCase((state) => {
        state.status = 'idle';
        state.error = null;
      });
  },
});


export default tenantSlice.reducer;
