// src/features/auth/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Type for our auth state
interface AuthState {
  isAuthenticated: boolean;
  user?: any; // or define a real user type

  // Add a field to store error messages (for 401 or other auth issues)
  authErrorMessage: string; 
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: undefined,
  authErrorMessage: '', // start with no error
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLogin: (state, action: PayloadAction<any>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.authErrorMessage = ''; // clear any previous auth error
    },
    setLogout: (state) => {
      state.isAuthenticated = false;
      state.user = undefined;
      state.authErrorMessage = ''; // optional reset
    },

    // For capturing 401 or other auth errors
    setAuthError: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = false;
      state.user = undefined; // or leave user if you prefer
      state.authErrorMessage = action.payload;
    },

    // Let the user close the overlay or handle the error
    clearAuthError: (state) => {
      state.authErrorMessage = '';
    },
  },
});

export const {
  setLogin,
  setLogout,
  setAuthError,
  clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;
