// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for user login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, thunkAPI) => {
    const API_URL = process.env.REACT_APP_API_URL; 
    try {
      const response = await axios.post(`${API_URL}/users/login`, { email, password });
      localStorage.setItem('jwtToken', response.data.jwtToken); 
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message || 'Unable to login');
    }
  }
);
export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async ({ email, password, firstName, lastName, tenantId }, thunkAPI) => {
        const API_URL = process.env.REACT_APP_API_URL;
        try {
            const response = await axios.post(`${API_URL}/users/create`, {
                email, 
                password, 
                firstName,
                lastName,
                tenantId
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
                }
            });
            localStorage.setItem('token', response.data.jwtToken); // Store JWT token securely
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.message || 'Unable to register');
        }
    }
);
// Async thunk for get users

export const getUsers = createAsyncThunk(
  'auth/getUsers',
  async (_, thunkAPI) => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const response = await axios.get(`${API_URL}/users`, {
       
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
        }
      });
      console.log('GetUsers', response)
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message || 'Unable to get users');
    }
  }
);

// Async thunk for get user

export const getUser = createAsyncThunk(
  'auth/getUser',
  async (id, thunkAPI) => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const response = await axios.get(`${API_URL}/users/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
        }
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message || 'Unable to get user');
    }
  }
);
// Async thunk for update user
export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (user, thunkAPI) => {
    console.log('updateUser', user)
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const response = await axios.put(`${API_URL}/users/${user._id}`, user, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
        }
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message || 'Unable to update user');
    }
  }
);
// Async thunk for delete user
export const deleteUser = createAsyncThunk(
  'auth/deleteUser',
  async (user_id, thunkAPI) => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const response = await axios.delete(`${API_URL}/users/${user_id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
        }
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message || 'Unable to delete user');
    }
  }
);

// Async thunk for user logout
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, thunkAPI) => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      await axios.post(`${API_URL}/users/logout`);
      localStorage.removeItem('token'); // Cleanup the token on logout
      return {};
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message || 'Unable to logout');
    }
  }
);
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token'),
    users: [],
    status: 'idle',
    error: null
  },
  reducers: {
    clearState: (state) => {
      localStorage.removeItem('token');
      state.user = null;
      state.token = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user; // Adjust according to your API response structure
        state.token = action.payload.jwtToken; // Ensure this matches your backend response
        state.status = 'succeeded';
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.status = 'succeeded';
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user; // Adjust according to your API response structure
        state.token = action.payload.jwtToken; // Ensure this matches your backend response
        state.status = 'succeeded';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.users = action.payload; // If the payload itself is the users array
        state.status = 'succeeded';
      })
      
      .addCase(getUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload.user; // Adjust according to your API response structure
        state.status = 'succeeded';
      })
      .addCase(getUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        // Find the index of the user with the matching _id
        const index = state.users.findIndex(user => user._id === action.payload._id);
        // Check if the user was found
        if (index !== -1) {
          // Replace the user at the found index with the updated user data
          state.users[index] = action.payload;
        }
        state.status = 'succeeded';
      })
      
      .addCase(updateUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.user = action.payload.user; // Adjust according to your API response structure
        state.status = 'succeeded';
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addDefaultCase((state) => {
        state.status = 'idle';
        state.error = null;
      });
  },
});

export const { clearState } = authSlice.actions;
export default authSlice.reducer;
