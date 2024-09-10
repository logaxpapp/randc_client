import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';



// Async thunk for fetching users
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { getState, rejectWithValue }) => {
    const { tenantId } = getState().auth.user; // Assuming tenantId is stored in auth state
    try {
      const response = await axios.get(`/api/tenants/${tenantId}/users`);
     
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchUserById = createAsyncThunk(
    'users/fetchUserById',
    async (userId, { getState, rejectWithValue }) => {
      const { tenantId } = getState().auth.user; // Assuming tenantId is stored in auth state
      try {
        const response = await axios.get(`/api/tenants/${tenantId}/users/${userId}`);
        console.log('UseSlice update', response.data); // Log the response data for debugging purposes
        return response.data;
      } catch (error) {
        return rejectWithValue(error.toString());
      }
    }
  );
  

// Async thunk for creating a user
export const createUser = createAsyncThunk(
    'users/createUser',
    async ({ tenantId, userData }, { rejectWithValue }) => {
      try {
        const response = await axios.post(`/api/tenants/${tenantId}/users`, userData);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );
  

// Async thunk for updating a user
export const updateUser = createAsyncThunk(
    'users/updateUser',
    async ({userId, userData }, { getState, rejectWithValue }) => {

    // get userId from auth state
  
      // Extract the current tenant ID from the state
      const tenantId = getState().auth.user.tenantId;
  
      try {
        // Use the extracted tenant ID in the API request URL
        const response = await axios.put(`/api/tenants/${tenantId}/users/${userId}`, userData);
        console.log('UseSlice update', response.data);
        return response.data;
      } catch (error) {
        console.error('Failed to update user', error);
        return rejectWithValue(error.response.data);
      }
    }
  );
  

// Async thunk for deleting a user
export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (userId, { getState, rejectWithValue }) => {
    const tenantId = getState().auth.user.tenantId;
    try {
      await axios.delete(`/api/tenants/${tenantId}/users/${userId}`);
      return userId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


const userSlice = createSlice({
    name: 'users',
    initialState: {
      list: [],
      users: [],
      status: null,
      error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchUsers.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(fetchUsers.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.list = action.payload;
        })
        .addCase(fetchUsers.rejected, (state, action) => {
          state.status = 'failed';
          // Make sure you handle the possibility of action.payload being undefined or not having a .message
          state.error = action.payload?.message || 'Failed to fetch users';
        })
        
        .addCase(createUser.fulfilled, (state, action) => {
          state.list.push(action.payload);
        })
        .addCase(updateUser.fulfilled, (state, action) => {
          const index = state.list.findIndex(user => user._id === action.payload._id);
          if (index !== -1) {
            state.list[index] = action.payload;
          }
        })
        .addCase(deleteUser.fulfilled, (state, action) => {
          state.list = state.list.filter(user => user._id !== action.payload);
        })
        .addCase(fetchUserById.fulfilled, (state, action) => {
            state.currentUser = action.payload;
          })
        .addCase(fetchUserById.rejected, (state, action) => {
            state.error = action.payload;
        })
        .addCase(createUser.rejected, (state, action) => {
          state.error = action.payload;
        });
    },
  });
  
  export default userSlice.reducer;
