// Import createSlice and createAsyncThunk utilities from Redux Toolkit
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for uploading a profile picture
export const uploadProfilePicture = createAsyncThunk(
    'profilePicture/upload',
    async ({  imageData }, { getState, rejectWithValue }) => {
      // Access the user's ID as stored in the state
      const { id: userId } = getState().auth.user; // Use 'id' to access the user's ID
      const tenantId = getState().auth.user.tenantId; // Get the tenant ID from the auth state
      try {
        const formData = new FormData();
        formData.append('image', imageData);
        // Use the 'id' to construct your API endpoint
        const response = await axios.post(`/api/tenants/${tenantId}/profiles/${userId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );
  

// Async thunk for updating a profile picture
export const updateProfilePicture = createAsyncThunk(
    'profilePicture/update',
    async ({  imageData }, { getState, rejectWithValue }) => {
      // Access the user's ID from the auth state
      const { id: userId } = getState().auth.user;
      const tenantId = getState().auth.user.tenantId; // Get the tenant ID from the auth state
      console.log('userId', userId);
      console.log('tenantId', tenantId);
      try {
        const formData = new FormData();
        formData.append('image', imageData);
        const response = await axios.patch(`/api/tenants/${tenantId}/profiles/${userId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );
  

// Async thunk for deleting a profile picture
export const deleteProfilePicture = createAsyncThunk(
    'profilePicture/delete',
    async ({ tenantId }, { getState, rejectWithValue }) => {
      // Access the user's ID from the auth state
      const { id: userId } = getState().auth.user;
      try {
        const response = await axios.delete(`/api/tenants/${tenantId}/profiles/${userId}`);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );
  

  export const getProfilePicture = createAsyncThunk(
    'profilePicture/get',
    async (_, { getState, rejectWithValue }) => {
      const { id: userId } = getState().auth.user;
      const tenantId = getState().auth.user.tenantId;
      try {
        const response = await axios.get(`/api/tenants/${tenantId}/profiles/${userId}`);
        console.log('response', response);
        // Assuming the response contains the profile data including the picture URL
        return response.data.profilePictureUrl; // or however the picture URL is referenced
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );

const profilePictureSlice = createSlice({
  name: 'profilePicture',
  initialState: {
    profile: null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadProfilePicture.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(uploadProfilePicture.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profile = action.payload;
      })
      .addCase(uploadProfilePicture.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateProfilePicture.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateProfilePicture.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profile = action.payload;
      })
      .addCase(updateProfilePicture.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(deleteProfilePicture.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteProfilePicture.fulfilled, (state) => {
        state.status = 'succeeded';
        state.profile = null; // Reset profile data after deletion
      })
      .addCase(deleteProfilePicture.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(getProfilePicture.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getProfilePicture.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profile = action.payload; // Update the profile state with the fetched picture URL
      })
      .addCase(getProfilePicture.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default profilePictureSlice.reducer;
