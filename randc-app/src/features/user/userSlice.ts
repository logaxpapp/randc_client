// src/features/user/userSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  // ...other fields
}

interface UserState {
  loading: boolean;
  error: string | null;
  users: User[];
}

const initialState: UserState = {
  loading: false,
  error: null,
  users: [],
};

export const fetchUsers = createAsyncThunk<User[], void>(
  'user/fetchUsers',
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/users`,
        { withCredentials: true } // send cookies
      );
      // assume { success: true, data: [...] }
      return res.data.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.error || 'Failed to fetch users');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // optional sync reducers
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default userSlice.reducer;
